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
		queryset = Households.objects.filter(paused_flag=False)
		meal_servings = 0
		snack_servings = 0

		# for household in queryset:
		# 	meal_servings += household.num_adult + household.num_child_gt_6 + (household.num_child_lt_6 *.5)
		# 	snack_servings += household.num_adult + household.num_child_gt_6 + household.num_child_lt_6

		validated_data['meal_servings'] = meal_servings
		validated_data['snack_servings'] = snack_servings
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
