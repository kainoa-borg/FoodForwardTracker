from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from .models import Recipes, RecipeAllergies, RecipeDiets, RecipeIngredients, RecipeInstructions, RecipePackaging
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
            allergy['ra_id'] = RecipeAllergies.objects.latest('hh_a_id').hh_a_id + 1
            recipe_allergy_model = RecipeAllergies.objects.create(**allergy)
        return recipe_allergy_model

class RecipeDietsSerializer(serializers.ModelSerializer):
    class Meta():
        model = RecipeDiets
        fields = ('__all__')

class RecipeDietsView(viewsets.ViewSet):
    def list(self, request):
        keys = ('i_id', 'ingredient_name', 'pkg_type', 'storage_type', 'in_date', 'in_qty', 'unit', 'exp_date', 'qty_on_hand', 'unit_cost', 'flat_fee', 'isupplier_id', 'pref_supplier_id', 'isupplier_name', 'pref_isupplier_name')
        query = "SELECT i.*, (SELECT s_name FROM supplier WHERE i.isupplier_id = s_id) AS isupplier_name, (SELECT s_name FROM supplier WHERE i.pref_isupplier_id = s_id) AS pref_supplier_name FROM ingredients i"
        queryset = execute_query(query, keys, many=True)
        serializer = RecipeDietsSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk):
        query = "SELECT i.*, (SELECT s_name FROM supplier WHERE i.isupplier_id = s_id) AS isupplier_name, (SELECT s_name FROM supplier WHERE i.pref_isupplier_id = s_id) AS pref_supplier_name FROM ingredients i WHERE i.i_id=%s"%(pk)
        keys = ('i_id', 'ingredient_name', 'pkg_type', 'storage_type', 'in_date', 'in_qty', 'unit', 'exp_date', 'qty_on_hand', 'unit_cost', 'flat_fee', 'isupplier_id', 'pref_supplier_id', 'isupplier_name', 'pref_isupplier_name')
        queryset = execute_query(query, keys)
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

class RecipeView(viewsets.View):
    def list(self, request):
        keys = 'r_num', 'r_name'
        
