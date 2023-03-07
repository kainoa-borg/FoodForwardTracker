from .models import Users
from rest_framework import serializers, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password, check_password

class UserSerializer(serializers.ModelSerializer):
	class Meta():
		model = Users
		fields = ('u_id', 'username', 'password', 'email', 'admin_flag')
		read_only_fields = ['u_id']

	def update(self, instance, validated_data):
		username = validated_data.pop('username')
		password = validated_data.pop('password')
		email = validated_data.pop('email')
		admin_flag = validated_data.pop('admin_flag')
		print(password)
		if username:
			instance.username = username
		if password:
			instance.password = make_password(password)
		if email:
			instance.email = email
		if admin_flag:
			instance.admin_flag = admin_flag
		instance.save()
		return instance

	def create(self, validated_data):
		latest_id = Users.objects.all().latest('u_id').u_id
		user = {
			"u_id": latest_id + 1,
			"username": validated_data.pop('username'),
			"password": make_password(validated_data.pop('password')),
			"email": validated_data.pop("email"),
			"admin_flag": validated_data.pop('admin_flag')
		}
		user_inst = Users.objects.create(**user)
		return user_inst


class UserView(viewsets.ModelViewSet):
	queryset = Users.objects.all()
	serializer_class = UserSerializer

class UserAuth(viewsets.ViewSet):
	def list(self, request):
		# queryset = Users.objects.all()
		# for user in queryset:
		# 	user.password = make_password(user.password)
		# 	user.save()
		queryset = Users.objects.all()
		serializer = UserSerializer(queryset, many=True)
		return Response(serializer.data)

	def create(self, request):
		# return Response(request.data)
		queryset = Users.objects.all().filter(username=request.data['username'])
		# return Response(len(queryset))
		authedPass = False
		if len(queryset) > 1:
			for user in queryset:
				if check_password(request.data['password'], user.password):
					authedPass = True
		elif len(queryset) > 0:
			if check_password(request.data['password'], queryset[0].password):
				authedPass = True
		else:
			# user not found
			return Response(500)

		serializer = UserSerializer(queryset)

		if authedPass:
			# user authed
			return Response(200)
		else:
			# user coudn't be authed
			return Response(400)