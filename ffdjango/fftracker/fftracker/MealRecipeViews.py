from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from rest_framework.decorators import action
from PIL import Image
from io import BytesIO
from datetime import datetime as dt
import os


from .models import ImageUpload, Recipes, RecipeAllergies, RecipeDiets, RecipeIngredients, Stations, StationIngredients, RecipePackaging, RecipeInstructions
from .IngredientViews import IngredientNameSerializer
from .StationViews import StationIngSerializer, StationsSerializer
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
    ri_id = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta():
        model = RecipeIngredients
        # depth = 1
        fields = ('ri_id', 'ingredient_name', 'amt', 'unit', 'prep')
        read_only_fields = ('ri_id', 'prep')

class RecipeStationSerializer(ModelSerializer):
    stn_ings = StationIngSerializer(many=True, read_only=False)
    class Meta():
        model = Stations
        fields = ('stn_num', 'stn_name', 'stn_desc', 'stn_ings')
        read_only_fields = ('stn_num',)

class RecipePackagingSerializer(ModelSerializer):
    rp_id = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta():
        model = RecipePackaging
        # depth = 1
        fields = ('rp_id', 'pkg_type', 'pkg_contents', 'ing_name', 'amt', 'rp_pkg')
        read_only_fields = ['rp_id', 'rp_pkg', 'amt']

# Blob Storage Endpoint https://foodforwardstorage.blob.core.windows.net/
class RecipeImageSerializer(serializers.ModelSerializer):
    class Meta():
        model = Recipes
        fields = ('r_img_path', 'r_img_upload')

class TempCardUploadView(viewsets.ViewSet):
    def retrieve(self, request, pk):
        return Response(pk)
    def create(self, request):
        # Creates hash based on current datetime
        def hash_datetime():
            curr_time = dt.now()
            return (str(int(round(curr_time.timestamp())) % 12))
        # save the temporary card uploaded for this session
        # get card file from request
        # img = Image.open(request.data['file']).convert('RGB')
        # store card with identifier for this session
        rel_file_path = 'Images/temp_r_card_%s.pdf'%(hash_datetime())
        abs_file_path = 'var/www/html/' + rel_file_path
        if not os.path.exists('var/www/html/Images'):
            os.makedirs('var/www/html/Images')
        with open(abs_file_path, 'wb') as f:
            f.write(request.data['file'].read())
        # img.save(abs_file_path)
        # return a link to temporary card
        return Response(rel_file_path)
    
    def patch(self, request, pk):
        os.remove('var/www/html/' + request.data['path'])
        return Response(200)

class TempImageUploadView(viewsets.ViewSet):
    def list(self, request):
        return Response(os.path.abspath('var/www/Image'))

    def retrieve(self, request, pk):
        return Response(pk)
    
    def create(self, request):
        # Creates hash based on current datetime
        def hash_datetime():
            curr_time = dt.now()
            return (str(int(round(curr_time.timestamp())) % 999999))
        img = Image.open(request.data['file'])
        try:
            img.verify()
        except:
            print('image corrupt')
            return Response(request)
        file = request.data['file']
        img = Image.open(request.data['file']).convert('RGB')
        img_buffer = BytesIO()
        rel_file_path = 'r_%s_image.jpg'%(0)
        img.save(img_buffer, format='JPEG')
        file.file = img_buffer
        file.name = rel_file_path
        ImageUpload.objects.create(file=file)
        return Response(200)
    
    def patch(self, request, pk):
        return Response(200)

class ImageUploadSerializer(ModelSerializer):
    class Meta:
        model = ImageUpload
        fields = ('file', 'date_uploaded')

class RecipeImageView(viewsets.ViewSet):
    def list(self, request):
        return Response('list')
    def retrieve(self, request, pk):
        queryset = Recipes.objects.filter(r_num = pk)
        recipe = queryset[0]
        r_img_upload = recipe.r_img_upload
        serializer = ImageUploadSerializer(r_img_upload)
        print(r_img_upload)
        print(serializer.data)
        return Response(serializer.data)
    def patch(self, request, pk):
        queryset = Recipes.objects.filter(r_num = pk)
        img = Image.open(request.data['file'])
        try:
            img.verify()
        except:
            print('image corrupt')
            return Response(request)
        file = request.data['file']
        img = Image.open(request.data['file']).convert('RGB')
        img_buffer = BytesIO()
        rel_file_path = 'r_%s_image.jpg'%(pk)
        img.save(img_buffer, format='JPEG')
        file.file = img_buffer
        file.name = rel_file_path
        r_image = ImageUpload.objects.create(file=file)
        serializer = ImageUploadSerializer(r_image)
        r_img_path = serializer.data['file']
        # r_obj.r_img_path = rel_file_path
        # r_obj.save(update_fields=['r_img_path'])
        Recipes.objects.filter(r_num=pk).update(r_img_path = r_img_path, r_img_upload = r_image)
            
        return Response(queryset[0].r_img_path)
    
    def destroy(self, request, pk):
        r_obj = Recipes.objects.get(pk=pk)
        # r_obj.save(update_fields=['r_img_path'])
        r_img_upload = r_obj.r_img_upload
        if (r_img_upload):
            r_img_upload.file.delete()
            r_img_upload.delete()
        updated_count = Recipes.objects.filter(pk=pk).update(r_img_path = None)
        if updated_count > 0:
            return Response(200)
        else:
            return Response(500)
         
