from rest_framework import viewsets
from rest_framework import serializers 
from .models import Stations, Households, HhAllergies
from rest_framework.response import Response
import logging
logging.basicConfig(level = logging.WARNING)


class AllergySerializer(serializers.ModelSerializer):       
    class Meta():
        model = HhAllergies
        fields = (['a_type'])

class StationSerializer(serializers.ModelSerializer):
	class Meta():
		model = Stations
		fields = ('__all__')

class StationsView(viewsets.ModelViewSet):
	queryset = Stations.objects.all()
	serializer_class = StationSerializer

class HouseholdAllergySerializer(serializers.ModelSerializer):
    hh_allergies = AllergySerializer(many=True)
    class Meta():
        model = Households
        depth = 1
        fields = ('hh_name', 'num_adult', 'num_child_lt_6', 'num_child_gt_6', 'sms_flag', 'veg_flag', 'allergy_flag', 'gf_flag', 'ls_flag', 'paused_flag', 'phone', 'street', 'city', 'pcode', 'state', 'delivery_notes', 'hh_allergies')

    def create(self, validated_data):
        allergy_data = validated_data.pop('hh_allergies')
        hh_model = Households.objects.create(**validated_data)
        for allergy in allergy_data:
            allergy['a_hh_name'] = hh_model
            allergy['hh_a_id'] = HhAllergies.objects.latest('hh_a_id').hh_a_id + 1
            allergy_model = HhAllergies.objects.create(**allergy)
        return hh_model
    def update(self, hh_instance, validated_data):
        # Create nested allergy objects
        allergy_data = validated_data.pop('hh_allergies')
        HhAllergies.objects.all().filter(a_hh_name = hh_instance).delete()
        for allergy in allergy_data:
            allergy['a_hh_name'] = hh_instance
            allergy['hh_a_id'] = HhAllergies.objects.latest('hh_a_id').hh_a_id + 1
            allergy_model = HhAllergies.objects.create(**allergy)
        logging.warning(hh_instance.hh_name)
        return super().update(hh_instance, validated_data)

class HouseholdsWithAllergies(viewsets.ModelViewSet):
    queryset = Households.objects.all()
    serializer_class = HouseholdAllergySerializer