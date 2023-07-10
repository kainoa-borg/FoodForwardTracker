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
		print('checking password')
		if password and check_password(password, instance.password):
			print('new password')
			instance.password = make_password(password)
		else:
			print('same password')
		if email:
			instance.email = email
		if admin_flag:
			instance.admin_flag = admin_flag
		instance.save()
		return instance

	def create(self, validated_data):
		user = {
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

	def create(self, request):
		# Look for other accounts with this username
		if (Users.objects.all().filter(username = request.data["username"])):
			return Response({
				"errorReason": "username",
				"errorText": "This username is already associated with an account"
			}, 400)
		# Look for other accounts with this email
		if (Users.objects.all().filter(email=request.data["email"])):
			return Response({
				"errorReason": "email",
				"errorText":"This email is already associated with an account."
			}, 400)
		
		serializer = UserSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
		return Response(200)


class UserAuth(viewsets.ViewSet):
	def list(self, request):
		queryset = Users.objects.all()
		serializer = UserSerializer(queryset, many=True)
		return Response(serializer.data)

	def create(self, request):
		# Find users with this username
		queryset = Users.objects.all().filter(username=request.data['username'])
		authedPass = False
		isAdmin = None
		if len(queryset) > 1:
			for user in queryset:
				if check_password(request.data['password'], user.password):
					authedPass = True
					isAdmin = user.admin_flag
		elif len(queryset) > 0:
			if check_password(request.data['password'], queryset[0].password):
				authedPass = True
		else:
			# user not found
			return Response({'isAdmin': False, 'code': 500})

		serializer = UserSerializer(queryset)

		if authedPass:
			# user authed
			return Response({'isAdmin': isAdmin, 'code': 200})
		else:
			# user coudn't be authed
			return Response({'isAdmin': False, 'code': 400})