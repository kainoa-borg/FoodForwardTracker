from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework.generics import ListAPIView
from rest_framework import status
from django.db.models import Prefetch
from .models import Ingredients, IngredientNames, IngredientUnits, MealPlans, Recipes, RecipeIngredients, Households
from .SupplierViews import SupplierSerializer
from decimal import *

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

class IPLSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    m_date = serializers.CharField(allow_blank=True)
    name = serializers.CharField(allow_blank=True)
    ingredient_name = serializers.CharField(allow_blank=True)
    unit = serializers.CharField(allow_blank=True)
    qty_on_hand = serializers.IntegerField(default='', required=False)
    total_required = serializers.IntegerField(default='', required=False)
    to_purchase = serializers.IntegerField(default='', required=False)
    converted = serializers.BooleanField(default='', required=False)

    # pref_isupplier_id = serializers.IntegerField()
    # m_r_num = serializers.IntegerField(blank=True, null=True)
    # s_r_num = serializers.IntegerField(blank=True, null=True)
    # m_servings = serializers.IntegerField()
    # s_servings = serializers.IntegerField()
    
# Kainoa Borges Revised 7-21-23
class IPLView(ViewSet):
    def calc_ing_purchase_amt(self, m_date, meal_name, meal_servings, ing, count):
        name = meal_name
        ing_name = ing.ingredient_name
        ing_amt = ing.amt
        # Default ing conversion ratio (if no unit is defined, there will be no conversion)
        ing_conv_ratio = 1
        # Empty ing unit definition
        ing_unit_def = None
        # Empty ing_shop_unit
        ing_shop_unit = None
        # Default ing_unit (recipe unit by default)
        ing_unit = ing.unit
        # Default converted value (False by default)
        converted = False

        # Get ing name definition
        try:
            ing_name_def = IngredientNames.objects.get(ing_name=ing_name)
        except:
            ing_name_def = None
        # If ing definition exists
        if ing_name_def:
            # Get unit definiton for this recipe unit
            try:
                ing_unit_def = IngredientUnits.objects.get(i_name_id=ing_name_def, recipe_unit=ing.unit)
            except:
                ing_unit_def = None
            # If unit definiton exists
            if ing_unit_def:
                # Calculate ing conversion ratio (shop amount / recipe amount)
                ing_conv_ratio = ing_unit_def.shop_amt / ing_unit_def.recipe_amt
                # Set the ing_unit to equal the defined shoppable unit
                ing_unit = ing_unit_def.shop_unit
                # Set converted to True
                converted = True

        # convert ing amount and calculate amount required
        total_required = ing_amt * ing_conv_ratio * meal_servings
        # default qty_on_hand
        total_qty_on_hand = 0
        # Get any existing ingredients that fulfill this requirement
        IngQueryset = Ingredients.objects.all().filter(ingredient_name = ing_name, unit = ing_unit)
        # For each existing ingredient inventory item, calculate the total qty we have on hand
        for ingredient in IngQueryset:
            pref_isupplier_id = ingredient.pref_isupplier
            pkg_type = ingredient.pkg_type
            storage_type = ingredient.storage_type
            if ingredient.qty_on_hand:
                total_qty_on_hand += ingredient.qty_on_hand
        # Calculate the total amt to purchase
        to_purchase = 0
        if (total_required - total_qty_on_hand > 0):
                to_purchase += total_required - total_qty_on_hand
        # Append this ingredient purchase to the queryset
        return {
             "ing_name": ing_name,
             "ing_unit": ing_unit,
             "data": {
                "id": count,
                'm_date': m_date,
                'name': name,
                'ingredient_name': ing_name,
                'unit': ing_unit,
                'qty_on_hand': total_qty_on_hand,
                'total_required': total_required,
                'to_purchase': to_purchase,
                'converted': converted,
            }
        }
    
    def combine_ing_dict_entries(self, ing_calc, ing_dict):
        ing_name = ing_calc["ing_name"]
        ing_unit = ing_calc["ing_unit"]
        # If this ing is already in ing_dict
        if ing_name in ing_dict:
            # If this unit is already in ing_dict
            if ing_unit in ing_dict[ing_name]:
                # Add relevant fields
                temp_ing = ing_dict[ing_name][ing_unit]
                temp_ing["total_required"] += ing_calc["data"]["total_required"]
                temp_ing["to_purchase"] += ing_calc["data"]["to_purchase"]
                ing_dict[ing_name][ing_unit] = temp_ing
            else:
                ing_dict[ing_name][ing_unit] = ing_calc["data"]
        else:
            ing_dict[ing_name] = {ing_unit: ing_calc["data"]}
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

            hh_queryset = Households.objects.all().filter(paused_flag=False)
            for household in hh_queryset:
                hh_meal_servings = household.num_adult + household.num_child_gt_6 + (household.num_child_lt_6 *.5)
                hh_snack_servings = household.num_adult + household.num_child_gt_6 + household.num_child_lt_6
                meal_servings += Decimal(hh_meal_servings)
                snack_servings += Decimal(hh_snack_servings)

            # Ingredients for the meal and snack
            meal_recipe_ings = RecipeIngredients.objects.filter(ri_recipe_num=m_r_num)
            snack_recipe_ings = RecipeIngredients.objects.filter(ri_recipe_num=s_r_num)

            for ing in meal_recipe_ings:
                ing_calc = self.calc_ing_purchase_amt(m_date, meal_name, meal_servings, ing, count)
                self.combine_ing_dict_entries(ing_calc, ing_dict)
                          
                count += 1
            
            for ing in snack_recipe_ings:
                ing_calc = self.calc_ing_purchase_amt(m_date, meal_name, meal_servings, ing, count)
                self.combine_ing_dict_entries(ing_calc, ing_dict)

                count += 1

        for ing_name in ing_dict:
            for ing_unit in ing_dict[ing_name]:
                data = ing_dict[ing_name][ing_unit]
                queryset.append(data)
                 
                        
        serializer = IPLSerializer(queryset, many=True)
        return Response(serializer.data)