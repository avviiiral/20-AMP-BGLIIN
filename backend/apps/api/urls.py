from django.urls import path
from .views import production_data

urlpatterns = [
    path('production-data/', production_data),
]