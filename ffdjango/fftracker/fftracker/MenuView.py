from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from .models import MealPlans, Recipes

class MenuSerializer(ModelSerializer):
	meal_name = serializers.CharField(max_length=200)
	snack_name = serializers.CharField(max_length=200)
	class Meta():
		model = MealPlans
		fields = ('m_id', 'm_date', 'snack_r_num', 'meal_r_num', 'num_servings', 'meal_name', 'snack_name')

class MenuView(viewsets.ViewSet):
	def list(self, request):
		keys = ('m_id', 'm_date', 'snack_r_num', 'meal_r_num', 'num_servings', 'meal_name', 'snack_name')
		query = "SELECT mp.*, (SELECT r_name FROM recipes WHERE mp.meal_r_num = r_num) AS meal_name, (SELECT r_name FROM recipes WHERE mp.snack_r_num = r_num) AS snack_name FROM meal_plans mp"
		queryset = execute_query(query, keys, many=True)
		serializer = MenuSerializer(queryset, many=True)
		return Response(serializer.data)
	def retrieve(self, request, pk):
		query = "SELECT mp.*, (SELECT r_name FROM recipes WHERE mp.meal_r_num = r_num) AS meal_name, (SELECT r_name FROM recipes WHERE mp.snack_r_num = r_num) AS snack_name FROM meal_plans mp WHERE mp.m_id=%s"%(pk)
		keys = ('m_id', 'm_date', 'snack_r_num', 'meal_r_num', 'num_servings', 'meal_name', 'snack_name')
		queryset = execute_query(query, keys)
		serializer = MenuSerializer(queryset)
		return Response(serializer.data)
	def update(self, request):
		data = request.data
		serializer = MenuSerializer(data)
		if serializer.is_valid():
			serializer.save()
			return Response(status=status.HTTP_200_OK)
		return Response(status=status.HTTP_200_BADREQUEST)

	#class Meta():
	#	model = MealPlans
	#	fields = ('m_id', 'm_date', 'snack_r_num', 'meal_r_num', 'num_servings')

#class MenuRecipeSerializer(serializers.ModelSerializer):
#	r_data = RecipeSerializer(many=True)
#	class Meta():
#		model = MealPlans
#		depth = 1
#		fields = ('m_id', 'm_date', 'snack_r_num', 'meal_r_num', 'num_servings', 'r_data')
#	def create(self, validated_data):
#		recipe_data = validated_data.pop('r_data')
#		mp_model = MealPlans.objects.create(**validated_data)
#		for data in recipe_data: 
#			data['meal_r_num'] = mp_model
#			data['m_id'] = Recipes.objects.latest('m_id').m_id + 1
#			data_model = Recipes.objects.create(**data)
#		return mp_model
#
		#query = "SELECT mp.m_date, r.r_name FROM meal_plans mp INNER JOIN recipes r ON mp.meal_r_num = r.r_num OR mp.snack_r_num = r.r_num"%(pk)
		#keys = ('mp.m_date', 'r.r_name')


