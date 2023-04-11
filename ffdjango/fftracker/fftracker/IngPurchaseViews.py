from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
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

class IPLSerializer(ModelSerializer):
    class Meta():
        model = RecipeIngredients
        depth = 1
        fields = ('__all__')
    
# Create your views here.
class IPMealView(viewsets.ViewSet):
    # Override create to accept POST requests with date range
    def list(self, request):
        startDate = request.query_params.get('startDate')
        endDate = request.query_params.get('endDate')
        MealPlansList = MealPlans.objects.filter(m_date__range=[startDate, endDate]).order_by('m_date')
        #ingredientsList = RecipeIngredients.objects.all()
        # for x in queryset:
        #     if 
        #     ingredientsList = RecipeIngredients.objects.filter()
        #         querysetIng = Ingredients.objects.filter(in_date__range=[startDate, endDate]).order_by('-in_date')

        serializer = MealSerializer(MealPlansList, many=True)

        return Response(serializer.data)
    
    # def retrieve(self, request, pk):
    #     meal_plan = MealPlans.objects.get(m_id=pk)
    #     queryset = Ingredients.objects.filter(paused_flag=False)
    #     meal_r_ing = RecipeIngredients.objects.filter(ri_recipe_num = meal_plan.meal_r_num)
    #     snack_r_ing = RecipeIngredients.objects.filter(ri_recipe_num = meal_plan.snack_r_num)

class IPSnacksView(viewsets.ViewSet):
    # Override create to accept POST requests with date range
    def list(self, request):
        startDate = request.query_params.get('startDate')
        endDate = request.query_params.get('endDate')
        queryset = MealPlans.objects.filter(m_date__range=[startDate, endDate]).order_by('m_date')
        serializer = SnackSerializer(queryset, many=True)
        return Response(serializer.data)
        


