from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from django.db.models import Prefetch
from .models import Packaging, PackagingUsages
import os

class PackagingUsageSerializer(ModelSerializer):
	class Meta():
		model = PackagingUsages
		fields = ('used_date', 'used_qty')

class PackagingSerializer(ModelSerializer):
	psupplier = serializers.CharField(max_length=200)
	pref_psupplier = serializers.CharField(max_length=200)
	#packaging_usage = PackagingUsageSerializer()
	class Meta():
		model = Packaging
		fields = ('p_id', 'package_type', 'unit_qty', 'unit_cost', 'qty_holds', 'unit', 'returnable', 'in_date', 'in_qty', 'exp_date', 'qty_on_hand', 'flat_fee', 'psupplier', 'pref_psupplier')

# Create your views here.
class PackagingView(viewsets.ViewSet):
	def list(self, request):
		keys = ('p_id', 'package_type', 'unit_qty', 'unit_cost', 'qty_holds', 'unit', 'returnable', 'in_date', 'in_qty', 'exp_date', 'qty_on_hand', 'flat_fee', 'psupplier', 'pref_psupplier')
		query = "SELECT p.*, (SELECT s_name FROM supplier WHERE p.psupplier_id = s_id) AS psupplier, (SELECT s_name FROM supplier WHERE p.pref_psupplier_id = s_id) AS pref_psupplier FROM packaging p"
		queryset = execute_query(query, keys, many=True)
		#queryset = Packaging.objects.prefetch_related(Prefetch('packaging_usage', queryset=PackagingUsages.objects.all())).all().all()
		#print(queryset[0].__dict__['_prefetched_objects_cache']['packaging_usage'].__dict__)
		serializer = PackagingSerializer(queryset, many=True)
		return Response(serializer.data)
	def retrieve(self, request, pk):
		query = "SELECT p.*, (SELECT s_name FROM supplier WHERE p.psupplier_id = s_id) AS psupplier, (SELECT s_name FROM supplier WHERE p.pref_psupplier_id = s_id) AS pref_psupplier FROM packaging p WHERE p.p_id=%s"%(pk)
		keys = ('p_id', 'package_type', 'unit_qty', 'unit_cost', 'qty_holds', 'unit', 'returnable', 'in_date', 'in_qty', 'exp_date', 'qty_on_hand', 'flat_fee', 'psupplier', 'pref_psupplier')
		queryset = execute_query(query, keys)
		serializer = PackagingSerializer(queryset)
		return Response(serializer.data)
	def update(self, request, pk):
		update_obj = Packaging.Objects.get(pk)
		serializer = PackagingSerializer(update_obj, data=request.data)
		if serializer.is_valid():
			obj = serializer.save()
			obj.save()
			return Response(status=status.HTTP_200_OK)
		return Response(status=status.HTTP_200_BADREQUEST)
	def create(self, request):
		data = request.data
		serializer = PackagingSerializer(data=data)
		if serializer.is_valid():
			obj = serializer.save()
			obj.save()
			return Response(obj, status=200)
		return Response(status=400)
	def destroy(self, request, pk):
		ingredient = Packaging.Objects.get(pk)
		ingredient.delete()
		return Response(status=204)
