from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from django.db.models import Prefetch
from django.shortcuts import render
from .models import Supplier

class SupplierSerializer(ModelSerializer):
    class Meta():
        model = Supplier
        fields = (['s_id', 's_name'])
        extra_kwargs = {
			's_id': {'validators': []}
		}

class SupplierView(ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
