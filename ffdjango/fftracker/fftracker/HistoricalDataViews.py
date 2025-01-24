from rest_framework import viewsets
from .models import ProductSubscriptionHistory
from .serializers import ProductSubscriptionHistorySerializer

class ProductSubscriptionHistoryView(viewsets.ModelViewSet):
    queryset = ProductSubscriptionHistory.objects.all()
    serializer_class = ProductSubscriptionHistorySerializer
