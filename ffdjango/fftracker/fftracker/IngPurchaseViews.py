from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework.generics import ListAPIView
from rest_framework import status
from django.db.models import Prefetch
from .models import Ingredients, MealPlans, Recipes, RecipeIngredients, Households
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

    # pref_isupplier_id = serializers.IntegerField()
    # m_r_num = serializers.IntegerField(blank=True, null=True)
    # s_r_num = serializers.IntegerField(blank=True, null=True)
    # m_servings = serializers.IntegerField()
    # s_servings = serializers.IntegerField()
    

class IPLView(ViewSet):
     def calc_ing_purchase_amt(self, m_date, meal_name, meal_servings, ing, count):
        name = meal_name
        ing_name = ing.ingredient_name
        ing_amt = ing.amt
        ing_unit = ing.unit
        total_required = ing_amt * meal_servings
        total_qty_on_hand = 0
        # Get the ingredients that fulfill this requirement
        IngQueryset = Ingredients.objects.all().filter(ingredient_name = ing_name, unit = ing_unit)
        # For each ingredient option, calculate the total qty we have on hand
        for ingredient in IngQueryset:
            pref_isupplier_id = ingredient.pref_isupplier
            pkg_type = ingredient.pkg_type
            storage_type = ingredient.storage_type
            if ingredient.qty_on_hand:
                total_qty_on_hand += 0
        # Calculate the total amt to purchase
        to_purchase = 0
        if (total_required - total_qty_on_hand > 0):
                to_purchase += total_required - total_qty_on_hand
        # Append this ingredient purchase to the queryset
        return {'id': count,
                'm_date': m_date,
                'name': name,
                'ingredient_name': ing_name,
                'unit': ing_unit,
                'qty_on_hand': total_qty_on_hand,
                'total_required': total_required,
                'to_purchase': to_purchase,
        }
     
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
            meal_serivngs = Decimal(0)
            snack_servings = Decimal(0)

            print(type(meal_servings))

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
                print(m_date)
                queryset.append(self.calc_ing_purchase_amt(m_date, meal_name, meal_servings, ing, count))
                count += 1
            
            for ing in snack_recipe_ings:
                print(m_date)
                queryset.append(self.calc_ing_purchase_amt(m_date, meal_name, snack_servings, ing, count))
                count += 1
                        
        serializer = IPLSerializer(queryset, many=True)
        print(serializer)
        return Response(serializer.data)

# Create your views here.
# class IPMealView(viewsets.ViewSet):
#     # Override create to accept POST requests with date range
#     def list(self, request):
#         startDate = request.query_params.get('startDate')
#         endDate = request.query_params.get('endDate')
#         MealPlansList = MealPlans.objects.filter(m_date__range=[startDate, endDate]).order_by('m_date')
#         #ingredientsList = RecipeIngredients.objects.all()
#         # for x in queryset:
#         #     if 
#         #     ingredientsList = RecipeIngredients.objects.filter()
#         #         querysetIng = Ingredients.objects.filter(in_date__range=[startDate, endDate]).order_by('-in_date')

#         serializer = MealSerializer(MealPlansList, many=True)

#         return Response(serializer.data)
    
    # def retrieve(self, request, pk):
    #     meal_plan = MealPlans.objects.get(m_id=pk)
    #     queryset = Ingredients.objects.filter(paused_flag=False)
    #     meal_r_ing = RecipeIngredients.objects.filter(ri_recipe_num = meal_plan.meal_r_num)
    #     snack_r_ing = RecipeIngredients.objects.filter(ri_recipe_num = meal_plan.snack_r_num)

# class IPSnacksView(viewsets.ViewSet):
#     # Override create to accept POST requests with date range
#     def list(self, request):
#         startDate = request.query_params.get('startDate')
#         endDate = request.query_params.get('endDate')
#         queryset = MealPlans.objects.filter(m_date__range=[startDate, endDate]).order_by('m_date')
#         serializer = SnackSerializer(queryset, many=True)
#         return Response(serializer.data)
