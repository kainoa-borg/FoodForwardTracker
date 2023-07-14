from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from fftracker.models import IngredientUnits, IngredientNames
from django.db.models import Q
from django.db import IntegrityError

class IngUnitSerializer(ModelSerializer):
    # i_name_id = serializers.IntegerField(allow_null=False)
    class Meta():
        model = IngredientUnits
        fields = ('i_unit_id', 'recipe_amt', 'recipe_unit', 'shop_amt', 'shop_unit', 'i_name_id')
        # read_only_fields = ('i_unit_id',)

class IngNameSerializer(ModelSerializer):
    ing_units = IngUnitSerializer(required=False, many=True)

    class Meta():
        model = IngredientNames
        fields = ('ing_name_id', 'ing_name', 'ing_units',)
        read_only_fields = ('ing_name_id', 'ing_units')

    def create(self, validated_data):
        # Get the units from this ing name def
        if 'ing_units' in validated_data:
            validated_data.pop('ing_units')
        # Create the ingredient name definition
        ing_name_instance = IngredientNames.objects.create(**validated_data)
        # # For each new ing unit
        # if ing_units:
        #     for unit in ing_units:
        #         # Set the foreign key to reference this ing name def 
        #         unit['i_name_id'] = getattr(ing_name_instance, 'ing_name_id')
        #         # Create this unit
        #         IngredientUnits.objects.create(**unit)
        return ing_name_instance
    
    def update(self, ing_name_instance, validated_data):
        # Get the units from this ing name def
        ing_units = validated_data.pop('ing_units')
        # Delete any existing units for this ingredient
        IngredientUnits.objects.filter(i_name_id=ing_name_instance).delete()
        # For each newly defined ing unit
        if ing_units:
            for unit in ing_units:
                # Set the foreign key to reference this ing name def
                unit['i_name_id'] = ing_name_instance
                # Create or Update this unit
                IngredientUnits.objects.update_or_create(**unit)
        # Have the base modelserializer update method update this ing name def
        return super().update(ing_name_instance, validated_data)

class IngNameView(ModelViewSet):
    queryset = IngredientNames.objects.all()
    serializer_class = IngNameSerializer

    def create(self, request):
        ret = None
        try:
            ret = super().create(request)
        except IntegrityError:
            return Response({'errorText': 'There already exists an ingredient definition with that name.'}, 400)
        return ret

    def update(self, request, *args, **kwargs):
        ret = None
        try:
            ret = super().update(request, *args, **kwargs)
        except IntegrityError:
            return Response({'errorText': 'Error in one of your inputs! Please try again.'}, 400)
        return ret


class IngUnitView(ModelViewSet):
    queryset = IngredientUnits.objects.all()
    serializer_class = IngUnitSerializer