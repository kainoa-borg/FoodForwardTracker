from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from django.db.models import Prefetch
from .models import Ingredients, MealPlans, Recipes, RecipeIngredients

class RecipeSerializer(ModelSerializer):
     class Meta():
          model = Recipes
          fields = ('r_num')

class RecipeIDSerializer(ModelSerializer):
     class Meta():
          model = RecipeIngredients 
          fields = ('__all__')

class MealPlanReportSerializer(ModelSerializer):
    r_num = RecipeSerializer(many=True)
    recipe_ingredients = RecipeIDSerializer(many=True)
    meal_name = serializers.CharField(source='meal_r_num.r_name')
    snack_name = serializers.CharField(source='snack_r_num.r_name')
    class Meta():
        model = MealPlans
        depth = 1
        fields = ('m_id', 'm_date', 'meal_name', 'snack_name', 'meal_servings', 'snack_servings', 'r_num', 'recipe_ingredients')
        read_only_fields = ('m_id',)

class MealPlanReportView(viewsets.ViewSet):
    # Override create to accept POST requests with date range
    def list(self, request):
        startDate = request.query_params.get('startDate')
        endDate = request.query_params.get('endDate')
        queryset = MealPlans.objects.filter(m_date__range=[startDate, endDate]).order_by('m_date')
        serializer = MealPlanReportSerializer(queryset, many=True)
        return Response(serializer.data)

class MPSerializer(ModelSerializer):
    meal_name = serializers.CharField(source='meal_r_num.r_name')
    snack_name = serializers.CharField(source='snack_r_num.r_name')
    class Meta():
        model = MealPlans
        fields = ('m_id', 'm_date', 'meal_name', 'snack_name', 'meal_servings', 'snack_servings')
        
class IPLSerializer(ModelSerializer):
	#meals_snacks = MPSerializer(many=True)
	isupplier = serializers.CharField(max_length=200)
	pref_isupplier = serializers.CharField(max_length=200)
	class Meta():
		model = Ingredients
		depth = 1
		fields = ('i_id', 'ingredient_name', 'pkg_type', 'storage_type', 'unit', 'unit_cost', 'isupplier', 'pref_isupplier')

# Create your views here.
class IPLView(viewsets.ModelViewSet):
        def list(self, request):
            startDate = request.query_params.get('startDate')
            endDate = request.query_params.get('endDate')
            queryset = MealPlans.objects.filter(m_date__range=[startDate, endDate]).order_by('m_date')
            serializer = MealPlanReportSerializer(queryset, many=True)
            return Response(serializer.data)


