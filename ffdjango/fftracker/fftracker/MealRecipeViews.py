from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from PIL import Image
import json

from .models import Recipes, RecipeAllergies, RecipeDiets, RecipeIngredients, RecipeInstructions, RecipePackaging
from .IngredientViews import IngredientNameSerializer
# Create your views here.

class AllergySerializer(serializers.ModelSerializer):
	class Meta():
		model = RecipeAllergies
		fields = ('allergy',)

class RecipeAllergySerializer(serializers.ModelSerializer):
    allergy = AllergySerializer(many=True)
    class Meta():
        model = RecipeAllergies
        # depth = 1
        fields = ('allergy',)
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
        # depth = 1
        fields = ('diet_category',)

class RecipeIngredientSerializer(ModelSerializer):
    ingredient_name = serializers.CharField(read_only=True, source='ri_ing.ingredient_name')
    class Meta():
        model = RecipeIngredients
        # depth = 1
        fields = ('ingredient_name', 'amt', 'unit', 'prep', 'ri_ing')

class RecipeInstructionsSerializer(ModelSerializer):
    class Meta():
        model = RecipeInstructions
        # depth = 1
        fields = ('step_no', 'step_inst', 'stn_name')

class RecipePackagingSerializer(ModelSerializer):
    pkg_type = serializers.CharField(read_only=True, source='rp_pkg.package_type')
    class Meta():
        model = RecipePackaging
        # depth = 1
        fields = ('amt', 'pkg_type', 'rp_pkg')

class RecipeImageSerializer(serializers.ModelSerializer):
    class Meta():
        model = Recipes
        fields = ('r_img_path')

class RecipeImageView(viewsets.ViewSet):
    def list(self, request):
        return Response('list')
    def retrieve(self, request, pk):
        return Response(pk)
    def patch(self, request, pk):
        queryset = Recipes.objects.filter(r_num = pk)
        if len(queryset) > 0:
            img = Image.open(request.data['file'])
            try:
                img.verify()
            except:
                print('image corrupt')
                return Response(request)
            img = Image.open(request.data['file'])
            abs_file_path = 'var/www/html/Images/r_%s_image.jpg'%(pk)
            rel_file_path = 'Images/r_%s_image.jpg'%(pk)
            img.save(abs_file_path)
            queryset[0].r_img_path = rel_file_path
            queryset[0].save()
            
        return Response(200)


class RecipeCardView(viewsets.ViewSet):
    def list(self, request):
        return Response('list')
    def retrieve(self, request, pk):
        return Response(pk)
    def patch(self, request, pk):
        queryset = Recipes.objects.filter(r_num = pk)
        if len(queryset) > 0:
            img = Image.open(request.data['file'])
            try:
                img.verify()
            except:
                print('image corrupt')
                return Response(request)
            img = Image.open(request.data['file'])
            abs_file_path = 'var/www/html/Images/r_%s_card.jpg'%(pk)
            rel_file_path = 'Images/r_%s_card.jpg'%(pk)
            img.save(abs_file_path)
            queryset[0].r_card_path = rel_file_path
            queryset[0].save()
            
        return Response(200)


class RecipesSerializer(ModelSerializer):
    r_num = serializers.CharField(max_length=200)
    r_name = serializers.CharField(max_length=200)
    r_ingredients = RecipeIngredientSerializer(many=True)
    r_packaging = RecipePackagingSerializer(many=True)
    r_diets = RecipeDietsSerializer(many=True)
    r_allergies = AllergySerializer(many=True)
    r_instructions = RecipeInstructionsSerializer(many=True)

    class Meta():
        model = Recipes
        # depth = 1
        fields = ('r_num', 'r_name', 'r_img_path', 'r_card_path', 'r_ingredients', 'r_packaging', 'r_diets', 'r_instructions', 'r_allergies')

    def create(self, validated_data):
        ings = validated_data.pop('r_ingredients')
        pkgs = validated_data.pop('r_packaging')
        diets = validated_data.pop('r_diets')
        instructions = validated_data.pop('r_instructions')
        for ing in ings:
            RecipeIngredients(ing).save()
        for pkg in pkgs:
            RecipePackaging(pkg).save()
        for diet in diets:
            RecipeDiets(diet).save()
        for instruction in instructions:
            RecipeInstructions(instruction).save()
        
        recipe_instance = Recipes.objects.create(**validated_data)

        return recipe_instance

    def update(self, recipe_instance, validated_data):
		# raise serializers.ValidationError("IM HERE")
        ings = validated_data.pop('r_ingredients')
        pkgs = validated_data.pop('r_packaging')
        diets = validated_data.pop('r_diets')
        instructions = validated_data.pop('r_instructions')
        allergies = validated_data.pop('r_allergies')
		# ing_instance = Ingredients.objects.create(**validated_data)
        if ings:
            RecipeIngredients.objects.all().filter(ri_recipe_num = recipe_instance).delete()
            for ing in ings:
                if (RecipeIngredients.objects.count() > 0):
                    latest_id = RecipeIngredients.objects.latest('ri_id').ri_id +1
                else:
                    latest_id = 0
                ing['ri_id'] = latest_id
                ing['ri_recipe_num'] = recipe_instance
                # raise serializers.ValidationError(usage)
                RecipeIngredients.objects.create(**ing)
        if pkgs:
          RecipePackaging.objects.all().filter(rp_recipe_num = recipe_instance).delete()
          for pkg in pkgs:
              if (RecipePackaging.objects.count() > 0):
                  latest_id = RecipePackaging.objects.latest('rp_id').rp_id +1
              else:
                  latest_id = 0
              pkg['rp_id'] = latest_id
              pkg['rp_recipe_num'] = recipe_instance
              # raise serializers.ValidationError(usage)
              RecipePackaging.objects.create(**pkg)
        if diets:
            RecipeDiets.objects.all().filter(rd_recipe_num = recipe_instance).delete()
            for diet in diets:
                if (RecipeDiets.objects.count() > 0):
                    latest_id = RecipeDiets.objects.latest('rd_id').rd_id + 1
                else:
                    latest_id = 0
                diet['rd_id'] = latest_id
                diet['rd_recipe_num'] = recipe_instance
                RecipeDiets.objects.create(**diet)
        if instructions:
            RecipeInstructions.objects.all().filter(inst_recipe_num = recipe_instance).delete()
            for inst in instructions:
                if (RecipeInstructions.objects.count() > 0):
                    latest_id = RecipeInstructions.objects.latest('inst_id').inst_id + 1
                else:
                    latest_id = 0
                inst['inst_id'] = latest_id
                inst['inst_recipe_num'] = recipe_instance
                RecipeInstructions.objects.create(**inst)
        if allergies:
            RecipeAllergies.objects.all().filter(ra_recipe_num = recipe_instance).delete()
            for allergy in allergies:
                if (RecipeAllergies.objects.count() > 0):
                    latest_id = RecipeAllergies.objects.latest('ra_id').ra_id + 1
                else:
                    latest_id = 0
                allergy['ra_id'] = latest_id
                allergy['ra_recipe_num'] = recipe_instance
                RecipeAllergies.objects.create(**allergy)
        recipe_instance.r_num = validated_data.get('r_num')
        recipe_instance.r_name = validated_data.get('r_name')
        return recipe_instance


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
    

