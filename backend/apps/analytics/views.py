from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.config import CAMERAS
from .utils import get_camera_history, compute_production, compute_efficiency

from core.system_controller import shared_counts


@api_view(['GET'])
def dashboard(request):
    if shared_counts is None:
        return Response({"error": "System not started"}, status=500)

    counts = dict(shared_counts)

    total_output = sum(counts.values())
    total_stations = len(CAMERAS)

    # simple active logic (we can improve later)
    active_stations = sum(1 for v in counts.values() if v > 0)

    target = int(request.GET.get("target", 1896))

    efficiency = 0
    if target > 0:
        efficiency = (total_output / target) * 100

    return Response({
        "efficiency": round(efficiency, 2),
        "output": total_output,
        "target": target,
        "active_stations": active_stations,
        "total_stations": total_stations,
        "per_station": counts
    })

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