from rest_framework import viewsets
from rest_framework import serializers
from django.db.models import F, Count, Value, Prefetch
from .models import Ingredients, Packaging, MealPlans, IngredientUsages
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from .SupplierViews import SupplierSerializer
from .helperfuncs import execute_query
from datetime import date
import logging
logging.basicConfig(level = logging.WARNING)

class CostTotalSerializer(ModelSerializer):
	isupplier = SupplierSerializer(read_only=True)
	psupplier = SupplierSerializer(read_only=True)
	pref_isupplier = SupplierSerializer(read_only=True)
	pref_psupplier = SupplierSerializer(read_only=True)
	class Meta():
		model = Ingredients, Packaging
		fields = ('i_id', 'ingredient_name', 'pkg_type', 'storage_type', 'in_date', 'in_qty', 'qty_on_hand', 'unit', 'exp_date', 'unit_cost', 'flat_fee', 'isupplier_id', 'pref_isupplier_id', 'isupplier', 'pref_isupplier')
                #, ('p_id', 'package_type', 'unit_qty', 'qty_holds', 'unit', 'returnable', 'in_date', 'in_qty', 'qty_on_hand', 'unit_cost', 'flat_fee', 'psupplier_id', 'pref_psupplier_id', 'psupplier', 'pref_psupplier')
		read_only_fields = ('i_id') #, 'p_id')

class CostTotalView(viewsets.ViewSet):
    def list(self, request):
        startDate = request.query_params.get('startDate')
        endDate = request.query_params.get('endDate')
        querysetIng = Ingredients.objects.filter(in_date__range=[startDate, endDate]).order_by('-in_date')
        querysetPack = Packaging.objects.filter(in_date__range=[startDate, endDate]).order_by('-in_date')
        queryset = [querysetIng, querysetPack]
        serializer = CostTotalSerializer(queryset, many=True)
        return Response(serializer.data)

