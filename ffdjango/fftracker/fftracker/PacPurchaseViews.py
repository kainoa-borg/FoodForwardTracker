from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from .models import MealPlans, RecipePackaging, PackagingUsages, Packaging
from django.db.models import Prefetch
from collections import defaultdict
import os

def get_latest_items(queryset, fieldName):
		new_queryset = []
		i = 0
		while i < len(queryset):
			print(len(queryset))
            # find similar items
			similar_items = [n for n in queryset if getattr(n, fieldName) == getattr(queryset[i], fieldName)]
			print('%a, %a'%(getattr(queryset[i],fieldName), len(similar_items)))
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
				queryset = [x for x in queryset if getattr(x, fieldName) != getattr(latest_similar_item, fieldName)]
				new_queryset.append(latest_similar_item)
			i += 1
		return new_queryset

class PackagingUsageSerializer(ModelSerializer):
	used_qty = serializers.IntegerField()
	class Meta():
		model = PackagingUsages
		fields = ('used_date', 'used_qty')

class RecipePackagingSerializer(ModelSerializer):
	pkg_type = serializers.CharField(max_length=45)

	class Meta():
		model = RecipePackaging
		fields = ('pkg_type', 'rp_pkg')

class MealPlansSerializer(ModelSerializer):
	meal_name = serializers.CharField(source='meal_r_num.r_name')
	snack_name = serializers.CharField(source='snack_r_num.r_name')
	meal_servings = serializers.CharField()
	snack_servings = serializers.CharField()
	m_date = serializers.DateField()
	class Meta():
		model = MealPlans
		fields = ('m_id', 'm_date', 'meal_name', 'snack_name', 'snack_r_num', 'meal_r_num')

class PPLSerializer(ModelSerializer):
	meal_plans = MealPlansSerializer()
	packaging_usage = PackagingUsageSerializer()
	recipe_packaging = RecipePackagingSerializer()
	class Meta():
		model = Packaging
		fields = ('__all__')

class PPLView(viewsets.ViewSet):
	def list(self, request):
		startDate = request.query_params.get('startDate')
		endDate = request.query_params.get('endDate')
		if (startDate and endDate):
			queryset = MealPlans.objects.filter(m_date__range=[startDate, endDate]).order_by('m_date')
		else:
			queryset = MealPlans.objects.all().order_by('m_date')
		meal_queryset = get_latest_items(queryset, 'meal_r_num')
		serializer = PPLSerializer(meal_queryset, many=True)


		startDate = request.query_params.get('startDate')
		endDate = request.query_params.get('endDate')
		if (startDate and endDate):
			queryset = PackagingUsages.objects.filter(used_date__range=[startDate, endDate]).order_by('used_date')
		else:
			queryset = PackagingUsages.objects.order_by('used_date')
		packaging_queryset = get_latest_items(queryset, 'used_qty')
		serializer = PPLSerializer(packaging_queryset, many=True)


		startDate = request.query_params.get('startDate')
		endDate = request.query_params.get('endDate')
		if (startDate and endDate):
			queryset = RecipePackaging.objects.filter(pkg_type__range=[startDate, endDate]).order_by('pkg_type')
		else:
			queryset = RecipePackaging.objects.order_by('pkg_type')
		serializer = PPLSerializer(queryset, many=True)
		return Response(serializer.data)
    
	# def retrieve(self, request, pk):
	# 	query = "SELECT mp.*, (SELECT r_name FROM recipes WHERE mp.meal_r_num = r_num) AS meal_name, (SELECT r_name FROM recipes WHERE mp.snack_r_num = r_num) AS snack_name FROM meal_plans mp WHERE mp.m_id=%s"%(pk)
	# 	keys = ('m_id', 'm_date', 'snack_r_num', 'meal_r_num', 'meal_name', 'snack_name', 'num_servings')
	# 	queryset = execute_query(query, keys)
	# 	serializer = PPLSerializer(queryset)
	# 	return Response(serializer.data)
	# def update(self, request, pk):
	# 	update_obj = Packaging.objects.get(pk)
	# 	serializer = PPLSerializer(update_obj, data=request.data)
	# 	if serializer.is_valid():
	# 		obj = serializer.save()
	# 		obj.save()
	# 		return Response(status=status.HTTP_200_OK)
	# 	return Response(status=status.HTTP_200_BADREQUEST)
	
