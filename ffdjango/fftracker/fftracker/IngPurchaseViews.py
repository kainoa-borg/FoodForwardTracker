from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from django.db.models import Prefetch
from .models import Ingredients, IngredientUsages
import os

def get_latest_items(queryset):
        new_queryset = []
        i = 0
        while i < len(queryset):
            print(len(queryset))
            # find similar items
            similar_items = [n for n in queryset if n.meal_r_num == queryset[i].meal_r_num]
            print('%a, %a'%(queryset[i].meal_r_num, len(similar_items)))
            # if this is not a duplicate
            if len(similar_items) <= 1:
                # put it in the queryset
                new_queryset.append(queryset[i])
            # if this is a duplicate
            elif len(similar_items) > 1:
                print('in this section')
                # if this is the most recent (date) item
                latest_similar_item = similar_items[0]
                for n in similar_items:
                    if n.m_date > latest_similar_item.m_date:
                        # put it in the queryset
                        latest_similar_item = n
                queryset = [x for x in queryset if x.meal_r_num != latest_similar_item.meal_r_num]
                new_queryset.append(latest_similar_item)
            i += 1

        return new_queryset

class IngredientUsageSerializer(ModelSerializer):
	class Meta():
		model = IngredientUsages
		fields = ('used_date', 'used_qty')

class IPLSerializer(ModelSerializer):
	isupplier = serializers.CharField(max_length=200)
	pref_isupplier = serializers.CharField(max_length=200)
	ingredient_usage = IngredientUsageSerializer()
	class Meta():
		model = Ingredients
		fields = ('i_id', 'ingredient_name', 'pkg_type', 'storage_type', 'in_date', 'in_qty', 'ingredient_usage', 'unit', 'exp_date', 'unit_cost', 'flat_fee', 'isupplier', 'pref_isupplier')

# Create your views here.
class IPLView(viewsets.ViewSet):
	def list(self, request):
		#keys = ('i_id', 'ingredient_name', 'pkg_type', 'storage_type', 'in_date', 'in_qty', 'unit', 'exp_date', 'qty_on_hand', 'unit_cost', 'flat_fee', 'isupplier_id', 'pref_supplier_id', 'isupplier_name', 'pref_isupplier_name')
		#query = "SELECT i.*, (SELECT s_name FROM supplier WHERE i.isupplier_id = s_id) AS isupplier_name, (SELECT s_name FROM supplier WHERE i.pref_isupplier_id = s_id) AS pref_supplier_name FROM ingredients i"
		#queryset = execute_query(query, keys, many=True)
		queryset = Ingredients.objects.prefetch_related(Prefetch('ingredient_usage', queryset=IngredientUsages.objects.all())).all().all()
		print(queryset[0].__dict__['_prefetched_objects_cache']['ingredient_usage'].__dict__)
		serializer = IPLSerializer(queryset, many=True)
		return Response(serializer.data)
	def retrieve(self, request, pk):
		query = "SELECT i.*, (SELECT s_name FROM supplier WHERE i.isupplier_id = s_id) AS isupplier_name, (SELECT s_name FROM supplier WHERE i.pref_isupplier_id = s_id) AS pref_supplier_name FROM ingredients i WHERE i.i_id=%s"%(pk)
		keys = ('i_id', 'ingredient_name', 'pkg_type', 'storage_type', 'in_date', 'in_qty', 'unit', 'exp_date', 'qty_on_hand', 'unit_cost', 'flat_fee', 'isupplier_id', 'pref_supplier_id', 'isupplier_name', 'pref_isupplier_name')
		queryset = execute_query(query, keys)
		serializer = IPLSerializer(queryset)
		return Response(serializer.data)
	def update(self, request, pk):
		update_obj = Ingredients.Objects.get(pk)
		serializer = IPLSerializer(update_obj, data=request.data)
		if serializer.is_valid():
			obj = serializer.save()
			obj.save()
			return Response(status=status.HTTP_200_OK)
		return Response(status=status.HTTP_200_BADREQUEST)
