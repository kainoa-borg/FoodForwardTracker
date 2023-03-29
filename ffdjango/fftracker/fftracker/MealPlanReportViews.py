from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from .models import MealPlans, Recipes, Households
import json

def get_latest_items(queryset):
        new_queryset = []
        i = 0
        while i < len(queryset):
            print(len(queryset))
            # find similar items
            similar_items = [n for n in queryset if n.meal_r_num == queryset[i].meal_r_num]
            print('%a, %a'%(queryset[i].meal_r_num, len(similar_items)))
            # if this is not a duplicate
            if len(similar_items) <= 1:
                # put it in the queryset
                new_queryset.append(queryset[i])
            # if this is a duplicate
            elif len(similar_items) > 1:
                print('in this section')
                # if this is the most recent (date) item
                latest_similar_item = similar_items[0]
                for n in similar_items:
                    if n.m_date > latest_similar_item.m_date:
                        # put it in the queryset
                        latest_similar_item = n
                queryset = [x for x in queryset if x.meal_r_num != latest_similar_item.meal_r_num]
                new_queryset.append(latest_similar_item)
            i += 1
        return new_queryset

class MealPlanReportSerializer(ModelSerializer):
    # meal_name = serializers.CharField(max_length=50)
    # snack_name = serializers.CharField(max_length=50)
    meal_name = serializers.CharField(source='meal_r_num.r_name')
    snack_name = serializers.CharField(source='snack_r_num.r_name')
    class Meta():
        model = MealPlans
        fields = ('m_id', 'm_date', 'meal_name', 'snack_name', 'meal_servings', 'snack_servings')
        # fields = ('__all__')
        read_only_fields = ('m_id',)

class MealPlanReportView(viewsets.ViewSet):
    # Override create to accept POST requests with date range
    def list(self, request):
        startDate = request.query_params.get('startDate')
        endDate = request.query_params.get('endDate')
        queryset = MealPlans.objects.filter(m_date__range=[startDate, endDate]).order_by('-m_date')
        new_queryset = get_latest_items(queryset)
        serializer = MealPlanReportSerializer(new_queryset, many=True)
        return Response(serializer.data)
