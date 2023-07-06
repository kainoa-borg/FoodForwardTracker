from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
import datetime
from .models import MealPlans, Recipes, Households, Kits, KitPackaging, RecipePackaging, Packaging, PackagingUsages, HhMealPlans, ServingCalculations
import json

# Filters for duplicates, selecting only the most recent items
def get_latest_items(queryset, fieldName):
        new_queryset = []
        i = 0
        while i < len(queryset):
            print(len(queryset))
            # find similar items
            similar_items = [n for n in queryset if getattr(n, fieldName) == getattr(queryset[i], fieldName)]
            print('%a, %a'%(getattr(queryset[i],fieldName).r_name, len(similar_items)))
            # if this is a duplicate
            if len(similar_items) >= 1:
                print('duplicates')
                # if this is the most recent (date) item
                latest_similar_item = similar_items[0]
                for n in similar_items:
                    if n.m_date > latest_similar_item.m_date:
                        latest_similar_item = n
                # put it in the queryset
                # remove duplicates from the original queryset
                queryset = [x for x in queryset if getattr(x, fieldName) != getattr(latest_similar_item, fieldName)]
                new_queryset.append(latest_similar_item)
            # if this is not a duplicate
            else:
                print('no duplicates')
                # put it in the queryset
                new_queryset.append(queryset[i])
            i += 1
        return new_queryset

class MealPlanReportSerializer(ModelSerializer):
    # meal_name = serializers.CharField(max_length=50)
    # snack_name = serializers.CharField(max_length=50)
    meal_name = serializers.CharField(source='meal_r_num.r_name')
    snack_name = serializers.CharField(source='snack_r_num.r_name')
    class Meta():
        model = MealPlans
        fields = ('m_id', 'm_date', 'meal_name', 'snack_name', 'meal_servings', 'snack_servings')
        # fields = ('__all__')
        read_only_fields = ('m_id',)

class KitSerializer(ModelSerializer):
    class Meta():
        model = Kits
        fields = '__all__'

