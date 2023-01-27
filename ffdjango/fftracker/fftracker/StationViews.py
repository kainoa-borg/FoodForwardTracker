from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from django.db.models import Prefetch
from .models import Stations, Ingredients, Households
from .SupplierViews import SupplierSerializer
import os
import logging
logging.basicConfig(level = logging.WARNING)


class HhServingsSerializer(ModelSerializer):
	class Meta():
		model = Households
		depth = 1
		fields = ('hh_name', 'num_adult', 'num_child_gt_6', 'num_child_lt_6', 'sms_flag', 'veg_flag', 'allergy_flag', 'gf_flag', 'ls_flag', 'paused_flag')
    

class StationsSerializer(ModelSerializer):
    hh_servings = HhServingsSerializer(required=False, allow_null=True, many=True)
    class Meta():
        model = Stations
        fields = ('stn_name', 'hh_servings')

    def create(self, validated_data):
        hh_servings = validated_data.pop('households')
        hh_list = Stations.objects.create(**validated_data)
        for item in hh_servings:
            hh_model = Households.objects.create(**item)
        return hh_list
    def update(self, hh_instance, validated_data):
        # Create nested allergy objects
        hh_servings = validated_data.pop('hh_allergies')
        Households.objects.all().filter(a_hh_name = hh_instance).delete()
        for item in hh_servings:
            hh_model = Households.objects.create(**item)
        logging.warning(hh_instance.hh_name)
        return super().update(hh_instance, validated_data)

        for hh in hh_list:
                latest_id = Households.objects.latest('hh_name').hh_name
                hh['hh_name'] = latest_id
                tmp = Households.objects.create(**hh)
                stn_instance[hh] = tmp['hh_name', 'num_adult', 'hh_name', 'num_child_gt_6', 'num_child_lt_6', 'sms_flag', 'veg_flag', 'allergy_flag', 'gf_flag', 'ls_flag', 'paused_flag']

        hh_portions = validated_data.pop('hh_servings')
        stn_instance = Stations.objects.create(**validated_data)
        if hh_portions:
            Households.objects.all().filter(paused_flag = 0).delete()
            for hh in hh_portions:
                latest_id = Households.objects.latest('hh_name').hh_name
                hh['hh_name'] = latest_id
                tmp = Households.objects.create(**hh)
                stn_instance[hh] = tmp['hh_name', 'num_adult', 'hh_name', 'num_child_gt_6', 'num_child_lt_6', 'sms_flag', 'veg_flag', 'allergy_flag', 'gf_flag', 'ls_flag', 'paused_flag']
        return stn_instance
        
    ##def update(self, ing_instance, validated_data):
		# raise serializers.ValidationError("IM HERE")
        hh_portions = validated_data.pop('hh_servings')
		# ing_instance = Ingredients.objects.create(**validated_data)
        if hh_portions:
            Households.objects.all().filter(paused_flag == 0).delete()
            for hh in hh_portions:
                if (Households.objects.count() > 0):
                    latest_id = Households.objects.latest('i_usage_id').i_usage_id +1
                else:
                    latest_id = 0
                hh['i_usage_id'] = latest_id
                hh['used_ing_id'] = validated_data.get('i_id')
				# raise serializers.ValidationError(usage)
                Households.objects.create(**hh)
        in_qty = validated_data['in_qty']
        validated_data['qty_on_hand'] =  in_qty - used
        return super().update(ing_instance, validated_data)
    ##

class StationsView(ModelViewSet):
	queryset = Stations.objects.all()
	serializer_class = StationsSerializer