"""fftracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from .views import UserView
from .UserView import UserView
from .HouseholdViews import HouseholdsView, HouseholdsWithAllergies
from .IngredientViews import IngredientInvView
from .PackagingViews import PackagingInvView
from .MenuView import MenuView
from .PacPurchaseList import PPLView
from .MealPlanViews import MealPlansView
from .MealRecipeViews import MealRecipeViews
from .AccountCreationViews import AccountCreationViews

from .models import (Households, Ingredients, Packaging, MealPlans, Recipes)
#admin.site.register(Households)
#admin.site.register(Ingredients)
#admin.site.register(Packaging)
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'ingredient-inventory', IngredientInvView, basename='ingredient-inventory')
router.register(r'households', HouseholdsWithAllergies, basename='households')
router.register(r'packaging', PackagingInvView, basename='packaging')
router.register(r'pack-purchase-list', PPLView, basename='pack-purchase-list')
router.register(r'users', UserView, basename='users')
router.register(r'menu', MenuView, basename='menu')
router.register(r'packaging-inventory', PackagingInvView, basename='packaging-inventory')
router.register(r'mealplans', MealPlansView, basename='mealplans')
router.register(r'mealrecipes', MealRecipeViews, basename='mealrecipes')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/update-household/<str:pk>/', HouseholdsView.as_view({'get': 'retrieve', 'patch': 'update'})),
    path('api/get-households', HouseholdsView.as_view({'get': 'list', 'post': 'create'})),
    path('api/get-households/<str:pk>/', HouseholdsView.as_view({'get': 'retrieve'})),
    path('api/get-ingredient', IngredientInvView.as_view({'get': 'list', 'get': 'retrieve'})),
    path('api/get-packaging', PackagingInvView.as_view({'get': 'list', 'get': 'retrieve'})),
    path('api/get-pack-purchase-list', PPLView.as_view({'get': 'list', 'get': 'retrieve'})),
    path('api/get-menu', MenuView.as_view({'get': 'retrieve'})),
    path('api/get-mealplan', MealPlansView.as_view({'get': 'retrieve'})),
    path('api/get-mealrecipes', MealRecipeViews.as_view({'get': 'retrieve'})),
    path('api/', include(router.urls))
]
