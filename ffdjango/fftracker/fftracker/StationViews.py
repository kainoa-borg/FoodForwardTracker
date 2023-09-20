from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from django.db.models import Prefetch
from django.shortcuts import render
from .models import Stations, Ingredients, Households, StationIngredients
from .SupplierViews import SupplierSerializer
import os
import logging
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