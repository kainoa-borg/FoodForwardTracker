from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from .models import Ingredients

class IngredientInvSerializer(ModelSerializer):
	isupplier_name = serializers.CharField(max_length=200)
	pref_isupplier_name = serializers.CharField(max_length=200)
	class Meta():
		model = Ingredients
		fields = ('i_id', 'ingredient_name', 'pkg_type', 'storage_type', 'in_date', 'in_qty', 'unit', 'exp_date', 'unit_cost', 'flat_fee', 'isupplier_name', 'pref_isupplier_name')

# Create your views here.
class IngredientInvView(viewsets.ViewSet):
	def list(self, request):
		keys = ('i_id', 'ingredient_name', 'pkg_type', 'storage_type', 'in_date', 'in_qty', 'unit', 'exp_date', 'qty_on_hand', 'unit_cost', 'flat_fee', 'isupplier_id', 'pref_supplier_id', 'isupplier_name', 'pref_isupplier_name')
		query = "SELECT i.*, (SELECT s_name FROM supplier WHERE i.isupplier_id = s_id) AS isupplier_name, (SELECT s_name FROM supplier WHERE i.pref_isupplier_id = s_id) AS pref_supplier_name FROM ingredients i"
		queryset = execute_query(query, keys, many=True)
		serializer = IngredientInvSerializer(queryset, many=True)
		return Response(serializer.data)
	def retrieve(self, request, pk):
		query = "SELECT i.*, (SELECT s_name FROM supplier WHERE i.isupplier_id = s_id) AS isupplier_name, (SELECT s_name FROM supplier WHERE i.pref_isupplier_id = s_id) AS pref_supplier_name FROM ingredients i WHERE i.i_id=%s"%(pk)
		keys = ('i_id', 'ingredient_name', 'pkg_type', 'storage_type', 'in_date', 'in_qty', 'unit', 'exp_date', 'qty_on_hand', 'unit_cost', 'flat_fee', 'isupplier_id', 'pref_supplier_id', 'isupplier_name', 'pref_isupplier_name')
		queryset = execute_query(query, keys)
		serializer = IngredientInvSerializer(queryset)
		return Response(serializer.data)
	def update(self, request, pk):
		data = request.data
		serializer = IngredientInvSerializer(data)
		if serializer.is_valid():
			serializer.save()
			return Response(status=status.HTTP_200_OK)
		return Response(status=status.HTTP_200_BADREQUEST)
