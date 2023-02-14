from .models import Users
from rest_framework import serializers, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password, check_password

class UserSerializer(serializers.ModelSerializer):
	class Meta():
		model = Users
		fields = ('__all__')

class UserView(viewsets.ModelViewSet):
	queryset = Users.objects.all()
	serializer_class = UserSerializer

class UserAuth(viewsets.ViewSet):
	def list(self, request):
		queryset = Users.objects.all()
		for user in queryset:
			user.password = make_password(user.password)
			user.save()
		queryset = Users.objects.all()
		serializer = UserSerializer(queryset, many=True)
		return Response(serializer.data)

	def create(self, request):
		# return Response(request.data)
		queryset = Users.objects.filter(username=request.data['username'])
		authedPass = False
		if len(queryset) > 1:
			for user in queryset:
				if check_password(request.data['password'], user.password):
					authedPass = True
		elif len(queryset) > 0:
			if check_password(request.data['password'], queryset[0].password):
				authedPass = True
		else:
			return Response(500)

		serializer = UserSerializer(queryset)

		if authedPass:
			return Response(200)
		else:
			return Response(400)