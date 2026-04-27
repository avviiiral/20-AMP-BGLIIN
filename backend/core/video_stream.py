import cv2
import threading
import time
import numpy as np

CAMERA_URLS = {
    "cam1":  "rtsp://admin:Admin%40123@192.168.1.193:554/video/live?channel=1&subtype=2",
    "cam2":  "rtsp://admin:Admin%40123@192.168.1.191:554/video/live?channel=1&subtype=2",
    "cam3":  "rtsp://admin:Admin%40123@192.168.1.196:554/video/live?channel=1&subtype=2",
    "cam4":  "rtsp://admin:Admin%40123@192.168.1.198:554/video/live?channel=1&subtype=2",
    "cam5":  "rtsp://admin:Admin%40123@192.168.1.194:554/video/live?channel=1&subtype=2",
    "cam6":  "rtsp://admin:Admin%40123@192.168.1.197:554/video/live?channel=1&subtype=2",
    "cam7":  "rtsp://admin:Admin%40123@192.168.1.188:554/video/live?channel=1&subtype=2",
    "cam8":  "rtsp://admin:Admin%40123@192.168.1.189:554/video/live?channel=1&subtype=2",
    "cam9":  "rtsp://admin:Admin%40123@192.168.1.190:554/video/live?channel=1&subtype=2",
    "cam10": "rtsp://admin:Admin%40123@192.168.1.201:554/video/live?channel=1&subtype=2",
}

LATEST_FRAMES = {}
LOCKS = {}


def _make_placeholder(cam_id):
    """Black frame with text shown while camera is connecting."""
    img = np.zeros((480, 640, 3), dtype=np.uint8)
    cv2.putText(img, f"Connecting {cam_id}...", (60, 240),
                cv2.FONT_HERSHEY_SIMPLEX, 1.0, (120, 120, 120), 2)
    _, buf = cv2.imencode('.jpg', img)
    return buf.tobytes()


def camera_worker(cam_id, url):
    print(f"[STREAM] Starting {cam_id}")
    while True:
        cap = cv2.VideoCapture(url, cv2.CAP_FFMPEG)
        cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

        if not cap.isOpened():
            print(f"[STREAM ERROR] {cam_id} failed to connect. Retry in 5s...")
            time.sleep(5)
            continue

        print(f"[STREAM OK] {cam_id} connected")

        while True:
            ok, frame = cap.read()
            if not ok:
                print(f"[STREAM WARN] {cam_id} dropped. Reconnecting in 2s...")
                break

            frame = cv2.resize(frame, (640, 480))

            with LOCKS[cam_id]:
                LATEST_FRAMES[cam_id] = frame

            time.sleep(0.033)  # ~30 FPS

        cap.release()
        time.sleep(2)


def start_all_cameras():
    for cam_id, url in CAMERA_URLS.items():
        LOCKS[cam_id] = threading.Lock()
        t = threading.Thread(target=camera_worker, args=(cam_id, url), daemon=True)
        t.start()
    print(f"[STREAM] All {len(CAMERA_URLS)} camera threads started")


def generate_frames(cam_id):
    """MJPEG generator — yields JPEG frames wrapped in multipart boundary."""
    placeholder = _make_placeholder(cam_id)

    while True:
        if cam_id not in LATEST_FRAMES:
            # Camera not connected yet — send placeholder so browser doesn't hang
            yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n'
                   + placeholder + b'\r\n')
            time.sleep(0.5)
            continue

        with LOCKS[cam_id]:
            frame = LATEST_FRAMES[cam_id].copy()

        ok, buf = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 70])
        if not ok:
            time.sleep(0.1)
            continue

        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n'
               + buf.tobytes() + b'\r\n')

        time.sleep(0.033)  # ~30 FPS — critical: prevents CPU spin


# ✅ AUTO-START on first import (called when Django loads views.py)
_started = False

def _auto_start():
    global _started
    if not _started:
        _started = True
        start_all_cameras()

_auto_start()