class RecipeView(viewsets.ModelViewSet):
    def list(self, request):
        # keys = ('r_num', 'r_name')
        # query = 'SELECT mp.m_date, ri.prep, ri.amt, ri.unit, i.ingredient_name, ra.allergy, rd.diet_category FROM ingredients AS i JOIN recipe_ingredients AS ri ON i.i_id = ri.ri_ing_id JOIN recipes AS r on ri.ri_recipe_num = r.r_num JOIN meal_plans AS mp ON r.r_num = mp.meal_r_num OR r.r_num = mp.snack_r_num LEFT JOIN recipe_allergies ra ON ra.ra_recipe_num = r.r_num LEFT JOIN recipe_diets rd ON rd.rd_recipe_num = r.r_num WHERE r.r_name = "pizza" OR mp.m_date = "22/11/7"'
        # queryset = execute_query(query, keys)
        # serializer = RecipesSerializer(queryset)
        # return Response(serializer.data)
        queryset = Recipes.objects.all().prefetch_related('r_ingredients').prefetch_related('r_packaging').prefetch_related('r_diets').prefetch_related('r_instructions').prefetch_related('r_allergies')
        serializer = RecipesSerializer(queryset, many=True)
        return Response(serializer.data)

    # def retrieve(self, pk):
        # query = 'SELECT mp.m_date, ri.prep, ri.amt, ri.unit, i.ingredient_name, ra.allergy, rd.diet_category FROM ingredients AS i JOIN recipe_ingredients AS ri ON i.i_id = ri.ri_ing_id JOIN recipes AS r on ri.ri_recipe_num = r.r_num JOIN meal_plans AS mp ON r.r_num = mp.meal_r_num OR r.r_num = mp.snack_r_num LEFT JOIN recipe_allergies ra ON ra.ra_recipe_num = r.r_num LEFT JOIN recipe_diets rd ON rd.rd_recipe_num = r.r_num WHERE r.r_name = "pizza" OR mp.m_date = "22/11/7"=%s'%(pk)
        # keys = ('r_num', 'r_name')
        # print('entered retrieve')
        # queryset = Recipes.objects.get(r_num=pk)
        # print('still no error')
        # serializer = RecipesSerializer(queryset)
        # return Response(serializer.data)
    
    queryset = Recipes.objects.all().prefetch_related('r_ingredients').prefetch_related('r_packaging').prefetch_related('r_diets').prefetch_related('r_instructions').prefetch_related('r_allergies')
    serializer_class = RecipesSerializer

class RecipeIngredientsView(viewsets.ViewSet):
    def list(self, request):
        keys = ('ri_id', 'amt', 'unit', 'prep', 'ri_ing', 'ri_recipe_num')
        query = 'JOIN recipes AS r on ri.ri_recipe_num = r.r_num'
        queryset = RecipeIngredients.objects.all()
        serializer = RecipeIngredientSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk):
        keys = ('ri_id', 'amt', 'unit', 'prep', 'ri_ing', 'ri_recipe_num')
        query = 'JOIN recipes AS r on ri.ri_recipe_num = r.r_num'
        queryset = RecipeIngredients.objects.get(pk)
        serializer = RecipeIngredientSerializer(queryset)
        return Response(serializer.data)

    def update(self, request, pk):
        data = request.data
        serializer = RecipeIngredientSerializer(data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_200_BADREQUEST)

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
    
class RecipePackagingView(viewsets.ModelViewSet):
    queryset = RecipePackaging.objects.all()
    serializer_class = RecipePackagingSerializer

class RecipeAllergyView(viewsets.ModelViewSet):
    queryset = RecipeAllergies.objects.all()
    serializer_class = RecipeAllergySerializer
