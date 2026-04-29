from django.urls import path
from .views import *

urlpatterns = [
    path('dashboard/', dashboard_summary),
    path('stations/', stations),
    path('camera/<str:camera_id>/', camera_detail),
    path('camera/<str:camera_id>/calendar/', camera_calendar),
    path('camera/<str:camera_id>/history/', camera_history),
]