class MealPlanReportView(viewsets.ViewSet):
    # Get all meal plans within this date range
    def list(self, request):
        startDate = request.query_params.get('startDate')
        endDate = request.query_params.get('endDate')
        queryset = MealPlans.objects.filter(m_date__range=[startDate, endDate]).order_by('m_date')
        serializer = MealPlanReportSerializer(queryset, many=True)
        return Response(serializer.data)
    # Get this meal plan and calculate servings for it
    def retrieve(self, request, pk):
        meal_plan = MealPlans.objects.get(m_id=pk)
        queryset = Households.objects.filter(paused_flag=False)
        meal_r_packaging = RecipePackaging.objects.filter(rp_recipe_num = meal_plan.meal_r_num)
        snack_r_packaging = RecipePackaging.objects.filter(rp_recipe_num = meal_plan.snack_r_num)
        meal_servings = 0
        snack_servings = 0

        package_id_dict = dict()

        serving_calculation = None
        try:
            serving_calculation = ServingCalculations.objects.get(calc_meal_plan=meal_plan)
            serving_calculation.delete()
            serving_calculation = ServingCalculations.objects.create(calc_meal_plan=meal_plan, calc_date=datetime.date.today())
        except:
            serving_calculation = ServingCalculations.objects.create(calc_meal_plan=meal_plan, calc_date=datetime.date.today())

        try:
            for household in queryset:
                # Calculate meal servings for this household
                hh_meal_servings = household.num_adult + household.num_child_gt_6 + (household.num_child_lt_6 *.5)
                hh_snack_servings = household.num_adult + household.num_child_gt_6 + household.num_child_lt_6
                meal_servings += hh_meal_servings
                snack_servings += hh_snack_servings

                # Only create kits for this planned meal if it requires packaging
                if (meal_r_packaging.count() > 0 or snack_r_packaging.count() > 0):
                    if (Kits.objects.count() > 0):
                        latest_kit_key = Kits.objects.latest('k_id').k_id + 1
                    else:
                        latest_kit_key = 0
                    kit = Kits.objects.create(k_date=meal_plan.m_date, k_hh_id=household, k_s_c=serving_calculation)
                    if (HhMealPlans.objects.count() > 0):
                        latest_hhmp_key = HhMealPlans.objects.latest('hh_m_id').hh_m_id + 1
                    else:
                        latest_hhmp_key = 0
                    HhMealPlans.objects.create(meal_id=meal_plan.m_id, meal_hh_id=household, hh_s_c=serving_calculation)

                # Perform operations on meal packaging
                for packaging in meal_r_packaging:
                    packaging_options = Packaging.objects.filter(package_type = packaging.pkg_type).order_by('-qty_on_hand')
                    # Total_qty available for this package type
                    total_qty = 0
                    # Calculate total_qty across all options, add each to dict
                    for pkg in packaging_options:
                        total_qty += pkg.qty_on_hand
                        if pkg.p_id not in package_id_dict:
                            package_id_dict[pkg.p_id] = {'qty_on_hand': pkg.qty_on_hand, 'used_qty': 0}
                    # If there isn't enough packaging for this meal, return an error
                    if (total_qty < meal_servings):
                        # Calculate servings failed, delete all created objects and return error message
                        serving_calculation.delete()
                        meal_plan.meal_servings=None
                        meal_plan.snack_servings=None
                        meal_plan.save()
                        return Response({"errorText": "Not enough %ss in inventory"%(packaging.pkg_type)}, 400)
                    # Calculate usages across each packaging option
                    for pkg in packaging_options:
                        # Get latest key for packaging usages        

                        # If this entry has enough for this houshold
                        if package_id_dict[pkg.p_id]['qty_on_hand'] >= hh_meal_servings:
                            # Take from this inventory entry
                            if (KitPackaging.objects.count() > 0):
                                latest_key = KitPackaging.objects.latest('kp_id').kp_id + 1
                            else:
                                latest_key = 0
                            KitPackaging.objects.create(kp_id=latest_key, kp_p_id=pkg.p_id, qty=hh_meal_servings, kp_kit=kit)
                            package_id_dict[pkg.p_id]['used_qty'] += hh_meal_servings
                            package_id_dict[pkg.p_id]['qty_on_hand'] -= hh_meal_servings
                            hh_meal_servings = 0
                        # If this entry doesn't have enough for all of this household
                        elif package_id_dict[pkg.p_id]['qty_on_hand'] > 0:
                            # Use what is left and continue
                            if (KitPackaging.objects.count() > 0):
                                latest_key = KitPackaging.objects.latest('kp_id').kp_id + 1
                            else:
                                latest_key = 0
                            KitPackaging.objects.create(kp_id=latest_key, kp_p_id=pkg.p_id, qty=pkg.qty_on_hand, kp_kit=kit)
                            package_id_dict[pkg.p_id]['used_qty'] += hh_meal_servings
                            package_id_dict[pkg.p_id]['qty_on_hand'] -= hh_meal_servings
                            hh_meal_servings -= pkg.qty_on_hand
                        # If we have packages for all servings, go to next package type
                        if hh_meal_servings <= 0:
                            break

                # Perform operations on snack_packaging
                for packaging in snack_r_packaging:
                    packaging_options = Packaging.objects.filter(package_type = packaging.pkg_type).order_by('-qty_on_hand')
                    total_qty = 0
                    for pkg in packaging_options:
                        total_qty += pkg.qty_on_hand
                        if pkg.p_id not in package_id_dict:
                            package_id_dict[pkg.p_id] = {'qty_on_hand': pkg.qty_on_hand, 'used_qty': 0}
                    if (total_qty < snack_servings):
                        # Return not enough quantity on hand error message !!!
                        return Response("Not enough %ss in inventory"%(packaging.pkg_type), 400)
                    for pkg in packaging_options:

                        if package_id_dict[pkg.p_id]['qty_on_hand'] >= hh_snack_servings:
                            if (KitPackaging.objects.count() > 0):
                                latest_key = KitPackaging.objects.latest('kp_id').kp_id + 1
                            else:
                                latest_key = 0
                            KitPackaging.objects.create(kp_id=latest_key, kp_p_id=pkg.p_id, qty=hh_snack_servings, kp_kit=kit)
                            package_id_dict[pkg.p_id]['used_qty'] += hh_snack_servings
                            package_id_dict[pkg.p_id]['qty_on_hand'] -= hh_snack_servings
                            hh_snack_servings = 0
                        elif package_id_dict[pkg.p_id]['qty_on_hand'] > 0:
                            if (KitPackaging.objects.count() > 0):
                                latest_key = KitPackaging.objects.latest('kp_id').kp_id + 1
                            else:
                                latest_key = 0
                            KitPackaging.objects.create(kp_id=latest_key, kp_p_id=pkg.p_id, qty=pkg.qty_on_hand, kp_kit=kit)
                            package_id_dict[pkg.p_id]['used_qty'] += hh_snack_servings
                            package_id_dict[pkg.p_id]['qty_on_hand'] -= hh_snack_servings
                            hh_snack_servings -= pkg.qty_on_hand
                        if hh_snack_servings <= 0:
                            break
        except:
            print("Exception Here")
            # Calculate servings failed, clear package ids, delete this serving calc run, and return error message
            package_id_dict = {}
            serving_calculation.delete()
            meal_plan.meal_servings=None
            meal_plan.snack_servings=None
            meal_plan.save()
            return Response({"errorText": "Internal Server Error"}, 500)


        
        # Create usages on these packaging entries
        for pkg_id in package_id_dict.keys():
            print(pkg_id)
            if PackagingUsages.objects.count() > 0:
                latest_key = PackagingUsages.objects.all().latest('p_usage_id').p_usage_id + 1
            else:
                latest_key = 0
            pkg_obj = Packaging.objects.filter(p_id=pkg_id)
            # Create pkg usage on this object
            pkg_usage = PackagingUsages.objects.create(p_usage_id=latest_key, used_date=meal_plan.m_date, used_qty=package_id_dict[pkg_id]['used_qty'], used_pkg=pkg_obj.first(), used_s_c=serving_calculation)
            # Associate the usage with this package
            pkg_obj.update(qty_on_hand=pkg_obj.first().qty_on_hand - package_id_dict[pkg_id]['used_qty'])

        meal_plan.meal_servings=meal_servings
        meal_plan.snack_servings=snack_servings
        meal_plan.save()
        return Response(200)
    
class MealHistoryReportView(viewsets.ViewSet):
    def list(self, request):
        startDate = request.query_params.get('startDate')
        endDate = request.query_params.get('endDate')
        if (startDate and endDate):
            queryset = MealPlans.objects.filter(m_date__range=[startDate, endDate]).order_by('-m_date')
        else:
            queryset = MealPlans.objects.all().order_by('-m_date')
        meal_queryset = get_latest_items(queryset, 'meal_r_num')
        serializer = MealPlanReportSerializer(meal_queryset, many=True)
        return Response(serializer.data)
    
class SnackHistoryReportView(viewsets.ViewSet):
    def list(self, request):
        startDate = request.query_params.get('startDate')
        endDate = request.query_params.get('endDate')
        if (startDate and endDate):
            queryset = MealPlans.objects.filter(m_date__range=[startDate, endDate]).order_by('-m_date')
        else:
            queryset = MealPlans.objects.all().order_by('-m_date')
        print(queryset)
        new_queryset = get_latest_items(queryset, 'snack_r_num')
        serializer = MealPlanReportSerializer(new_queryset, many=True)
        return Response(serializer.data)
