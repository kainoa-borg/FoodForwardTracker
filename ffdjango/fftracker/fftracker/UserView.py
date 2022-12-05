from .models import Users
from rest_framework import serializers, viewsets

class UserSerializer(serializers.ModelSerializer):
	class Meta():
		model = Users
		fields = ('__all__')

class UserView(viewsets.ModelViewSet):
	queryset = Users.objects.all()
	serializer_class = UserSerializer