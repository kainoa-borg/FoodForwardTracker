from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from models import KitPackaging, Kits, MealPlans, Recipes, RecipePackaging

from helperfuncs import household_servings_list

class KitReportSerializer(ModelSerializer):
    hh_first_name = serializers.CharField(source='k_hh_id.hh_first_name')
    hh_last_name = serializers.CharField(source='k_hh_id.hh_last_name')
    contents = serializers.CharField()
    class Meta():
        model = Kits
        fields = ('hh_first_name', 'hh_last_name', 'kit_packaging')


class KitReportView(viewsets.ViewSet):
    def retrieve(self, request, pk):
        data = []

        meal_plan = MealPlans.objects.get(pk)
        meal = Recipes.objects.get(r_num = meal_plan.meal_r_num)
        snack = Recipes.objects.get(r_num = meal_plan.snack_r_num)
        meal_packaging = RecipePackaging.objects.filter(rp_recipe_num = meal)
        snack_packaging = RecipePackaging.objects.filter(rp_recipe_num = snack)
        household_servings = household_servings_list()
        for hh_serving_calc in household_servings:
            hh_instance = hh_serving_calc.household
            m_servings = hh_serving_calc.m_servings
            s_servings = hh_serving_calc.s_servings
            data.append({'hh_first_name': hh_instance.hh_first_name,
                         'hh_last_name': hh_instance.hh_last_name,
                         'contents': m_servings})
            
class KitTableView(viewsets.ViewSet):
    def retrieve(self, request, pk):
        meal_plan = MealPlans.objects.get(pk)
        recipe_packaging = RecipePackaging.objects.filter()
            