# queryset = Packaging.objects.prefetch_related(Prefetch('packaging_usage', queryset=PackagingUsages.objects.all())).all().all()
		# print(queryset[0].__dict__['_prefetched_objects_cache']['packaging_usage'].__dict__)


#from datetime import date, timedelta
def list(self, request):
	startDate = request.query_params.get('startDate')
	endDate = request.query_params.get('endDate')

	meal_plans = MealPlans.objects.filter(m_date__range=(startDate, endDate))
	package_type_totals = defaultdict(lambda: {"total_qty_on_hand": 0, "qty_needed": 0, "total_cost": 0})
	for meal_plan in meal_plans:
    # calculate servings needed for meal and snack
		meal_servings = meal_plan.meal.rp_pkg.servings_per_recipe * meal_plan.meal_servings
		# snack_servings = meal_plan.snack.rp_pkg.servings_per_recipe * meal_plan.snack_servings
    
    # process meal packaging
		meal_rp_pkg = meal_plan.meal.rp_pkg
		meal_packaging_options = Packaging.objects.filter(pkg_type=meal_rp_pkg.pkg_type).order_by("-qty_on_hand")
	for packaging in meal_packaging_options:
		qty_on_hand = packaging.qty_on_hand
		if qty_on_hand >= meal_servings:
			qty_needed = qty_on_hand - meal_servings
			cost = qty_needed * packaging.unit_cost
			package_type_totals[meal_rp_pkg.pkg_type]["total_qty_on_hand"] += qty_on_hand
			package_type_totals[meal_rp_pkg.pkg_type]["qty_needed"] += qty_needed
			package_type_totals[meal_rp_pkg.pkg_type]["total_cost"] += cost
		break
    
    # process snack packaging
def list(self, request):
	startDate = request.query_params.get('startDate')
	endDate = request.query_params.get('endDate')

	meal_plans = MealPlans.objects.filter(m_date__range=(startDate, endDate))
	package_type_totals = defaultdict(lambda: {"total_qty_on_hand": 0, "qty_needed": 0, "total_cost": 0})

	snack_servings = meal_plans.snack.rp_pkg.servings_per_recipe * meal_plans.snack_servings
	snack_rp_pkg = MealPlans.snack_r_num.rp_pkg
	snack_packaging_options = Packaging.objects.filter(pkg_type=snack_rp_pkg.pkg_type).order_by("-qty_on_hand")
	for packaging in snack_packaging_options:
		qty_on_hand = packaging.qty_on_hand
		if qty_on_hand >= snack_servings:
			qty_needed = qty_on_hand - snack_servings
			cost = qty_needed * packaging.unit_cost
			package_type_totals[snack_rp_pkg.pkg_type]["qty_on_hand"] += qty_on_hand
			package_type_totals[snack_rp_pkg.pkg_type]["qty_needed"] += qty_needed
			package_type_totals[snack_rp_pkg.pkg_type]["total_cost"] += cost
			break
    
    # handle duplicate package types by adding totals to existing entry
def list(self, request):
	startDate = request.query_params.get('startDate')
	endDate = request.query_params.get('endDate')
	pkg_type_totals = defaultdict(lambda: {"total_qty_on_hand": 0, "qty_needed": 0, "total_cost": 0})
	snack_rp_pkg = MealPlans.snack_r_num.rp_pkg
	meal_rp_pkg = MealPlans.meal.rp_pkg

	for pkg_type, totals in pkg_type_totals.items():
		if pkg_type != meal_rp_pkg.pkg_type and pkg_type != snack_rp_pkg.pkg_type:
			continue
		if pkg_type == meal_rp_pkg.pkg_type and pkg_type == snack_rp_pkg.pkg_type:
            # both meal and snack use the same package type, so only add once
			continue
	pkg_type_totals[pkg_type]["total_qty_on_hand"] += totals["total_qty_on_hand"]
	pkg_type_totals[pkg_type]["qty_needed"] += totals["qty_needed"]
	pkg_type_totals[pkg_type]["total_cost"] += totals["total_cost"]