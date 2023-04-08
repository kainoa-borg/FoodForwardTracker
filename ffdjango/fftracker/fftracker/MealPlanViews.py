from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from .models import MealPlans, Recipes, Households
# Create your views here.

class MealPlansSerializer(ModelSerializer):
	# meal_name = serializers.CharField(max_length=50)
	# snack_name = serializers.CharField(max_length=50)
	def create(self, validated_data):
		mp = MealPlans.objects.create(**validated_data)
		return mp

	class Meta():
		model = MealPlans
		#fields = ('m_id', 'm_date', 'meal_r_num', 'snack_r_num', 'meal_servings', 'snack_servings')
		fields = ('__all__')
		read_only_fields = ('m_id',)

class MealPlansView(viewsets.ModelViewSet):

	queryset = MealPlans.objects.all()
	serializer_class = MealPlansSerializer
