from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from django.db.models import Prefetch
from .models import Ingredients, IngredientUsages, Supplier
from .SupplierViews import SupplierSerializer
import os
import logging
logging.basicConfig(level = logging.WARNING)

class IngredientNameSerializer(ModelSerializer):
    class Meta():
        model = Ingredients
        fields = ('ingredient_name',)

class IngredientUsageSerializer(ModelSerializer):
	class Meta():
		model = IngredientUsages
		depth = 1
		fields = ('used_date', 'used_qty')

class IngredientInvSerializer(ModelSerializer):
	isupplier = SupplierSerializer(read_only=True)
	pref_isupplier = SupplierSerializer(read_only=True)
	isupplier_id = serializers.IntegerField(allow_null=True)
	pref_isupplier_id = serializers.IntegerField(allow_null=True)
	class Meta():
		model = Ingredients
		fields = ('i_id', 'ingredient_name', 'pkg_type', 'storage_type', 'in_date', 'in_qty', 'ingredient_usage', 'qty_on_hand', 'unit', 'exp_date', 'unit_cost', 'flat_fee', 'isupplier_id', 'pref_isupplier_id', 'isupplier', 'pref_isupplier')

	def create(self, validated_data):
		# raise serializers.ValidationError("IM HERE")
		ing_usage = validated_data.pop('ingredient_usage')
		ing_instance = Ingredients.objects.create(**validated_data)
		used = 0
		if ing_usage:
			# IngredientUsages.objects.all().filter(used_ing = instance).delete()
			for usage in ing_usage:
				used += int(usage['used_qty'])
				latest_id = IngredientUsages.objects.latest('i_usage_id').i_usage_id +1
				usage['i_usage_id'] = latest_id
				usage['used_ing_id'] = validated_data.get('i_id')
				# raise serializers.ValidationError(usage)
				IngredientUsages.objects.create(**usage)
		in_qty = getattr(ing_instance, 'in_qty')
		setattr(ing_instance, 'qty_on_hand', in_qty - used)
		return ing_instance
		
	def update(self, ing_instance, validated_data):
		# raise serializers.ValidationError("IM HERE")
		ing_usage = validated_data.pop('ingredient_usage')
		# ing_instance = Ingredients.objects.create(**validated_data)
		used = 0
		ing_usages = IngredientUsages.objects.filter(used_ing = ing_instance)
		if ing_usages:
			for ing in ing_usages:
				used += ing.used_qty
		used += ing_usage['used_qty']
		latest_id = IngredientUsages.object.latest('i_usage_id').i_usage_id + 1
		ing_usage['i_usage_id'] = latest_id
		ing_usage['used_ing_id'] = ing_instance
		IngredientUsages.objects.create(**ing_usage)
		# if ing_usage:
		# 	IngredientUsages.objects.all().filter(used_ing = ing_instance).delete()
		# 	for usage in ing_usage:
		# 		used += int(usage['used_qty'])
		# 		if (IngredientUsages.objects.count() > 0):
		# 			latest_id = IngredientUsages.objects.latest('i_usage_id').i_usage_id +1
		# 		else:
		# 			latest_id = 0
		# 		usage['i_usage_id'] = latest_id
		# 		usage['used_ing_id'] = validated_data.get('i_id')
		# 		# raise serializers.ValidationError(usage)
		# 		IngredientUsages.objects.create(**usage)
		in_qty = validated_data['in_qty']
		validated_data['qty_on_hand'] =  in_qty - used
		return super().update(ing_instance, validated_data)


# Create your views here.
class IngredientInvView(ModelViewSet):
	queryset = Ingredients.objects.all().prefetch_related('ingredient_usage')
	serializer_class = IngredientInvSerializer