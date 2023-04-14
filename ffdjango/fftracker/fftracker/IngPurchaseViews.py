from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework.generics import ListAPIView
from rest_framework import status
from django.db.models import Prefetch
from .models import Ingredients, IPLMealPlans, MealPlans, Recipes, RecipeIngredients
from .SupplierViews import SupplierSerializer

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


class MealSerializer(ModelSerializer):
    recipe_ingredients = RecipeIDSerializer(many=True)
    servings = serializers.CharField(source='meal_servings')
    name = serializers.CharField(source='meal_r_num.r_name')
    r_num = serializers.CharField(source='meal_r_num')
    name = serializers.CharField(source='meal_r_num.r_name')
    class Meta():
        model = IPLMealPlans
        depth = 1
        fields = ('m_id', 'm_date', 'name', 'r_num', 'servings', 'recipe_ingredients', 'ri_recipe_num')

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
    amt = serializers.IntegerField(default='', required=False)
    pkg_type = serializers.CharField(allow_blank=True)
    storage_type = serializers.CharField(allow_blank=True)
    qty_on_hand = serializers.IntegerField(default='', required=False)
    total_required = serializers.IntegerField(default='', required=False)
    pref_isupplier_id = serializers.CharField(allow_blank=True)
    to_purchase = serializers.IntegerField(default='', required=False)

    # pref_isupplier_id = serializers.IntegerField()
    # m_r_num = serializers.IntegerField(blank=True, null=True)
    # s_r_num = serializers.IntegerField(blank=True, null=True)
    # m_servings = serializers.IntegerField()
    # s_servings = serializers.IntegerField()
    

class IPLView(ViewSet): 
     def list(self, request):
        count = 0
        id = 0
        m_date = ''
        r_num = 0
        m_r_num = 0
        s_r_num = 0
        meal_servings = 0
        snack_servings = 0
        name = ''
        meal_name = ''
        snack_name = ''
        ingredient_name = ''
        unit = ''
        amt = 0
        pkg_type = ''
        storage_type = ''
        qty_on_hand = 0
        total_required = 0
        pref_isupplier_id = 0        
        pref_isupplier = ''
        to_purchase = 0

        queryset = []
        #queryset.clear()
        startDate = request.query_params.get('startDate')
        endDate = request.query_params.get('endDate')
        MealsQueryset = MealPlans.objects.filter(m_date__range=[startDate, endDate]).order_by('-m_date')
        IngQueryset = Ingredients.objects.all()
        recipeset = Recipes.objects.all()

        # Get every meal and snack for the date range
        for meals in MealsQueryset:
            m_r_num = meals.meal_r_num
            s_r_num = meals.snack_r_num
            meal_name = meals.meal_r_num.r_name
            snack_name = meals.snack_r_num.r_name
            m_date = meals.m_date
            meal_servings = meals.meal_servings
            snack_servings = meals.snack_servings
            mealRecipeIngs = RecipeIngredients.objects.filter(ri_recipe_num=m_r_num)
            snackRecipeIngs = RecipeIngredients.objects.filter(ri_recipe_num=s_r_num)

            # For each meal in the list...                       
            for meal in mealRecipeIngs:
                name = meal_name
                ingredient_name = meal.ingredient_name
                amt = meal.amt
                unit = meal.unit
                total_required = amt * meal_servings

                # get all ingredients for that meal
                for ingredient in IngQueryset:
                    if ingredient_name == ingredient.ingredient_name:
                        qty_on_hand = ingredient.qty_on_hand
                        pref_isupplier_id = ingredient.pref_isupplier
                        pkg_type = ingredient.pkg_type
                        storage_type = ingredient.storage_type
                        if (int(total_required or 0) - int(qty_on_hand or 0)) > 0:
                            to_purchase = int(total_required or 0) - int(qty_on_hand or 0)
                        else: 
                            to_purchase = 0
                        queryset.append({'id': count,
                                         'm_date': m_date,
                                         'name': name,
                                         'ingredient_name': ingredient_name,
                                         'unit': unit,
                                         'amt': amt,
                                         'pkg_type': pkg_type,
                                         'storage_type': storage_type,
                                         'qty_on_hand': qty_on_hand,
                                         'total_required': total_required,
                                         'to_purchase': to_purchase,
                                         'pref_isupplier_id': pref_isupplier_id})
                        count += 1
            
            # for each snack in that date range
            for snack in snackRecipeIngs:
                ingredient_name = snack.ingredient_name
                name = snack_name
                amt = snack.amt
                unit = snack.unit
                total_required = amt * snack_servings
                for ingredient in IngQueryset:
                    if ((ingredient_name == ingredient.ingredient_name)): #(unit == ingredient.unit) & 
                        qty_on_hand = ingredient.qty_on_hand
                        pref_isupplier_id = ingredient.pref_isupplier
                        pkg_type = ingredient.pkg_type
                        storage_type = ingredient.storage_type
                        if (int(total_required or 0) - int(qty_on_hand or 0)) > 0:
                            to_purchase = int(total_required or 0) - int(qty_on_hand or 0)
                        else: 
                            to_purchase = 0
                        queryset.append({'id': count,
                                         'm_date': m_date,
                                         'name': name,
                                         'ingredient_name': ingredient_name,
                                         'unit': unit,
                                         'amt': amt,
                                         'pkg_type': pkg_type,
                                         'storage_type': storage_type,
                                         'qty_on_hand': qty_on_hand,
                                         'total_required': total_required,
                                         'to_purchase': to_purchase,
                                         'pref_isupplier_id': pref_isupplier_id})
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
