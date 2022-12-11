from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from .models import Recipes, RecipeAllergies, RecipeDiets, RecipeIngredients, RecipeInstructions
# Create your views here.

class AllergySerializer(serializers.ModelSerializer):
	class Meta():
		model = RecipeAllergies
		fields = ('__all__')

class RecipeAllergySerializer(serializers.ModelSerializer):
    allergy = AllergySerializer(many=True)
    class Meta():
        model = RecipeAllergies
        depth = 1
        fields = ('ra_id', 'allergy', 'ra_recipe_num')
    def create(self, validated_data):
        allergy_data = validated_data.pop('allergy')
        recipe_allergy_model = RecipeAllergies.objects.create(**validated_data)
        for allergy in allergy_data:
            allergy['allergy'] = recipe_allergy_model
            allergy['ra_id'] = RecipeAllergies.objects.latest('ra_id').ra_id + 1
            recipe_allergy_model = RecipeAllergies.objects.create(**allergy)
        return recipe_allergy_model

class RecipeDietsSerializer(serializers.ModelSerializer):
    class Meta():
        model = RecipeDiets
        fields = ('__all__')


#Modelname.objects.all
class RecipeDietsView(viewsets.ViewSet):
    def list(self, request):
        keys = ('rd_id', 'diet_category', 'rd_recipe_name')
        query = 'LEFT JOIN recipe_diets rd ON rd.rd_recipe_num = r.r_num'
        queryset = RecipeDiets.objects.all()
        serializer = RecipeDietsSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk):
        query = 'LEFT JOIN recipe_diets rd ON rd.rd_recipe_num = r.r_num=%s'%(pk)
        keys = ('rd_id', 'diet_category', 'rd_recipe_name')
        queryset = RecipeDiets.objects.get(pk)
        serializer = RecipeDietsSerializer(queryset)
        return Response(serializer.data)
    def update(self, request, pk):
        data = request.data
        serializer = RecipeDietsSerializer(data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_200_BADREQUEST)

class RecipesSerializer(ModelSerializer):
    r_num = serializers.CharField(max_length=200)
    r_name = serializers.CharField(max_length=200)
class Meta():
    model = Recipes
    fields = ('r_num', 'r_name')

class RecipeView(viewsets.ViewSet):
    def list(self, request):
        keys = ('r_num', 'r_name')
        query = 'SELECT mp.m_date, ri.prep, ri.amt, ri.unit, i.ingredient_name, ra.allergy, rd.diet_category FROM ingredients AS i JOIN recipe_ingredients AS ri ON i.i_id = ri.ri_ing_id JOIN recipes AS r on ri.ri_recipe_num = r.r_num JOIN meal_plans AS mp ON r.r_num = mp.meal_r_num OR r.r_num = mp.snack_r_num LEFT JOIN recipe_allergies ra ON ra.ra_recipe_num = r.r_num LEFT JOIN recipe_diets rd ON rd.rd_recipe_num = r.r_num WHERE r.r_name = "pizza" OR mp.m_date = "22/11/7"'
        queryset = execute_query(query, keys)
        serializer = RecipesSerializer(queryset)
        return Response(serializer.data)

    def retrieve(self, request, pk):
        query = 'SELECT mp.m_date, ri.prep, ri.amt, ri.unit, i.ingredient_name, ra.allergy, rd.diet_category FROM ingredients AS i JOIN recipe_ingredients AS ri ON i.i_id = ri.ri_ing_id JOIN recipes AS r on ri.ri_recipe_num = r.r_num JOIN meal_plans AS mp ON r.r_num = mp.meal_r_num OR r.r_num = mp.snack_r_num LEFT JOIN recipe_allergies ra ON ra.ra_recipe_num = r.r_num LEFT JOIN recipe_diets rd ON rd.rd_recipe_num = r.r_num WHERE r.r_name = "pizza" OR mp.m_date = "22/11/7"=%s'%(pk)
        keys = ('r_num', 'r_name')
        queryset = Recipes.objects.get(pk)
        serializer = RecipesSerializer(queryset)
        return Response(serializer.data)
    def update(self, request, pk):
        data = request.data
        serializer = RecipesSerializer(data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_200_BADREQUEST)

class RecipeIngredientsSerializer(ModelSerializer):
    class Meta():
        model = RecipeIngredients
        fields = ('__all__')

class RecipeIngredientsView(viewsets.ViewSet):
    def list(self, request):
        keys = ('ri_id', 'amt', 'unit', 'prep', 'ri_ing', 'ri_recipe_num')
        query = 'JOIN recipes AS r on ri.ri_recipe_num = r.r_num'
        queryset = RecipeIngredients.objects.all()
        serializer = RecipeIngredientsSerializer(queryset)
        return Response(serializer.data)

    def retrieve(self, request, pk):
        keys = ('ri_id', 'amt', 'unit', 'prep', 'ri_ing', 'ri_recipe_num')
        query = 'JOIN recipes AS r on ri.ri_recipe_num = r.r_num'
        queryset = RecipeIngredients.objects.get(pk)
        serializer = RecipeIngredientsSerializer(queryset)
        return Response(serializer.data)

    def update(self, request, pk):
        data = request.data
        serializer = RecipeIngredientsSerializer(data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_200_BADREQUEST)

class RecipeInstructionsSerializer(ModelSerializer):
    class Meta():
        model = RecipeInstructions
        fields = ('__all__')

class RecipeInstructionsView(viewsets.ViewSet):
    def list(self, request):
        keys = ('inst_id', 'step_no', 'step_inst', 'stn_name', 'inst_recipe_name')
        query = 'JOIN recipe_instructions rin ON rin.inst_recipe_num = r.r_num'
        queryset = RecipeInstructions.objects.all()
        serializer = RecipeInstructionsSerializer(queryset)
        return Response(serializer.data)

    def retrieve(self, request, pk):
        keys = ('inst_id', 'step_no', 'step_inst', 'stn_name', 'inst_recipe_name')
        query = 'JOIN recipe_instructions rin ON rin.inst_recipe_num = r.r_num'
        queryset = RecipeInstructions.objects.get(pk)
        serializer = RecipeInstructionsSerializer(queryset)
        return Response(serializer.data)

    def update(self, request, pk):
        data = request.data
        serializer = RecipeInstructionsSerializer(data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_200_BADREQUEST)
