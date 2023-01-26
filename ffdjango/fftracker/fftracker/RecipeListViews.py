from rest_framework.serializers import ModelSerializer
from rest_framework.viewsets import ModelViewSet
from .models import Recipes

class RecipeListSerializer(ModelSerializer):
	class Meta():
		model = Recipes
		fields = ('r_num', 'r_name')

class RecipeListView(ModelViewSet):
	queryset = Recipes.objects.all()
	serializer_class = RecipeListSerializer