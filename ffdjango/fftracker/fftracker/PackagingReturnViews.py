from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from .models import Packaging
from .PackagingViews import PackagingInvSerializer
from django.db.models import Prefetch
import os

class PackagingReturnSerializer(ModelSerializer):
    packaging = PackagingInvSerializer(read_only=True)
    in_qty = PackagingInvSerializer(read_only=True)
    packaging_type = PackagingInvSerializer(read_only=True)
    
    class Meta():
        model = Packaging
        fields = ('in_qty', 'in_date', 'qty_on_hand', 'package_type', 'packaging', 'packaging_type')

class PackagingReturnView(viewsets.ViewSet):
    def list(self, request):
        startDate = request.query_params.get('startDate')
        endDate = request.query_params.get('endDate')
        querysetPack = Packaging.objects.filter(in_date__range=[startDate, endDate]).order_by('-in_date')
        serializerPack = PackagingReturnSerializer(querysetPack, many=True)
        return Response(serializerPack.data)
		