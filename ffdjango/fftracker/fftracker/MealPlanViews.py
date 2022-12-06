from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from .models import MealPlans
# Create your views here.
class MealPlansSerializer(ModelSerializer):
    snack_r_num = serializers.CharField(max_length=200)
    meal_r_num = serializers.CharField(max_length=200)
class Meta():
    model = MealPlans
    fields = ('m_id', 'm_date', 'snack_r_num', 'meal_r_num', 'num_servings')

class MealPlansView(viewsets.ViewSet):
    def list(self, request):
        keys = ('m_id', 'm_date', 'snack_r_num', 'meal_r_num', 'num_servings')
        query = meal_plans_query("SELECT mp.m_date, r.r_name FROM meal_plans mp JOIN recipes r ON r.r_num = mp.meal_r_num OR r.r_num = mp.snack_r_num WHERE m_date = "22/11/7"", many=True)
        queryset = execute_query(query, keys, many=True)
        serializer = MealPacksSerializer(queryset, many=True)
        return Response(serializer.data)
    def retrieve(self, request, pk):
        keys = ('m_id', 'm_date', 'snack_r_num', 'meal_r_num', 'num_servings')
        query = meal_plans_query("SELECT mp.m_date, r.r_name FROM meal_plans mp JOIN recipes r ON r.r_num = mp.meal_r_num OR r.r_num = mp.snack_r_num WHERE m_date = "22/11/7""%(pk))
        queryset = execute_query(query, keys, many=True)
        serializer = MealPacksSerializer(queryset, many=True)
        return Response(serializer.data)
    def update(self, request, pk):
        data = request.data
        serializer = MealPlansSerializer(data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_200_BADREQUEST)
