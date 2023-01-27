from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from .models import MealPlans, Recipes
# Create your views here.

class MealPlansSerializer(ModelSerializer):
	# meal_name = serializers.CharField(max_length=50)
	# snack_name = serializers.CharField(max_length=50)
	class Meta():
		model = MealPlans
		fields = ('m_id', 'm_date', 'meal_r_num', 'snack_r_num', 'meal_servings', 'snack_servings')
		# fields = ('__all__')

class MealPlansView(viewsets.ModelViewSet):
	# def list(self, request):
	# 	# keys = ('m_id', 'm_date', 'snack_r_num', 'meal_r_num', 'meal_servings', 'snack_servings', 'meal_name', 'snack_name')
	# 	# query = "SELECT mp.*, (SELECT r_name FROM recipes WHERE mp.meal_r_num = r_num) AS meal_name, (SELECT r_name FROM recipes WHERE mp.snack_r_num = r_num) AS snack_name FROM meal_plans mp"
	# 	queryset = MealPlans.objects.all()
	# 	serializer = MealPlansSerializer(queryset, many=True)
	# 	return Response(serializer.data)
	# def retrieve(self, request, pk):
	# 	query = "SELECT mp.*, (SELECT r_name FROM recipes WHERE mp.meal_r_num = r_num) AS meal_name, (SELECT r_name FROM recipes WHERE mp.snack_r_num = r_num) AS snack_name FROM meal_plans mp WHERE mp.m_id=%s"%(pk)
	# 	keys = ('m_id', 'm_date', 'snack_r_num', 'meal_r_num', 'num_servings', 'meal_name', 'snack_name')
	# 	queryset = execute_query(query, keys)
	# 	serializer = MealPlansSerializer(queryset)
	# 	return Response(serializer.data)
	# def update(self, request):
	# 	data = request.data
	# 	serializer = MealPlansSerializer(data)
	# 	if serializer.is_valid():
	# 		serializer.save()
	# 		return Response(status=status.HTTP_200_OK)
	# 	return Response(status=status.HTTP_200_BADREQUEST)
	queryset = MealPlans.objects.all()
	serializer_class = MealPlansSerializer
