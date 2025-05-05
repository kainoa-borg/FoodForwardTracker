from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from fftracker.models import Ingredients, IngredientConversion
from rest_framework.decorators import action, api_view
from rest_framework import status

class IngredientsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredients
        fields = '__all__'

class IngredientsView(ModelViewSet):
    queryset = Ingredients.objects.all()
    serializer_class = IngredientsSerializer

    def get_queryset(self):
        parent_category = self.request.query_params.get('parent_category')
        specific_category = self.request.query_params.get('specific_category')

        queryset = self.queryset
        if parent_category:
            queryset = queryset.filter(parent_category=int(parent_category))
        if specific_category:
            queryset = queryset.filter(specific_category=int(specific_category))

        return queryset

    @action(detail=False, methods=['get'], url_path='filter')
    def filter_by_category(self, request):
        try:
            parent_category = request.query_params.get('parent_category')
            specific_category = request.query_params.get('specific_category')

            queryset = self.get_queryset()
            if not queryset.exists():
                return Response({'error': 'No ingredients found for the specified categories.'}, status=404)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail=False, methods=['get'], url_path='foodgroup/(?P<parent_category>[0-9]+)/specific/(?P<specific_category>[0-9]+)')
    def filter_by_subcategory(self, request, parent_category=None, specific_category=None):
        try:
            # Ensure parent_category and specific_category are integers
            parent_category = int(parent_category)
            specific_category = int(specific_category)

            # Filter ingredients by parent_category and specific_category
            queryset = self.queryset.filter(parent_category=parent_category, specific_category=specific_category)
            if not queryset.exists():
                # Debugging log to check why no ingredients are found
                print(f"Debug: No ingredients found for parent_category={parent_category}, specific_category={specific_category}")
                print(f"Debug: Available ingredients: {self.queryset.values()}")

                return Response({'error': 'No ingredients found for this food group and specific category.'}, status=404)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except ValueError:
            return Response({'error': 'Invalid food group or specific category ID.'}, status=400)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

@api_view(['GET', 'POST'])
def ingredient_conversion_handler(request):
    if request.method == 'POST':
        try:
            data = request.data
            print("Received data:", data)

            ingredient_id = data.get('ingredientId')
            unit_a = data.get('unit_a')
            unit_b = data.get('unit_b')
            amt_a = data.get('amt_a')
            amt_b = data.get('amt_b')

            if not all([ingredient_id, unit_a, unit_b, amt_a, amt_b]):
                return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

            conversion = IngredientConversion.objects.create(
                ingredientId_id=ingredient_id,
                unit_a=unit_a,
                unit_b=unit_b,
                amt_a=amt_a,
                amt_b=amt_b
            )

            return Response({'message': 'Conversion saved successfully.', 'id': conversion.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'GET':
        try:
            ingredient_id = request.query_params.get('ingredientId')
            if not ingredient_id:
                return Response({'error': 'ingredientId is required.'}, status=status.HTTP_400_BAD_REQUEST)

            conversions = IngredientConversion.objects.filter(ingredientId_id=ingredient_id)
            if not conversions.exists():
                return Response({'message': 'No conversions found for this ingredient.'}, status=status.HTTP_404_NOT_FOUND)

            conversion_data = [
                {
                    'unit_a': conversion.unit_a,
                    'amt_a': conversion.amt_a,
                    'unit_b': conversion.unit_b,
                    'amt_b': conversion.amt_b,
                }
                for conversion in conversions
            ]
            return Response(conversion_data, status=status.HTTP_200_OK)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


