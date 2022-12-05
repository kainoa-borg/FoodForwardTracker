from rest_framework import viewsets
from rest_framework import serializers 
from .models import Households, HhAllergies
from rest_framework.response import Response
import logging


class AllergySerializer(serializers.ModelSerializer):       
    class Meta():
        model = HhAllergies
        fields = (['a_type'])

class HouseholdSerializer(serializers.ModelSerializer):
	class Meta():
		model = Households
		fields = ('__all__')

class HouseholdsView(viewsets.ModelViewSet):
	queryset = Households.objects.all()
	serializer_class = HouseholdSerializer

class HouseholdAllergySerializer(serializers.ModelSerializer):
    hh_allergies = AllergySerializer(many=True)
    class Meta():
        model = Households
        depth = 1
        fields = ('hh_name', 'num_adult', 'num_child', 'sms_flag', 'veg_flag', 'allergy_flag', 'gf_flag', 'ls_flag', 'paused_flag', 'phone', 'street', 'city', 'pcode', 'state', 'delivery_notes', 'hh_allergies')
    def create(self, validated_data):
        allergy_data = validated_data.pop('hh_allergies')
        hh_model = Households.objects.create(**validated_data)
        for allergy in allergy_data:
            allergy['a_hh_name'] = hh_model
            allergy['hh_a_id'] = HhAllergies.objects.latest('hh_a_id').hh_a_id + 1
            allergy_model = HhAllergies.objects.create(**allergy)
        return hh_model
    def update(self, hh_instance, validated_data):
        allergy_data = validated_data.pop('hh_allergies')
        logger = logging.getLogger('fftracker')
        logger.info(allergy_data)
        HhAllergies.objects.all().filter(a_hh_name = hh_instance).delete()
        for allergy in allergy_data:
            allergy['a_hh_name'] = hh_instance
            allergy['hh_a_id'] = HhAllergies.objects.latest('hh_a_id').hh_a_id + 1
            allergy_model = HhAllergies.objects.create(**allergy)
        for key, value in validated_data.items():
            setattr(hh_instance, key, value)
        return hh_instance

class HouseholdsWithAllergies(viewsets.ModelViewSet):
	queryset = Households.objects.all()
	serializer_class = HouseholdAllergySerializer