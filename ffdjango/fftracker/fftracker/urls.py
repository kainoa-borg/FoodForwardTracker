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
from .models import (Households, Ingredients, Packaging, MealPlans, Recipes)
from rest_framework import routers

from .AccountCreationViews import AccountCreateView
from .CalculationsView import CalculationsView
from .HouseholdViews import HouseholdsView, HouseholdsWithAllergies
from .IngredientViews import IngredientInvView
from .MenuView import MenuView
from .MealPlanViews import MealPlansView
from .MealView import MealView
from .MealRecipeViews import *
from .PackagingViews import PackagingInvView
from .PacPurchaseList import PPLView
from .RecipeListViews import RecipeListView
from .ServingCalculationViews import ServingCalculationViews
from .StationViews import StationsView
from .SupplierViews import SupplierView
from .UserView import UserAuth
from .UserView import UserView
from .views import UserView

#admin.site.register(Households)
#admin.site.register(Ingredients)
#admin.site.register(Packaging)

router = routers.DefaultRouter()
router.register(r'create-account', AccountCreateView, basename='create-account')
router.register(r'households', HouseholdsWithAllergies, basename='households')
router.register(r'households-report', HouseholdsView, basename='households-report')
router.register(r'ingredient-inventory', IngredientInvView, basename='ingredient-inventory')
router.register(r'ingredients-report', IngredientInvView, basename='ingredients-report')
router.register(r'packaging', PackagingInvView, basename='packaging')
router.register(r'packaging-inventory', PackagingInvView, basename='packaging-inventory')
router.register(r'packaging-report', PackagingInvView, basename='packaging-report')
router.register(r'pack-purchase-list', PPLView, basename='pack-purchase-list')
router.register(r'users', UserView, basename='users')
router.register(r'user-auth', UserAuth, basename='user-auth')
router.register(r'menu', MenuView, basename='menu')
router.register(r'meal', MealView, basename='meals-list')
router.register(r'mealplans', MealPlansView, basename='mealplans')
router.register(r'mealrecipes', RecipeView, basename='mealrecipes')
router.register(r'mealrecipe-image', RecipeImageView, basename='mealrecipe-image')
router.register(r'mealrecipe-card', RecipeCardView, basename='mealrecipe-card')
router.register(r'mealrecipe-ingredients', RecipeIngredientsView, basename='mealrecipe-ingredients')
router.register(r'mealrecipe-packaging', RecipePackagingView, basename='mealrecipe-packaging')
router.register(r'mealrecipe-diets', RecipeDietsView, basename='mealrecipe-diets')
router.register(r'mealrecipe-instructions', RecipeInstructionsView, basename='mealrecipe-instructions')
router.register(r'stations', StationsView, basename='stations')
router.register(r'suppliers', SupplierView, basename='suppliers')
router.register(r'recipe-list', RecipeListView, basename='recipe-list')
router.register(r'calculations', CalculationsView, basename='calculations')
router.register(r'serving-calculations', ServingCalculationViews, basename='serving-calculations')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/create-account', AccountCreateView.as_view({'get': 'retrieve'})),
    path('api/update-household/<str:pk>/', HouseholdsView.as_view({'get': 'retrieve', 'patch': 'update'})),
    path('api/get-households', HouseholdsView.as_view({'get': 'list', 'post': 'create'})),
    path('api/get-households/<str:pk>/', HouseholdsView.as_view({'get': 'retrieve'})),
    path('api/get-ingredient', IngredientInvView.as_view({'get': 'list', 'get': 'retrieve'})),
    path('api/get-packaging', PackagingInvView.as_view({'get': 'list', 'get': 'retrieve'})),
    path('api/get-pack-purchase-list', PPLView.as_view({'get': 'list', 'get': 'retrieve'})),
    path('api/get-users', UserView.as_view({'get': 'retrieve'})),
    path('api/get-menu', MenuView.as_view({'get': 'retrieve'})),
    path('api/get-meals', MealView.as_view({'get': 'list', 'get': 'retrieve'})),
    path('api/get-mealplans', MealPlansView.as_view({'get': 'retrieve'})),
    path('api/get-mealrecipes', RecipeView.as_view({'get': 'retrieve'})),
    path('api/get-stations', StationsView.as_view({'get': 'list', 'get': 'retrieve'})),

]
