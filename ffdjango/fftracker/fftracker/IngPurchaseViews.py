from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework.generics import ListAPIView
from rest_framework import status
from django.db.models import Prefetch
from django.db.models import Q
from .models import Ingredients, IngredientNames, IngredientUnits, MealPlans, Recipes, RecipeIngredients, Households
from .SupplierViews import SupplierSerializer
from decimal import *
import math

class RecipeSerializer(ModelSerializer):
     class Meta():
          model = Recipes
          fields = ('r_num')

class RecipeIDSerializer(ModelSerializer):
     class Meta():
          model = RecipeIngredients 
          fields = (['ri_recipe_num'])

class IngPurchaseSerializer(ModelSerializer):
	isupplier = SupplierSerializer(read_only=True)
	pref_isupplier = SupplierSerializer(read_only=True)
	class Meta():
		model = Ingredients
		fields = ('i_id', 'ingredient_name', 'pkg_type', 'storage_type', 'in_date', 'in_qty', 'qty_on_hand', 'unit', 'exp_date', 'unit_cost', 'flat_fee', 'isupplier_id', 'pref_isupplier_id', 'isupplier', 'pref_isupplier')


# class MealSerializer(ModelSerializer):
#     recipe_ingredients = RecipeIDSerializer(many=True)
#     servings = serializers.CharField(source='meal_servings')
#     name = serializers.CharField(source='meal_r_num.r_name')
#     r_num = serializers.CharField(source='meal_r_num')
#     name = serializers.CharField(source='meal_r_num.r_name')
#     class Meta():
#         model = IPLMealPlans
#         depth = 1
#         fields = ('m_id', 'm_date', 'name', 'r_num', 'servings', 'recipe_ingredients', 'ri_recipe_num')

class SnackSerializer(ModelSerializer):
    # recipe_ingredients = RecipeIDSerializer(many=True)
    servings = serializers.CharField(source='meal_servings')
    name = serializers.CharField(source='snack_r_num.r_name')
    r_num = serializers.CharField(source='snack_r_num')
    class Meta():
        model = MealPlans
        depth = 1
        fields = ('m_id', 'm_date', 'name', 'r_num', 'servings')

class ShopUnitSerializer(serializers.Serializer):
    unit = serializers.CharField(allow_blank=True)
    qty_on_hand = serializers.IntegerField(default='', required=False)
    total_required = serializers.IntegerField(default='', required=False)
    to_purchase = serializers.IntegerField(default='', required=False)

class IPLSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    m_date = serializers.CharField(allow_blank=True)
    name = serializers.CharField(allow_blank=True)
    ingredient_name = serializers.CharField(allow_blank=True)
    unit_index = serializers.IntegerField(read_only=True)
    units = ShopUnitSerializer(many=True)
    converted = serializers.BooleanField(read_only=True)
    
    # pref_isupplier_id = serializers.IntegerField()
    # m_r_num = serializers.IntegerField(blank=True, null=True)
    # s_r_num = serializers.IntegerField(blank=True, null=True)
    # m_servings = serializers.IntegerField()
    # s_servings = serializers.IntegerField()
    