class RecipeCardView(viewsets.ViewSet):
    def list(self, request):
        return Response('list')
    def retrieve(self, request, pk):
        return Response(pk)
    def patch(self, request, pk):
        queryset = Recipes.objects.filter(r_num = pk)
        if len(queryset) > 0:
            # img = Image.open(request.data['file'])
            # img = Image.open(request.data['file']).convert('RGB')
            file_name = 'r_%s_card.pdf'%(pk)
            file = request.data['file']
            file.name = file_name
            r_card_upload = ImageUpload.objects.create(file=request.data['file'])
            serializer = ImageUploadSerializer(r_card_upload)
            r_card_path = serializer.data['file']
            queryset.update(r_card_path = r_card_path, r_card_upload = r_card_upload)
            
        return Response(queryset[0].r_card_path)
    
    def destroy(self, request, pk):
        r_obj = Recipes.objects.get(pk=pk)
        r_card_upload = r_obj.r_card_upload
        if (r_card_upload):
            r_card_upload.file.delete()
            r_card_upload.delete()
        updated_count = Recipes.objects.filter(pk=pk).update(r_card_path = None)
        if updated_count > 0:
            return Response(200)
        else:
            return Response(500)

class RecipesSerializer(ModelSerializer):
    # r_num = serializers.CharField(max_length=200)
    r_name = serializers.CharField(max_length=200)
    r_img_path = serializers.CharField(read_only=True)
    r_card_path = serializers.CharField(read_only=True)
    r_servings = serializers.IntegerField()
    r_ingredients = RecipeIngredientSerializer(many=True)
    r_packaging = RecipePackagingSerializer(many=True)
    r_diets = RecipeDietsSerializer(many=True)
    r_allergies = AllergySerializer(many=True)
    r_stations = StationsSerializer(many=True)
    m_s = serializers.IntegerField()

    class Meta():
        model = Recipes
        # depth = 1
        fields = ('r_num', 'r_name', 'r_img_path', 'r_card_path', 'r_servings', 'r_ingredients', 'r_packaging', 'r_diets', 'r_stations', 'r_allergies', 'm_s')
        read_only_fields = ('r_num', 'r_img_path', 'r_card_path')

    def create(self, validated_data):
        latest_key = Recipes.objects.latest('r_num').r_num if (Recipes.objects.count() > 0) else 0
        validated_data['r_num'] = latest_key + 1
        ings = validated_data.pop('r_ingredients')
        pkgs = validated_data.pop('r_packaging')
        diets = validated_data.pop('r_diets')
        allergies = validated_data.pop('r_allergies')
        stations = validated_data.pop('r_stations')
        if validated_data.get('r_ing_path', None):
            r_ing_path = validated_data.pop('r_ing_path')
        if validated_data.get('r_card_path', None):
            r_card_path = validated_data.pop('r_card_path')

        recipe_instance = Recipes.objects.create(**validated_data)

        for ing in ings:
            latest_key = RecipeIngredients.objects.latest('ri_id').ri_id if (RecipeIngredients.objects.count() > 0) else 0 
            ing['ri_id'] = latest_key + 1
            ing['ri_recipe_num'] = recipe_instance
            RecipeIngredients(**ing).save()
        for pkg in pkgs:
            latest_key = RecipePackaging.objects.latest('rp_id').rp_id if (RecipePackaging.objects.count() > 0) else 0
            pkg['rp_id'] = latest_key + 1
            pkg['rp_recipe_num'] = recipe_instance
            RecipePackaging(**pkg).save()
        for diet in diets:
            latest_key = RecipeDiets.objects.latest('rd_id').rd_id if (RecipeDiets.objects.count() > 0) else 0
            diet['rd_id'] = latest_key + 1
            diet['rd_recipe_num'] = recipe_instance
            RecipeDiets(**diet).save()
        for station in stations:
            latest_key = Stations.objects.latest('stn_num').stn_num if (Stations.objects.count() > 0) else 0
            station['stn_num'] = latest_key + 1
            station['stn_recipe_num'] = recipe_instance
            Stations(**station).save()
        for allergy in allergies:
            latest_key = RecipeAllergies.objects.latest('ra_id').ra_id if (RecipeAllergies.objects.count > 0) else 0
            allergy['ra_id'] = latest_key + 1
            allergy['ra_recipe_num'] = recipe_instance
            RecipeAllergies(**allergy).save()

        return recipe_instance

    def update(self, recipe_instance, validated_data):
        ings = validated_data.pop('r_ingredients')
        pkgs = validated_data.pop('r_packaging')
        diets = validated_data.pop('r_diets')
        stations = validated_data.pop('r_stations')
        allergies = validated_data.pop('r_allergies')
        if validated_data.get('r_ing_path', None):
            r_ing_path = validated_data.pop('r_ing_path')
        if validated_data.get('r_card_path', None):
            r_card_path = validated_data.pop('r_card_path')
		# ing_instance = Ingredients.objects.create(**validated_data)

        RecipeIngredients.objects.filter(ri_recipe_num = recipe_instance).delete()
        for ing in ings:
            if (RecipeIngredients.objects.count() > 0):
                latest_id = RecipeIngredients.objects.latest('ri_id').ri_id +1
            else:
                latest_id = 0
            ing['ri_id'] = latest_id
            ing['ri_recipe_num'] = recipe_instance
            # raise serializers.ValidationError(usage)
            RecipeIngredients.objects.create(**ing)
        
        RecipePackaging.objects.filter(rp_recipe_num = recipe_instance).delete()
        for pkg in pkgs:
            if (RecipePackaging.objects.count() > 0):
                latest_id = RecipePackaging.objects.latest('rp_id').rp_id + 1
            else:
                latest_id = 0
            pkg['rp_id'] = latest_id
            pkg['rp_recipe_num'] = recipe_instance
            # raise serializers.ValidationError(usage)
            RecipePackaging.objects.create(**pkg)
        
        RecipeDiets.objects.filter(rd_recipe_num = recipe_instance).delete()
        for diet in diets:
            if (RecipeDiets.objects.count() > 0):
                latest_id = RecipeDiets.objects.latest('rd_id').rd_id + 1
            else:
                latest_id = 0
            diet['rd_id'] = latest_id
            diet['rd_recipe_num'] = recipe_instance
            RecipeDiets.objects.create(**diet)
        
        Stations.objects.filter(stn_recipe_num = recipe_instance).delete()
        for station in stations:
            if (Stations.objects.count() > 0):
                latest_id = Stations.objects.latest('stn_num').stn_num + 1
            else:
                latest_id = 0
            station['stn_num'] = latest_id
            station['stn_recipe_num'] = recipe_instance
            stn_ings = station.pop('stn_ings')
            stn_instance = Stations.objects.create(**station)
            for stn_ing in stn_ings:
                stn_ing['si_station_num'] = stn_instance
                StationIngredients.objects.create(**stn_ing)

        
        RecipeAllergies.objects.filter(ra_recipe_num = recipe_instance).delete()
        for allergy in allergies:
            if (RecipeAllergies.objects.count() > 0):
                latest_id = RecipeAllergies.objects.latest('ra_id').ra_id + 1
            else:
                latest_id = 0
            allergy['ra_id'] = latest_id
            allergy['ra_recipe_num'] = recipe_instance
            RecipeAllergies.objects.create(**allergy)
        # recipe_instance.r_num = validated_data.get('r_num')
        recipe_instance.r_name = validated_data.get('r_name')
        recipe_instance.m_s = validated_data.get('m_s')
        recipe_instance.r_servings = validated_data.get('r_servings')
        print(validated_data.get('m_s'))
        print(recipe_instance.m_s)
        recipe_instance.save(update_fields=['r_name', 'm_s', 'r_servings'])
        # print(recipe_instance.m_s)
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
        queryset = Recipes.objects.all().prefetch_related('r_ingredients').prefetch_related('r_packaging').prefetch_related('r_diets').prefetch_related('r_stations').prefetch_related('r_allergies')
        serializer = RecipesSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = RecipesSerializer(data=request.data)
        r_instance = None
        if serializer.is_valid():
            r_instance = serializer.create(serializer.validated_data)
            return Response(r_instance.r_num)
        else:
            print(serializer.errors)
            return Response(serializer.errors, 500)

    # def retrieve(self, pk):
        # query = 'SELECT mp.m_date, ri.prep, ri.amt, ri.unit, i.ingredient_name, ra.allergy, rd.diet_category FROM ingredients AS i JOIN recipe_ingredients AS ri ON i.i_id = ri.ri_ing_id JOIN recipes AS r on ri.ri_recipe_num = r.r_num JOIN meal_plans AS mp ON r.r_num = mp.meal_r_num OR r.r_num = mp.snack_r_num LEFT JOIN recipe_allergies ra ON ra.ra_recipe_num = r.r_num LEFT JOIN recipe_diets rd ON rd.rd_recipe_num = r.r_num WHERE r.r_name = "pizza" OR mp.m_date = "22/11/7"=%s'%(pk)
        # keys = ('r_num', 'r_name')
        # print('entered retrieve')
        # queryset = Recipes.objects.get(r_num=pk)
        # print('still no error')
        # serializer = RecipesSerializer(queryset)
        # return Response(serializer.data)
    
    queryset = Recipes.objects.all().prefetch_related('r_ingredients').prefetch_related('r_packaging').prefetch_related('r_diets').prefetch_related('r_stations').prefetch_related('r_allergies')
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
