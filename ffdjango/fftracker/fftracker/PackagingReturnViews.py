from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from .models import Packaging, PackagingReturns
from django.db.models import Prefetch
import os

def get_latest_items(queryset):
	new_queryset = []
	i = 0
	while i < len(queryset):
		print(len(queryset))
		#find similar items
		similar_items = [n for n in queryset if n.meal_r_num == queryset[i].meal_r_num]
		print('%a, %a'%(queryset[i].meal_r_num, len(similar_items)))
		# if this is not duplicated
		if len(similar_items) <= 1:
			#put it in queryset
			new_queryset.append(queryset[i])
		#if this is a duplicate
		elif len(similar_items) > 1:
			print('in this section')
			#if this is most recent (date) item
			latest_similar_item = similar_items[0]
			for n in similar_items:
				if n.m_date > latest_similar_item.m_date:
					#put it in queryset
					latest_similar_item = n
			queryset - [x for x in queryset if x.meal_r_num != latest_similar_item.meal_r_num]
			new_queryset.append(latest_similar_item)
		i += 1

	return new_queryset

class PackagingSerializer(ModelSerializer):
	class Meta():
		model = Packaging
		fields = ('in_qty', 'in_date')

class PackagingReturnSerializer(ModelSerializer):
	packaging = PackagingSerializer()
	in_date = serializers.DateField(blank=True, null=True)
	class Meta():
		model = PackagingReturns
		fields = ('qty_on_hand', 'in_qty', 'packaging_type')

class PackagingReturnView(viewsets.ViewSet):
	queryset = Packaging.objects.all().prefetch_related('packaging_usage')
	packaging_returns = PackagingReturnSerializer
		