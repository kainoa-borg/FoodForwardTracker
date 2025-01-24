from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Households

class HouseholdIdView(APIView):

    def get(self, request):
        first_name = request.query_params.get('first_name', None)
        last_name = request.query_params.get('last_name', None)

        if not first_name and not last_name:
            return Response({'error': 'First name or last name must be provided'}, status=status.HTTP_400_BAD_REQUEST)

        query = {}
        if first_name:
            query['hh_first_name__iexact'] = first_name
        if last_name:
            query['hh_last_name__iexact'] = last_name

        try:
            household = Households.objects.filter(**query).first()
            if household:
                return Response({'hh_id': household.hh_id})
            else:
                return Response({'error': 'No matching household found'}, status=status.HTTP_404_NOT_FOUND)
        except Households.DoesNotExist:
            return Response({'error': 'No matching household found'}, status=status.HTTP_404_NOT_FOUND)