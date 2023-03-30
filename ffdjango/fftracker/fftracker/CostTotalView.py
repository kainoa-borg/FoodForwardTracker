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
	#isupplier = serializers.CharField(read_only=True)
	#pref_isupplier = serializers.CharField(read_only=True)
	isupplier = serializers.CharField(max_length=200)
	pref_isupplier = serializers.CharField(max_length=200)
	class Meta():
		model = Ingredients
		fields = ('i_id', 'ingredient_name', 'pkg_type', 'storage_type', 'in_date', 'in_qty', 'qty_on_hand', 'unit', 'exp_date', 'unit_cost', 'flat_fee', 'isupplier_id', 'pref_isupplier_id', 'isupplier', 'pref_isupplier')
		read_only_fields = ('i_id',)

class CostTotalView(viewsets.ViewSet):
    def list(self, request):
        startDate = request.query_params.get('startDate')
        endDate = request.query_params.get('endDate')
        queryset = Ingredients.objects.filter(in_date__range=[startDate, endDate]).order_by('-in_date')
        serializer = CostTotalSerializer(queryset, many=True)
        return Response(serializer.data)

