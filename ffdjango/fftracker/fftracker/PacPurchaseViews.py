from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from .models import MealPlans, RecipePackaging, PackagingUsages, Packaging
from django.db.models import Prefetch
import os

def get_latest_items(queryset):
	new_queryset = []
	i = 0
	while i < len(queryset):
		print(len(queryset))
		#find similar items
		similar_items = [n for n in queryset if n.meal_r_num == queryset[i].meal_r_num]
		print('%a, %a'%(queryset[i].meal_r_num, len(similar_items)))
		# if this is not duplicated
		if len(similar_items) <= 1:
			#put it in queryset
			new_queryset.append(queryset[i])
		#if this is a duplicate
		elif len(similar_items) > 1:
			print('in this section')
			#if this is most recent (date) item
			latest_similar_item = similar_items[0]
			for n in similar_items:
				if n.m_date > latest_similar_item.m_date:
					#put it in queryset
					latest_similar_item = n
			queryset - [x for x in queryset if x.meal_r_num != latest_similar_item.meal_r_num]
			new_queryset.append(latest_similar_item)
		i += 1

	return new_queryset

class PackagingUsagesSerializer(ModelSerializer):
	used_qty = serializers.IntegerField()
	class Meta():
		model = PackagingUsages
		fields = ('used_date', 'used_qty')

class RecipePackagingSerializer(ModelSerializer):
	pkg_type = serializers.CharField(max_length=45)
	class Meta():
		model = RecipePackaging
		fields = ('pkg_type')

class PPLSerializer(ModelSerializer):
	meal_name = serializers.CharField(max_length=200)
	snack_name = serializers.CharField(max_length=200)
	recipe_packaging = RecipePackagingSerializer()
	packaging_usages = PackagingUsagesSerializer()
	class Meta():
		model = MealPlans
		fields = ('m_id', 'm_date', 'meal_name', 'snack_name', 'snack_r_num', 'meal_r_num')

class PPLView(viewsets.ViewSet):
	def list(self, request):
		# keys = ('m_id', 'm_date', 'snack_r_num', 'meal_r_num', 'num_servings', 'meal_name', 'snack_name')
		# query = "SELECT mp.*, (SELECT r_name FROM recipes WHERE mp.meal_r_num = r_num) AS meal_name, (SELECT r_name FROM recipes WHERE mp.snack_r_num = r_num) AS snack_name FROM meal_plans mp"
		queryset = MealPlans.objects.prefetch_related(Prefetch('packaging_usages', queryset=PackagingUsages.objects.all())).all().all()
		print(queryset[0].__dict__['_prefetched_objects_cache']['packaging_usages'].__dict__)
		serializer = PPLSerializer(queryset, many=True)
		return Response(serializer.data)
	def retrieve(self, request, pk):
		query = "SELECT mp.*, (SELECT r_name FROM recipes WHERE mp.meal_r_num = r_num) AS meal_name, (SELECT r_name FROM recipes WHERE mp.snack_r_num = r_num) AS snack_name FROM meal_plans mp WHERE mp.m_id=%s"%(pk)
		keys = ('m_id', 'm_date', 'snack_r_num', 'meal_r_num', 'meal_name', 'snack_name', 'num_servings')
		queryset = execute_query(query, keys)
		serializer = PPLSerializer(queryset)
		return Response(serializer.data)
	def update(self, request, pk):
		update_obj = MealPlans.objects.get(pk)
		serializer = PPLSerializer(update_obj, data=request.data)
		if serializer.is_valid():
			obj = serializer.save()
			obj.save()
			return Response(status=status.HTTP_200_OK)
		return Response(status=status.HTTP_200_BADREQUEST)
