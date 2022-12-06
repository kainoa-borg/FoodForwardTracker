from .helperfuncs import execute_query
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework import status
from .models import AuthUser


class AuthUserSerializer(ModelSerializer):
    class Meta():
        model = AuthUser
        fields = ('__all__')

class AccountCreateView(viewsets.View):
    def list(self, request):
        keys = ('inst_id', 'step_no', 'step_inst', 'stn_name', 'inst_recipe_name')
        query = "INSERT INTO users (username, password, admin_flag) VALUES {<input username>, <input password>, <0 or 1>}"
        queryset = execute_query(query, keys)
        serializer = AuthUserSerializer(queryset)
        return Response(serializer.data)

    def retrieve(self, request, pk):
        keys = ('inst_id', 'step_no', 'step_inst', 'stn_name', 'inst_recipe_name')
        query = 'INSERT INTO users (username, password, admin_flag) VALUES {<input username>, <input password>, <0 or 1>}=(%pk)'
        queryset = execute_query(query, keys, pk)
        serializer = AuthUserSerializer(queryset)
        return Response(serializer.data)

    def update(self, request, pk):
        data = request.data
        serializer = AuthUserSerializer(data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_200_BADREQUEST)




