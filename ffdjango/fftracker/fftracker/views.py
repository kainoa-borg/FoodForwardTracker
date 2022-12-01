from django.dispatch.dispatcher import receiver
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from django.urls import conf
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from .models import Households, HhAllergies
from .serializers import HouseholdSerializer, AllergySerializer, HouseholdAllergySerializer, IngredientSerializer
#from .utils import updateHousehold, getHouseholdDetail, deleteHousehold, getHouseholdDetail, createHousehold 
from rest_framework import viewsets
from django.db import connection

def ingredients_query(queryString, many=False):
	with connection.cursor() as cursor:
		cursor.execute(queryString)
		keys = ('i_id', 'ingredient_name', 'pkg_type', 'storage_type', 'in_date', 'in_qty', 'unit', 'exp_date', 'unit_cost', 'flat_fee', 'i_supplier_id', 'pref_isupplier_id', 'supplier_name', 'pref_supplier_name')
		result = []
		if many: 
			data = cursor.fetchall()
			for row in data:
				result.append(dict(zip(keys, row)))
		else:
			data = cursor.fetchone()
			result = dict(zip(keys,data))

		return result


# Create your views here.
class IngredientsView(viewsets.ViewSet):
	def list(self, request):
		queryset = ingredients_query("SELECT i.*, s.s_name FROM ingredients i INNER JOIN supplier s WHERE i.isupplier_id = s.s_id OR i.pref_isupplier_id = s.s_id", many=True)
		serializer = IngredientSerializer(queryset, many=True)
		return Response(serializer.data)
	def retrieve(self, request, pk):
		queryset = ingredients_query("SELECT i.*, s.s_name FROM ingredients i INNER JOIN supplier s WHERE (i_id = %s) AND (i.isupplier_id = s.s_id OR i.pref_isupplier_id = s.s_id)"%(pk))
		serializer = IngredientSerializer(queryset)
		return Response(serializer.data)
	def create(self, request):
		form = IngredientsForm()

		if request.method == 'POST':
        		form = Ingredients(request.POST, request.FILES)
		if form.is_valid(commit=False):
			Ingredients.save()
			messages.success(request, 'Ingredients has been created!')
			return redirect('home')
		else:
			messages.error('An error has occured while attempting to add ingredients')
    	    	
		return null

class HouseholdsView(ModelViewSet):
	queryset = Households.objects.all()
	serializer_class = HouseholdSerializer

def households_query():
	with connection.cursor() as cursor:
		cursor.execute("SELECT hh_name, num_adult, num_child FROM households")
		data = cursor.fetchall()

		keys = ('hh_name', 'num_adult', 'num_child')
		result = []

		for row in data:
			result.append(dict(zip(keys, row)))

		return result

class HouseholdsWithAllergies(ModelViewSet):
	queryset = Households.objects.prefetch_related('a_hh_name')
	serializer_class = HouseholdAllergySerializer

def login_page(request):
  page = 'login'

  if request.method == "POST":
    user = authenticate(
      email = request.POST(['email']),
      password = request.POST(['password'])
    )

    if user is not None:
        login(request, user)
        messages.info(request, 'Successfully logged in')
        return redirect('home')
    else:
        messages.error(request, 'Email OR Password is incorrect')
        return redirect('login')

    context = {'page':page}
    return render(request, 'login_register.html', context)

def register_page(request):
  form = CustomUserCreationForm()

  if request.method == 'POST':
      form = CustomCreationForm(request.POST, request.FILES)
      if form.is_valid():
        user = form.save(commit=False)
        user.save()
        login(request, user)
        messages.success(request, 'User account was created!')
        return redirect('home')
      else:
          messages.error(request, 'An error has occurred during registration')
  page = 'register'
  context = {'page':page, 'form':form}
  return render(request, 'login_register.html', context)

def logout_user(request):
    logout(request)
    messages.info(request, 'User was logged out!')
    return redirect('login')



def index(request):
  return HttpResponse("Hello! Welcome to Food Forward Tracker")

