from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets, serializers, status
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework.decorators import action
from PIL import Image
from io import BytesIO
from datetime import datetime as dt
import os

from .serializers import (RecipeAllergySerializers, RecipesSerializer, RecipeInstructionsSerializers, RecipeIngredientsSerializers,
                      RecipeDietsSerializers, RecipePackagingSerializers, ImageUploadSerializer)

from .models import (ImageUpload, Recipes, RecipeAllergies, RecipeDiets, RecipeIngredients, 
                    Stations, StationIngredients, RecipePackaging, RecipeInstructions)
from .IngredientViews import IngredientNameSerializer
from .StationViews import StationIngSerializer, StationsSerializer
# Create your views here.

class RecipeStationSerializer(ModelSerializer):
    stn_ings = StationIngSerializer(many=True, read_only=False)
    class Meta():
        model = Stations
        fields = ('stn_num', 'stn_name', 'stn_desc', 'stn_ings')
        read_only_fields = ('stn_num',)

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

class RecipeDietsView(viewsets.ViewSet):
    def list(self, request):
        keys = ('rd_id', 'diet_category', 'rd_recipe_name')
        query = 'LEFT JOIN recipe_diets rd ON rd.rd_recipe_num = r.r_num'
        queryset = RecipeDiets.objects.all()
        serializer = RecipeDietsSerializers(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk):
        query = 'LEFT JOIN recipe_diets rd ON rd.rd_recipe_num = r.r_num=%s'%(pk)
        keys = ('rd_id', 'diet_category', 'rd_recipe_name')
        queryset = RecipeDiets.objects.get(pk)
        serializer = RecipeDietsSerializers(queryset)
        return Response(serializer.data)
    def update(self, request, pk):
        data = request.data
        serializer = RecipeDietsSerializers(data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_200_BADREQUEST)
    

class RecipeView(viewsets.ModelViewSet):
    queryset = Recipes.objects.all()
    serializer_class = RecipesSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        
        # Get prep and cooking instructions separately
        prep_instructions = instance.r_instructions.filter(instruction_type='prep').order_by('step_num')
        cooking_instructions = instance.r_instructions.filter(instruction_type='cook').order_by('step_num')
        
        # Serialize instructions
        data['prep_instructions'] = RecipeInstructionsSerializers(prep_instructions, many=True).data
        data['cooking_instructions'] = RecipeInstructionsSerializers(cooking_instructions, many=True).data
        
        return Response(data)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Split instructions by type
        prep_instructions = data.pop('prep_instructions', [])
        cooking_instructions = data.pop('cooking_instructions', [])
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        recipe = serializer.save()

        # Create prep instructions
        for instruction in prep_instructions:
            RecipeInstructions.objects.create(
                inst_recipe_num=recipe,
                instruction_type='prep',
                step_num=instruction['step_num'],
                description=instruction['description'],
                notes=instruction.get('notes', ''),
                amount_per_serving=instruction.get('amount_per_serving'),
                unit=instruction.get('unit'),
                substeps=instruction.get('substeps', [])
            )

        # Create cooking instructions
        for instruction in cooking_instructions:
            RecipeInstructions.objects.create(
                inst_recipe_num=recipe,
                instruction_type='cook',
                step_num=instruction['step_num'],
                description=instruction['description'],
                notes=instruction.get('notes', ''),
                amount_per_serving=instruction.get('amount_per_serving'),
                unit=instruction.get('unit'),
                substeps=instruction.get('substeps', [])
            )

        return Response(self.get_serializer(recipe).data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()
        
        # Split instructions by type
        prep_instructions = data.pop('prep_instructions', [])
        cooking_instructions = data.pop('cooking_instructions', [])

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        recipe = serializer.save()

        # Update prep instructions
        instance.r_instructions.filter(instruction_type='prep').delete()
        for instruction in prep_instructions:
            # Convert empty string or None to None for amount_per_serving
            amount = instruction.get('amount_per_serving')
            if amount == '' or amount is None:
                amount = None
            else:
                try:
                    amount = float(amount)
                except (ValueError, TypeError):
                    amount = None

            RecipeInstructions.objects.create(
                inst_recipe_num=recipe,
                instruction_type='prep',
                step_num=instruction['step_num'],
                description=instruction['description'],
                notes=instruction.get('notes', ''),
                amount_per_serving=amount,
                unit=instruction.get('unit', ''),
                substeps=instruction.get('substeps', [])
            )

        # Update cooking instructions
        instance.r_instructions.filter(instruction_type='cook').delete()
        for instruction in cooking_instructions:
            # Convert empty string or None to None for amount_per_serving
            amount = instruction.get('amount_per_serving')
            if amount == '' or amount is None:
                amount = None
            else:
                try:
                    amount = float(amount)
                except (ValueError, TypeError):
                    amount = None

            RecipeInstructions.objects.create(
                inst_recipe_num=recipe,
                instruction_type='cook',
                step_num=instruction['step_num'],
                description=instruction['description'],
                notes=instruction.get('notes', ''),
                amount_per_serving=amount,
                unit=instruction.get('unit', ''),
                substeps=instruction.get('substeps', [])
            )

        return Response(self.get_serializer(recipe).data)

class RecipeIngredientsView(viewsets.ViewSet):
    def list(self, request):
        keys = ('ri_id', 'amt', 'unit', 'prep', 'ri_ing', 'ri_recipe_num')
        query = 'JOIN recipes AS r on ri.ri_recipe_num = r.r_num'
        queryset = RecipeIngredients.objects.all()
        serializer = RecipeIngredientsSerializers(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk):
        keys = ('ri_id', 'amt', 'unit', 'prep', 'ri_ing', 'ri_recipe_num')
        query = 'JOIN recipes AS r on ri.ri_recipe_num = r.r_num'
        queryset = RecipeIngredients.objects.get(pk)
        serializer = RecipeIngredientsSerializers(queryset)
        return Response(serializer.data)

    def update(self, request, pk):
        data = request.data
        serializer = RecipeIngredientsSerializers(data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_200_BADREQUEST)

class RecipeInstructionsView(viewsets.ViewSet):
    def list(self, request):
        keys = ('inst_id', 'step_no', 'step_inst', 'stn_name', 'inst_recipe_name')
        query = 'JOIN recipe_instructions rin ON rin.inst_recipe_num = r.r_num'
        queryset = RecipeInstructions.objects.all()
        serializer = RecipeInstructionsSerializers(queryset)
        return Response(serializer.data)

    def retrieve(self, request, pk):
        keys = ('inst_id', 'step_no', 'step_inst', 'stn_name', 'inst_recipe_name')
        query = 'JOIN recipe_instructions rin ON rin.inst_recipe_num = r.r_num'
        queryset = RecipeInstructions.objects.get(pk)
        serializer = RecipeInstructionsSerializers(queryset)
        return Response(serializer.data)

    def update(self, request, pk):
        data = request.data
        serializer = RecipeInstructionsSerializers(data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_200_BADREQUEST)
    
class RecipePackagingView(viewsets.ModelViewSet):
    queryset = RecipePackaging.objects.all()
    serializer_class = RecipePackagingSerializers

class RecipeAllergyView(viewsets.ModelViewSet):
    queryset = RecipeAllergies.objects.all()
    serializer_class = RecipeAllergySerializers
