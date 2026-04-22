from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.config import CAMERAS
from .utils import get_camera_history, compute_production, compute_efficiency


@api_view(['GET'])
def history(request, camera_id):
    cam = CAMERAS.get(camera_id)

    if not cam:
        return Response({"error": "Invalid camera"}, status=404)

    return Response(get_camera_history(cam["name"]))


@api_view(['GET'])
def production(request, camera_id):
    cam = CAMERAS.get(camera_id)

    if not cam:
        return Response({"error": "Invalid camera"}, status=404)

    return Response(compute_production(cam["name"]))


@api_view(['GET'])
def efficiency(request, camera_id):
    cam = CAMERAS.get(camera_id)

    if not cam:
        return Response({"error": "Invalid camera"}, status=404)

    target = int(request.GET.get("target", 100))

    return Response(compute_efficiency(cam["name"], target))