from collections import UserString
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import (Households, HhAllergies, PausedDates, Servings, Ingredients, 
                    Kits, MealPlans, Packaging, ProductSubscriptionHistory, Recipes, 
                    Users, MealPacks, RecipeAllergies, RecipeDiets, RecipeIngredients, 
                    RecipeInstructions, RecipePackaging, DietaryRestrictions, 
                    IngredientUnits, IngredientNames, ImageUpload)


class AllergySerializer(ModelSerializer):
	class Meta():
		model = HhAllergies
		fields = ('__all__')
		depth = 1


class PausedDatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PausedDates
        fields = ['paused_date_id', 'pause_start_date', 'pause_end_date', 'description', 'hh_id']



class UserSerializer(ModelSerializer):
	class Meta():
		model = Users
		fields = ('__all__')

class DietaryRestrictionsSerializer(serializers.ModelSerializer):
    class Meta():
        model = DietaryRestrictions
        fields = '__all__'

class HouseholdSerializer(ModelSerializer):
    dietary_restrictions = DietaryRestrictionsSerializer(many=True, read_only=True)
    
    class Meta():
        model = Households
        fields = ('__all__')

class HouseholdAllergySerializer(ModelSerializer):
	hh_allergies = AllergySerializer(many=True)
	class Meta():
		model = Households
		fields = ('hh_name', 'num_adult', 'num_child_lt_6', 'num_child_gt_6', 'veg_flag', 'allergy_flag', 'gf_flag', 'ls_flag', 'paused_flag',' PausedDates', 'phone', 'street', 'city', 'pcode', 'state', 'delivery_notes', 'hh_allergies')




class IngredientInvSerializer(ModelSerializer):
	isupplier_name = serializers.CharField(max_length=200)
	pref_isupplier_name = serializers.CharField(max_length=200)
	class Meta():
		model = Ingredients
		fields = ('i_id', 'ingredient_name', 'pkg_type', 'storage_type', 'in_date', 'in_qty', 'unit', 'exp_date', 'unit_cost', 'flat_fee', 'isupplier_name', 'pref_isupplier_name')

#class MainSerializer(ModelSerializer):
 # 	class Meta():
	#	model = Households
	#	fields = ('__all__')

class MealKitSerializer(ModelSerializer):
	class Meta():
		model = Kits
		fields = ('__all__')

class MealPacksSerializers(ModelSerializer):
	class Meta():
		model = MealPacks
		fields = ('__all__')

class MealPlansSerializer(ModelSerializer):
	class Meta():
		model = MealPlans
		fields = ('__all__')

class MenuSerializer(ModelSerializer):                                                                                          
	meal_name = serializers.CharField(max_length=200)
	snack_name = serializers.CharField(max_length=200)
	class Meta():
		model = MealPlans
		fields = ('m_id', 'm_date', 'meal_name', 'snack_name')

class PackagingSerializer(ModelSerializer):
	class Meta():
		model = Packaging
		fields = ('__all__')
		
class RecipeAllergySerializers(ModelSerializer):
	class Meta():
		model = RecipeAllergies
		fields = ('__all__')

class RecipeDietsSerializers(ModelSerializer):
	class Meta():
		model = RecipeDiets
		fields = ('__all__')

class RecipeIngredientsSerializers(ModelSerializer):
    class Meta():
        model = RecipeIngredients
        fields = ('ri_id', 'ingredient_name', 'amt', 'unit', 'prep', 'ri_recipe_num')
        read_only_fields = ('ri_id',)
        extra_kwargs = {
            'prep': {'required': False, 'allow_blank': True},
            'ri_recipe_num': {'required': False}
        }

class RecipeInstructionsSerializers(ModelSerializer):
    substeps = serializers.JSONField(required=False)

    class Meta():
        model = RecipeInstructions
        fields = ['inst_id', 'step_num', 'description', 'notes', 'instruction_type', 'inst_recipe_num', 'substeps', 'amount_per_serving', 'unit']
        read_only_fields = ['instruction_type']

class RecipePackagingSerializers(ModelSerializer):
    class Meta():
        model = RecipePackaging
        fields = ('__all__')

