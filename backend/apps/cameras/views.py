from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.system_controller import get_counts
from core.config import CAMERAS

from django.http import StreamingHttpResponse
from core.video_stream import generate_frames
import cv2

@api_view(['GET'])
def camera_list(request):
    return Response(CAMERAS)


@api_view(['GET'])
def all_stats(request):
    return Response(get_counts())


@api_view(['GET'])
def camera_stats(request, camera_id):
    counts = get_counts()

    return Response({
        "camera_id": camera_id,
        "count": counts.get(camera_id, 0)
    })


def video_feed(request, cam_id):
    return StreamingHttpResponse(
        generate_frames(cam_id),
        content_type='multipart/x-mixed-replace; boundary=frame'
    )