from django.urls import path
from .views_dashboard import get_production_data

urlpatterns = [
    path('dashboard-data/', get_production_data),
]