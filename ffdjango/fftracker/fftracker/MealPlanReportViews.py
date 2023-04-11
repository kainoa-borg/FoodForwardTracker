from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from .models import MealPlans, Recipes, Households, Kits, KitPackaging, RecipePackaging, Packaging, PackagingUsages
import json

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
    # Override create to accept POST requests with date range
    def list(self, request):
        startDate = request.query_params.get('startDate')
        endDate = request.query_params.get('endDate')
        queryset = MealPlans.objects.filter(m_date__range=[startDate, endDate]).order_by('m_date')
        # new_queryset = get_latest_items(queryset)
        serializer = MealPlanReportSerializer(queryset, many=True)
        return Response(serializer.data)
    def retrieve(self, request, pk):
        meal_plan = MealPlans.objects.get(m_id=pk)
        queryset = Households.objects.filter(paused_flag=False)
        meal_r_packaging = RecipePackaging.objects.filter(rp_recipe_num = meal_plan.meal_r_num)
        snack_r_packaging = RecipePackaging.objects.filter(rp_recipe_num = meal_plan.snack_r_num)
        meal_servings = 0
        snack_servings = 0

        for household in queryset:
            # print(household.hh_id)
            hh_meal_servings = household.num_adult + household.num_child_gt_6 + (household.num_child_lt_6 *.5)
            hh_snack_servings = household.num_adult + household.num_child_gt_6 + household.num_child_lt_6
            meal_servings += hh_meal_servings
            snack_servings += hh_snack_servings
            # if (meal_r_packaging.count() > 0 or snack_r_packaging.count() > 0):

            # kit = Kits.objects.create(k_date=meal_plan.m_date, k_hh_id=household)

            # for packaging in meal_r_packaging:
                
            #     packaging_options = Packaging.objects.filter(pkg_type = packaging.pkg_type).order_by('-qty_on_hand')
                
            #     for pkg in packaging_options:
                    
            #         if PackagingUsages.objects.count() > 0:
            #             latest_key = PackagingUsages.objects.filter(used_pkg = pkg).latest('p_usage_id').p_usage_id + 1
            #         else:
            #             latest_key = 0

            #         if pkg.qty_on_hand >= hh_meal_servings:
            #             kit_packaging = KitPackaging.objects.create(kp_p_id=pkg.p_id, qty=hh_meal_servings, kp_kit=kit)
            #             PackagingUsages.objects.create(p_usage_id=latest_key, used_date=meal_plan.m_date, used_qty=hh_meal_servings, used_pkg=pkg)
            #             hh_meal_servings = 0
            #             pkg.qty_on_hand -= hh_meal_servings
            #             pkg.save()
            #         elif pkg.qty_on_hand > 0:
            #             kit_packaging = KitPackaging.objects.create(kp_p_id=pkg.p_id, qty=pkg.qty_on_hand, kp_kit=kit)
            #             PackagingUsages.objects.create(p_usage_id=latest_key, used_date=meal_plan.m_date, used_qty=pkg.qty_on_hand, kp_kit=kit)
            #             hh_meal_servings -= pkg.qty_on_hand
            #             pkg.qty_on_hand = 0
            #             pkg.save()
            #         if hh_meal_servings <= 0:
            #             break
            
            # for packaging in snack_r_packaging:
                
            #     packaging_options = Packaging.objects.filter(package_type = packaging.pkg_type).order_by('-qty_on_hand')
                
            #     for pkg in packaging_options:
                
            #         if PackagingUsages.objects.count() > 0:
            #             latest_key = PackagingUsages.objects.filter(used_pkg = pkg).latest('p_usage_id').p_usage_id + 1
            #         else:
            #             latest_key = 0

            #         if pkg.qty_on_hand > hh_snack_servings:
            #             kit_packaging = KitPackaging.objects.create(kp_p_id=pkg.p_id, qty=hh_snack_servings, kp_kit=kit)
            #             PackagingUsages.objects.create(p_usage_id=latest_key, used_date=meal_plan.m_date, used_qty=hh_snack_servings, used_pkg=pkg)
            #             hh_snack_servings = 0
            #             pkg.qty_on_hand -= hh_snack_servings
            #             pkg.save()
            #         elif pkg.qty_on_hand > 0:
            #             kit_packaging = KitPackaging.objects.create(kp_p_id=pkg.p_id, qty=pkg.qty_on_hand, kp_kit=kit)
            #             PackagingUsages.objects.create(p_usage_id=latest_key, used_date=meal_plan.m_date, used_qty=pkg.qty_on_hand, kp_kit=kit)
            #             hh_snack_servings -= pkg.qty_on_hand
            #             pkg.qty_on_hand = 0
            #             pkg.save()
            #         if hh_snack_servings <= 0:
            #             break
            
            # print(hh_meal_servings, hh_snack_servings)

            # if hh_snack_servings > 0 or hh_meal_servings > 0:
            #     return Response(500)

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
