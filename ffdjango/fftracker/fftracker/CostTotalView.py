from .models import Ingredients, Packaging
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.serializers import ModelSerializer
from .SupplierViews import SupplierSerializer
from datetime import date
import logging
logging.basicConfig(level = logging.WARNING)
 
class IngCostTotalSerializer(ModelSerializer):
	isupplier = SupplierSerializer(read_only=True)
	pref_isupplier = SupplierSerializer(read_only=True)
	class Meta():
		model = Ingredients
		fields = ('i_id', 'ingredient_name', 'pkg_type', 'storage_type', 'in_date', 'in_qty', 'qty_on_hand', 'unit', 'exp_date', 'unit_cost', 'flat_fee', 'isupplier_id', 'pref_isupplier_id', 'isupplier', 'pref_isupplier')

class PackCostTotalSerializer(ModelSerializer):
	psupplier = SupplierSerializer(read_only=True)
	pref_psupplier = SupplierSerializer(read_only=True)
	class Meta():
		model = Packaging
		fields = ('p_id', 'package_type', 'unit_qty', 'qty_holds', 'unit', 'returnable', 'in_date', 'in_qty', 'qty_on_hand', 'unit_cost', 'flat_fee', 'psupplier_id', 'pref_psupplier_id', 'psupplier', 'pref_psupplier')

class IngCostTotalView(viewsets.ViewSet):
    def list(self, request):
        startDate = request.query_params.get('startDate')
        endDate = request.query_params.get('endDate')
        querysetIng = Ingredients.objects.filter(in_date__range=[startDate, endDate]).order_by('-in_date')
        serializerIng = IngCostTotalSerializer(querysetIng, many=True)
        return Response(serializerIng.data) 
    
class PackCostTotalView(viewsets.ViewSet):
    def list(self, request):
        startDate = request.query_params.get('startDate')
        endDate = request.query_params.get('endDate')
        querysetPack = Packaging.objects.filter(in_date__range=[startDate, endDate]).order_by('-in_date')
        serializerPack = PackCostTotalSerializer(querysetPack, many=True)
        return Response(serializerPack.data)  