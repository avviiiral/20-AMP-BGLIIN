from django.urls import path
from .views import history, production, efficiency , dashboard

urlpatterns = [
    path('history/<str:camera_id>/', history),
    path('production/<str:camera_id>/', production),
    path('efficiency/<str:camera_id>/', efficiency),
    path('dashboard/', dashboard),
]