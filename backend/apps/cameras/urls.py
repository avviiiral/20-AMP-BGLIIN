from django.urls import path
from .views import camera_list, all_stats, camera_stats

urlpatterns = [
    path('cameras/', camera_list),
    path('stats/', all_stats),
    path('stats/<str:camera_id>/', camera_stats),
]