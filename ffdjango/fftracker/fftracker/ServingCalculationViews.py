from rest_framework.viewsets import ViewSet
from rest_framework import serializers
from .models import Households
from .HouseholdViews import HouseholdSerializer
from rest_framework.response import Response

class ServingSerializer(serializers.Serializer):
    meal_servings = serializers.IntegerField()
    snack_servings = serializers.IntegerField()

class ServingCalculationViews(ViewSet):
    def list(self, request):
        queryset = Households.objects.filter(paused_flag=False)
        meal_servings = 0
        snack_servings = 0

        for household in queryset:
            meal_servings += household.num_adult + household.num_child_gt_6 + (household.num_child_lt_6 *.5)
            snack_servings += household.num_adult + household.num_child_gt_6 + household.num_child_lt_6

        serializer = ServingSerializer({'meal_servings': meal_servings, 'snack_servings': snack_servings})

        return Response(serializer.data)
