from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Households
from .serializers import HouseholdReportSerializer

class IndividualClientView(viewsets.ViewSet):

    @action(detail=True, methods=['get'])
    def report(self, request, pk=None):
        try:
            household = Households.objects.get(pk=pk)
        except Households.DoesNotExist:
            return Response({'error': 'Household not found'}, status=404)
        
        report_data = {
            'household': {
                'id': household.hh_id,
                'first_name': household.hh_first_name,
                'last_name': household.hh_last_name,
                'children_servings':((household.num_child_lt_6)*0.5) + household.num_child_gt_6,
                'adult_servings': household.num_adult
            },
            'products': {
                'Pre-prepared Meal Kit' : household.ppMealKit_flag,
                'Children Snacks': household.childrenSnacks_flag,
                'Food Box': household.foodBox_flag,
                'Ready-to-eat Meals': household.rteMeal_flag
            }
        }

        return Response(report_data)