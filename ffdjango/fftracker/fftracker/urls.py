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
from .views import HouseholdsView, HouseholdsWithAllergies, IngredientsView

from .models import (Households, Ingredients, Packaging)
#admin.site.register(Households)
#admin.site.register(Ingredients)
#admin.site.register(Packaging)
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'ingredients', IngredientsView, basename='ingredients')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/update-household/<str:pk>/', HouseholdsView.as_view({'get': 'retrieve', 'patch': 'update'})),
    path('api/get-households', HouseholdsView.as_view({'get': 'list', 'post': 'create'})),
    path('api/get-households/<str:pk>/', HouseholdsView.as_view({})
    path('api/get-ingredient', IngredientsView.as_view({'get': 'retrieve'})),
    path('api/householdswithallergies', HouseholdsWithAllergies.as_view({'get': 'list'})),
    path('', include(router.urls))
]