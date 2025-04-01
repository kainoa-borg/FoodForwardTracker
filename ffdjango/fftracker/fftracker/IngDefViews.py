from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from fftracker.models import IngredientUnits, IngredientNames
from django.db.models import Q
from django.db import IntegrityError
from rest_framework.decorators import action

class IngUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = IngredientUnits
        fields = ('i_unit_id', 'recipe_amt', 'recipe_unit', 'shop_amt', 'shop_unit', 'i_name_id')


class IngNameSerializer(serializers.ModelSerializer):
    ing_units = IngUnitSerializer(many=True, required=False)
    category_id = serializers.IntegerField()
    subcategory_id = serializers.IntegerField()

    class Meta:
        model = IngredientNames
        fields = ('ing_name_id', 'ing_name', 'ing_units', 'category_id', 'subcategory_id')
        read_only_fields = ('ing_name_id',)

    def create(self, validated_data):
        ing_units_data = validated_data.pop('ing_units', [])
        ing_name = IngredientNames.objects.create(**validated_data)

        for unit_data in ing_units_data:
            IngredientUnits.objects.create(i_name_id=ing_name, **unit_data)

        return ing_name

    def update(self, instance, validated_data):
        ing_units_data = validated_data.pop('ing_units', [])

        # Update the IngredientName fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Replace all IngredientUnits
        IngredientUnits.objects.filter(i_name_id=instance).delete()
        for unit_data in ing_units_data:
            IngredientUnits.objects.create(i_name_id=instance, **unit_data)

        return instance

class IngNameView(ModelViewSet):
    queryset = IngredientNames.objects.all()
    serializer_class = IngNameSerializer

    def get_queryset(self):
        category_id = self.request.query_params.get('category_id')
        subcategory_id = self.request.query_params.get('subcategory_id')

        queryset = self.queryset

        if category_id:
            queryset = queryset.filter(category_id=int(category_id))
        if subcategory_id:
            queryset = queryset.filter(subcategory_id=int(subcategory_id))

        return queryset

    @action(detail=False, methods=['get'], url_path='category/(?P<category_id>[0-9]+)/subcategory/(?P<subcategory_id>[0-9]+)')
    def filter_by_category(self, request, category_id=None, subcategory_id=None):
        queryset = self.queryset.filter(category_id=category_id, subcategory_id=subcategory_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='category/(?P<category_id>[0-9]+)/subcategory/(?P<subcategory_id>[0-9]+)')
    def add_ingredient(self, request, category_id=None, subcategory_id=None):
        data = request.data.copy()
        data['category_id'] = category_id
        data['subcategory_id'] = subcategory_id

        serializer = self.get_serializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=201)
        except IntegrityError:
            return Response({'error': 'Ingredient with this name already exists.'}, status=400)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response({'errorText': 'An ingredient with this name already exists.'}, status=400)

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except IntegrityError:
            return Response({'errorText': 'Error updating the ingredient.'}, status=400)

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except IntegrityError:
            return Response({'errorText': 'Error deleting the ingredient.'}, status=400)


class IngUnitView(ModelViewSet):
    queryset = IngredientUnits.objects.all()
    serializer_class = IngUnitSerializer