class RecipesSerializer(serializers.ModelSerializer):
    r_ingredients = RecipeIngredientsSerializers(many=True, required=False)
    r_packaging = RecipePackagingSerializers(many=True, required=False)
    prep_instructions = RecipeInstructionsSerializers(many=True, required=False)
    cooking_instructions = RecipeInstructionsSerializers(many=True, required=False)
    r_img_upload = serializers.ImageField(required=False, allow_null=True)
    r_card_upload = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Recipes
        fields = ['r_num', 'r_name', 'r_servings', 'r_img_path', 'r_img_upload', 
                 'r_card_path', 'r_card_upload', 'm_s', 'r_ingredients', 
                 'r_packaging', 'prep_instructions', 'cooking_instructions']
        read_only_fields = ('r_num',)

    def create(self, validated_data):
        # Remove nested fields from validated_data
        for field in ['r_ingredients', 'r_packaging', 'prep_instructions', 'cooking_instructions']:
            validated_data.pop(field, None)

        # Create base recipe
        recipe = Recipes.objects.create(**validated_data)

        # Create ingredients
        for ingredient in self.initial_data.get('r_ingredients', []):
            RecipeIngredients.objects.create(
                ri_recipe_num=recipe,
                ingredient_name=ingredient.get('ingredient_name', ''),
                amt=ingredient.get('amt', 0),
                unit=ingredient.get('unit', ''),
                prep=ingredient.get('prep', '')
            )

        # Create packaging
        for package in self.initial_data.get('r_packaging', []):
            RecipePackaging.objects.create(
                rp_recipe_num=recipe,
                pkg_type=package.get('pkg_type', ''),
                pkg_contents=package.get('pkg_contents', ''),
                amt=package.get('amt')
            )

        # Create prep instructions
        for instruction in self.initial_data.get('prep_instructions', []):
            RecipeInstructions.objects.create(
                inst_recipe_num=recipe,
                instruction_type='prep',
                step_num=instruction.get('step_num'),
                description=instruction.get('description', ''),
                notes=instruction.get('notes', ''),
                amount_per_serving=instruction.get('amount_per_serving'),
                unit=instruction.get('unit', ''),
                substeps=instruction.get('substeps', [])
            )

        # Create cooking instructions
        for instruction in self.initial_data.get('cooking_instructions', []):
            RecipeInstructions.objects.create(
                inst_recipe_num=recipe,
                instruction_type='cook',
                step_num=instruction.get('step_num'),
                description=instruction.get('description', ''),
                notes=instruction.get('notes', ''),
                amount_per_serving=instruction.get('amount_per_serving'),
                unit=instruction.get('unit', ''),
                substeps=instruction.get('substeps', [])
            )

        return recipe

    def update(self, instance, validated_data):
        # Update recipe fields
        for attr, value in validated_data.items():
            if attr not in ['r_ingredients', 'r_packaging', 'prep_instructions', 'cooking_instructions']:
                setattr(instance, attr, value)
        instance.save()
        
        # Handle ingredients
        if 'r_ingredients' in self.initial_data:
            instance.r_ingredients.all().delete()
            for ingredient in self.initial_data.get('r_ingredients', []):
                RecipeIngredients.objects.create(
                    ri_recipe_num=instance,
                    ingredient_name=ingredient.get('ingredient_name', ''),
                    amt=ingredient.get('amt', 0),
                    unit=ingredient.get('unit', ''),
                    prep=ingredient.get('prep', '')
                )
                
        # Handle packaging
        if 'r_packaging' in self.initial_data:
            instance.r_packaging.all().delete()
            for package in self.initial_data.get('r_packaging', []):
                RecipePackaging.objects.create(
                    rp_recipe_num=instance,
                    pkg_type=package.get('pkg_type', ''),
                    pkg_contents=package.get('pkg_contents', ''),
                    amt=package.get('amt')
                )
                
        # Handle prep instructions
        if 'prep_instructions' in self.initial_data:
            instance.r_instructions.filter(instruction_type='prep').delete()
            for instruction in self.initial_data.get('prep_instructions', []):
                RecipeInstructions.objects.create(
                    inst_recipe_num=instance,
                    instruction_type='prep',
                    step_num=instruction.get('step_num'),
                    description=instruction.get('description', ''),
                    notes=instruction.get('notes', ''),
                    amount_per_serving=instruction.get('amount_per_serving'),
                    unit=instruction.get('unit', ''),
                    substeps=instruction.get('substeps', [])
                )
                
        # Handle cooking instructions
        if 'cooking_instructions' in self.initial_data:
            instance.r_instructions.filter(instruction_type='cook').delete()
            for instruction in self.initial_data.get('cooking_instructions', []):
                RecipeInstructions.objects.create(
                    inst_recipe_num=instance,
                    instruction_type='cook',
                    step_num=instruction.get('step_num'),
                    description=instruction.get('description', ''),
                    notes=instruction.get('notes', ''),
                    amount_per_serving=instruction.get('amount_per_serving'),
                    unit=instruction.get('unit', ''),
                    substeps=instruction.get('substeps', [])
                )
                
        return instance


class StationSerializer(ModelSerializer):
	class Meta():
		model = Households
		fields = ('__all__')

class StationListSerializer(ModelSerializer):
	hh_allergies = AllergySerializer(many=True)
	class Meta():
		model = Households
		fields = ('stn_name', 'num_servings', 'hh_allergies')

class ProductSubscriptionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSubscriptionHistory
        fields = '__all__'

class HouseholdReportSerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()
    class Meta:
        model = Households
        fields = ['id', 'hh_first_name', 'hh_last_name', 'products', 'paused_flag' , 'children_under_6', 'children_over_6', 'adults']
        
class ViewPausedDatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PausedDates
        fields = ['pause_start_date', 'pause_end_date', 'description']

class ServingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servings
        fields = ['date', 'total_servings']

class IngredientUnitSerializer(ModelSerializer):
    class Meta:
        model = IngredientUnits
        fields = ['recipe_unit']

class IngredientNamesSerializer(ModelSerializer):
    ing_units = IngredientUnitSerializer(many=True, read_only=True)
    
    class Meta:
        model = IngredientNames
        fields = ['ing_name_id', 'ing_name', 'ing_units']

class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageUpload
        fields = ('file', 'date_uploaded')