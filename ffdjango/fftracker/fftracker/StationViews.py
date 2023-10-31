from .helperfuncs import execute_query, household_servings_list
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from django.db.models import Prefetch
from django.shortcuts import render
from .models import Stations, Ingredients, Households, StationIngredients, Recipes, RecipeIngredients, MealPlans
from .SupplierViews import SupplierSerializer
import os
import logging
from decimal import Decimal
logging.basicConfig(level = logging.WARNING)


class HhServingsSerializer(ModelSerializer):
    class Meta():
        model = Households
        depth = 1
        fields = ('hh_name', 'num_adult', 'num_child_gt_6', 'num_child_lt_6', 'sms_flag', 'veg_flag', 'allergy_flag', 'gf_flag', 'ls_flag', 'paused_flag')
  
    def validate(self, data):
        return super.validate()


class StationIngSerializer(ModelSerializer):
    class Meta():
        model = StationIngredients
        fields = ('si_recipe_ing',)

class StationsSerializer(ModelSerializer):
    # hh_servings = HhServingsSerializer(required=False, allow_null=True, many=True)
    stn_ings = StationIngSerializer(many=True, read_only=False)
    class Meta():
        model = Stations
        fields = ('stn_num', 'stn_name', 'stn_desc', 'stn_ings', 'stn_recipe_num')
        read_only_fields = ('stn_num',)


    def create(self, validated_data):
        if Stations.objects.count() < 1:
             latest_key = 0
        else:
            latest_key = Stations.objects.latest('stn_num').stn_num

        stn_ings = validated_data.pop('stn_ings')
        
        validated_data['stn_num'] = latest_key + 1
        stn_instance = Stations.objects.create(**validated_data)
        
        for stn_ing in stn_ings:
            stn_ing['si_station_num'] = stn_instance
            StationIngredients.objects.create(**stn_ing)

        return stn_instance

            
    def update(self, station_instance, validated_data):
        stn_ings = validated_data.pop('stn_ings')
        StationIngredients.objects.filter(si_station_num=station_instance.stn_num).delete()
        for stn_ing in stn_ings:
            stn_ing['si_station_num'] = station_instance
            StationIngredients.objects.create(**stn_ing)
            
        return super.update(station_instance, validated_data)
            

class StationsView(ModelViewSet):
    queryset = Stations.objects.all().prefetch_related('stn_ings')
    serializer_class = StationsSerializer


class StationInstructionsView(viewsets.ViewSet):
    def retrieve(self, request, pk):

        household_servings = household_servings_list()
        meal_plan = MealPlans.objects.get(m_id = pk)
        meal_recipe = Recipes.objects.get(r_num = meal_plan.meal_r_num.r_num)
        recipe_stations = Stations.objects.filter(stn_recipe_num = meal_recipe.r_num)
        station_instructions = []

        for recipe_station in recipe_stations:
            station_instruction = {
                'stn_name': recipe_station.stn_name,
                'stn_desc': recipe_station.stn_desc,
                'servings': {}
            }
            description = recipe_station.stn_desc
            recipe_station_ingredients = StationIngredients.objects.filter(si_station_num = recipe_station)
            for household in household_servings:
                station_household = {
                    'hh_first_name': household['household'].hh_first_name,
                    'hh_last_name': household['household'].hh_last_name,
                }
                meal_servings = household['m_servings']
                if str(meal_servings) in station_instruction['servings']:
                        station_instruction['servings'][str(meal_servings)]['households'].append(station_household)
                else:
                        station_instruction['servings'][str(meal_servings)] = {
                            'meal_servings': meal_servings,
                            'households': [station_household],
                            'ingredients': []
                        }
            for serving in station_instruction['servings']:
                for station_ing in recipe_station_ingredients:
                        recipe_ing = RecipeIngredients.objects.get(ri_recipe_num = meal_recipe.r_num,ingredient_name = station_ing.si_recipe_ing)
                        recipe_ing_amt = Decimal(recipe_ing.amt * station_instruction['servings'][serving]['meal_servings'])
                        recipe_ing_unit = recipe_ing.unit
                        this_ingredient = {
                            'ing_name': recipe_ing.ingredient_name,
                            'ing_amt': recipe_ing_amt,
                            'ing_unit': recipe_ing_unit
                        }
                        station_instruction['servings'][serving]['ingredients'].append(this_ingredient)
            station_instruction['servings'] = [station_instruction['servings'][x] for x in station_instruction['servings']]
            station_instructions.append(station_instruction)

        # for recipe_station in recipe_stations:
        #     station_instruction = {
        #         'stn_name': recipe_station.stn_name,
        #         'stn_desc': recipe_station.stn_desc,
        #         'households': []
        #     }
        #     description = recipe_station.stn_desc
        #     recipe_station_ingredients = StationIngredients.objects.filter(si_station_num = recipe_station)
        #     for household in household_servings:
        #         station_household = {
        #             'hh_first_name': household['household'].hh_first_name,
        #                 'hh_last_name': household['household'].hh_last_name,
        #                 'hh_meal_servings': household['m_servings'],
        #                 'ingredients': []
        #         }
        #         for station_ing in recipe_station_ingredients:
        #             # Get amounts of each ingredient for this household
        #             recipe_ing = RecipeIngredients.objects.get(ri_recipe_num = meal_recipe.r_num,ingredient_name = station_ing.si_recipe_ing)
        #             recipe_ing_amt = recipe_ing.amt * household['m_servings']
        #             recipe_ing_unit = recipe_ing.unit
        #             station_household['ingredients'].append({
        #                 'ing_name': recipe_ing.ingredient_name,
        #                 'ing_amt': recipe_ing_amt,
        #                 'ing_unit': recipe_ing_unit})
                    
        #         station_instruction['households'].append(station_household)
        #     station_instructions.append(station_instruction)

        return Response(station_instructions)