# Kainoa Borges Revised 8-5-2023
class IPLView(ViewSet):
    def calc_ing_purchase_amt(self, m_date, meal_name, meal_servings, recipe_servings, ing, count):
        name = meal_name
        converted = False

        units = {}
        
        if not recipe_servings or recipe_servings == 0:
            recipe_servings = 1        

        try:
            ing_name_def = IngredientNames.objects.get(ing_name=ing.ingredient_name)
        except:
            ing_name_def = None
        ing_unit_defs = IngredientUnits.objects.filter(Q(recipe_unit__icontains=ing.unit), i_name_id=ing_name_def)
        if len(ing_unit_defs) < 1:
            ing_unit_defs = IngredientUnits.objects.filter(Q(recipe_unit__icontains=ing.unit[0:-2]), i_name_id=ing_name_def)
            print([n.recipe_unit for n in ing_unit_defs])
        if len(ing_unit_defs) > 0:
            for unit_def in ing_unit_defs:
                # Calculate converted total_required
                total_required = meal_servings * (ing.amt / recipe_servings) * (unit_def.shop_amt / unit_def.recipe_amt)
                # Add to unit dict
                units[unit_def.shop_unit] = {'unit': unit_def.shop_unit, 'total_required': total_required, 'qty_on_hand': 0}
                converted = True
        else:
            # Default to the recipe unit
            units[ing.unit] = {'unit': ing.unit, 'total_required': meal_servings * (ing.amt / recipe_servings), 'qty_on_hand': 0}
            
        matching_ingredients = Ingredients.objects.filter(ingredient_name = ing.ingredient_name)
        # Calculate totals for each shoppable unit across all required shoppable units
        for ingredient in matching_ingredients:
            if ingredient.qty_on_hand > 0 and ingredient.unit in units:
                units[ingredient.unit]['qty_on_hand'] += ingredient.qty_on_hand

        # Calculate to purchase
        for unit in units:
            units[unit]['to_purchase'] = units[unit]['total_required'] - units[unit]['qty_on_hand']

        return {
             "ing_name": ing.ingredient_name,
             "data": {
                "id": count,
                'm_date': m_date,
                'name': name,
                'ingredient_name': ing.ingredient_name,
                'unit_index': 0,
                'converted': converted,
                'units': units
            }
        }
    
    def combine_ing_dict_entries(self, ing_calc, ing_dict):
        ing_name = ing_calc['ing_name']
        ing_shop_units = ing_calc['data']['units']
        if ing_name in ing_dict:
            for unit in ing_calc['data']['units']:
                if unit in ing_dict[ing_name]['data']['units']:
                    temp_ing_unit = ing_dict[ing_name]['data']['units'][unit]
                    temp_ing_unit['to_purchase'] += ing_shop_units[unit]['to_purchase']
                    temp_ing_unit['total_required'] += ing_shop_units[unit]['total_required']
                    temp_ing_unit['qty_on_hand'] += ing_shop_units[unit]['qty_on_hand']
                    ing_dict[ing_name]['data']['units'][unit] = temp_ing_unit
                else:
                    ing_dict[ing_name]['data']['units'][unit] = ing_shop_units[unit]
        else:
            ing_dict[ing_name] = {'data': ing_calc['data']}
                

        # for unit in ing_calc['data']['units']:
        #     ing_name = ing_calc["ing_name"]
        #     ing_unit = unit
        #     # If this ing is already in ing_dict
        #     if ing_name in ing_dict:
        #         # If this unit is already in ing_dict
        #         if ing_unit in ing_dict[ing_name]:
        #             # Add relevant fields
        #             temp_ing = ing_dict[ing_name][ing_unit]
        #             temp_ing["total_required"] += ing_calc["data"][ing_unit]["total_required"]
        #             temp_ing["to_purchase"] += ing_calc["data"][ing_unit]["to_purchase"]
        #             ing_dict[ing_name][ing_unit] = temp_ing
        #         else:
        #             ing_dict[ing_name][ing_unit] = ing_calc["data"]
        #     else:
        #         ing_dict[ing_name] = {ing_unit: ing_calc["data"]}
        return

    def list(self, request):
        count = 0
        m_date = ''
        m_r_num = 0
        s_r_num = 0
        meal_servings = 0
        snack_servings = 0
        meal_name = ''

        queryset = []
        #queryset.clear()
        startDate = request.query_params.get('startDate')
        endDate = request.query_params.get('endDate')
        MealsQueryset = MealPlans.objects.filter(m_date__range=[startDate, endDate]).order_by('-m_date')

        ing_dict = {}

        # Get every meal and snack for the date range
        for meals in MealsQueryset:
            # Meal and snack ids for filtering
            m_r_num = meals.meal_r_num
            s_r_num = meals.snack_r_num
            # Meal names to display
            meal_name = meals.meal_r_num.r_name
            snack_name = meals.snack_r_num.r_name
            # Planned meal date
            m_date = meals.m_date
            # Serving Calculations
            getcontext().prec = 2
            meal_servings = Decimal(0)
            snack_servings = Decimal(0)

            hh_queryset = Households.objects.filter(paused_flag=False)
            for household in hh_queryset:
                hh_meal_servings = household.num_adult + household.num_child_gt_6 + (household.num_child_lt_6 *.5)
                hh_snack_servings = household.num_adult + household.num_child_gt_6 + household.num_child_lt_6
                meal_servings += Decimal(hh_meal_servings)
                snack_servings += Decimal(hh_snack_servings)

            # Ingredients for the meal and snack
            meal_recipe_ings = RecipeIngredients.objects.filter(ri_recipe_num=m_r_num)
            snack_recipe_ings = RecipeIngredients.objects.filter(ri_recipe_num=s_r_num)
            
            print(meal_servings)
            print(snack_servings)
            meal_recipe_servings = Recipes.objects.get(r_num=m_r_num.r_num).r_servings
            snack_recipe_servings = Recipes.objects.get(r_num=s_r_num.r_num).r_servings
            print(meal_recipe_servings)
            print(snack_recipe_servings)

            for ing in meal_recipe_ings:
                ing_calc = self.calc_ing_purchase_amt(m_date, meal_name, meal_servings, meal_recipe_servings, ing, count)
                self.combine_ing_dict_entries(ing_calc, ing_dict)
                          
                count += 1
            
            for ing in snack_recipe_ings:
                ing_calc = self.calc_ing_purchase_amt(m_date, meal_name, meal_servings, snack_recipe_servings, ing, count)
                self.combine_ing_dict_entries(ing_calc, ing_dict)

                count += 1

        for ing_name in ing_dict:
            ing_dict[ing_name]['data']['units'] = ing_dict[ing_name]['data']['units'].values()
            for ing_unit in ing_dict[ing_name]['data']['units']:
                ing_unit['to_purchase'] = math.ceil(ing_unit['to_purchase'])
                ing_unit['total_required'] = math.ceil(ing_unit['total_required'])
            data = ing_dict[ing_name]['data']
            queryset.append(data)
                 
                        
        serializer = IPLSerializer(queryset, many=True)
        return Response(serializer.data)