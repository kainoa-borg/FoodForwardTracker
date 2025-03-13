from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
# from .models import IngredientCategory, IngredientSubCategory, Ingredient
# from .serializers import IngredientSerializer


# class IngredientListCreateViewNEW(APIView):
#     def get(self, request, category_id, subcategory_id):
#         subcategory = get_object_or_404(IngredientSubCategory, id=subcategory_id, category_id=category_id)
#         ingredients = Ingredient.objects.filter(subcategory=subcategory)
#         serializer = IngredientSerializer(ingredients, many=True)
#         return Response(serializer.data)

#     def post(self, request, category_id, subcategory_id):
#         subcategory = get_object_or_404(IngredientSubCategory, id=subcategory_id, category_id=category_id)
#         ing_name = request.data.get("ing_name")
#         if not ing_name:
#             return Response({"error": "Ingredient name is required"}, status=status.HTTP_400_BAD_REQUEST)

#         ingredient = Ingredient.objects.create(ing_name=ing_name, subcategory=subcategory)
#         serializer = IngredientSerializer(ingredient)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)


# class IngredientUpdateDeleteViewNEW(APIView):
#     def put(self, request, category_id, subcategory_id, ing_id):
#         subcategory = get_object_or_404(IngredientSubCategory, id=subcategory_id, category_id=category_id)
#         ingredient = get_object_or_404(Ingredient, id=ing_id, subcategory=subcategory)
        
#         ing_name = request.data.get("ing_name")
#         if not ing_name:
#             return Response({"error": "Ingredient name is required"}, status=status.HTTP_400_BAD_REQUEST)

#         ingredient.ing_name = ing_name
#         ingredient.save()
#         serializer = IngredientSerializer(ingredient)
#         return Response(serializer.data)

#     def delete(self, request, category_id, subcategory_id, ing_id):
#         subcategory = get_object_or_404(IngredientSubCategory, id=subcategory_id, category_id=category_id)
#         ingredient = get_object_or_404(Ingredient, id=ing_id, subcategory=subcategory)
#         ingredient.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


# class IngredientAllListViewNEW(APIView):
#     def get(self, request):
#         ingredients = Ingredient.objects.select_related('subcategory__category').all()
#         data = [
#             {
#                 "id": ing.id,
#                 "ing_name": ing.ing_name,
#                 "subcategory_name": ing.subcategory.name,
#                 "category_name": ing.subcategory.category.name,
#             }
#             for ing in ingredients
#         ]
#         return Response(data)
