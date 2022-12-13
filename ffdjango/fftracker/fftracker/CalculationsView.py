from rest_framework import viewsets
from rest_framework import serializers
from django.db.models import F, Count, Value
from .models import Households, MealPlans
from rest_framework.response import Response
from datetime import date
import logging
logging.basicConfig(level = logging.WARNING)

class CalculationsView(viewsets.ViewSet):
    def list(self, request):
        queryset_households = Households.objects.filter(paused_flag__gt ==False)
        queryset_meals = MealPlans.objects.filter(m_date__gt > date.today().date())
        for i in range(len(queryset_households)):
            for j in range(len(queryset_meals)):
                print('looping here')
            
        return Response()