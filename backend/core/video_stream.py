import cv2
import threading
import time

CAMERA_URLS = {
    "cam1": "rtsp://admin:Admin%40123@192.168.1.193:554/video/live?channel=1&subtype=2",
    "cam2": "rtsp://admin:Admin%40123@192.168.1.191:554/video/live?channel=1&subtype=2",
    "cam3": "rtsp://admin:Admin%40123@192.168.1.196:554/video/live?channel=1&subtype=2",
    "cam4": "rtsp://admin:Admin%40123@192.168.1.198:554/video/live?channel=1&subtype=2",
    "cam5": "rtsp://admin:Admin%40123@192.168.1.194:554/video/live?channel=1&subtype=2",
    "cam6": "rtsp://admin:Admin%40123@192.168.1.197:554/video/live?channel=1&subtype=2",
    "cam7": "rtsp://admin:Admin%40123@192.168.1.188:554/video/live?channel=1&subtype=2",
    "cam8": "rtsp://admin:Admin%40123@192.168.1.189:554/video/live?channel=1&subtype=2",
    "cam9": "rtsp://admin:Admin%40123@192.168.1.190:554/video/live?channel=1&subtype=2",
    "cam10": "rtsp://admin:Admin%40123@192.168.1.201:554/video/live?channel=1&subtype=2",
}

# Shared frame storage
LATEST_FRAMES = {}
LOCKS = {}

def camera_worker(cam_id, url):
    print(f"[INIT] Starting camera {cam_id}")

    cap = cv2.VideoCapture(url, cv2.CAP_FFMPEG)

    while True:
        success, frame = cap.read()

        if not success:
            print(f"[ERROR] {cam_id} reconnecting...")
            cap.release()
            time.sleep(1)
            cap = cv2.VideoCapture(url, cv2.CAP_FFMPEG)
            continue

        frame = cv2.resize(frame, (640, 480))

        LOCKS[cam_id].acquire()
        LATEST_FRAMES[cam_id] = frame
        LOCKS[cam_id].release()

        time.sleep(0.03)  # control FPS


def start_all_cameras():
    for cam_id, url in CAMERA_URLS.items():
        LOCKS[cam_id] = threading.Lock()

        t = threading.Thread(target=camera_worker, args=(cam_id, url))
        t.daemon = True
        t.start()


def generate_frames(cam_id):
    while True:
        if cam_id not in LATEST_FRAMES:
            time.sleep(0.1)
            continue

        LOCKS[cam_id].acquire()
        frame = LATEST_FRAMES[cam_id]
        LOCKS[cam_id].release()

        _, buffer = cv2.imencode('.jpg', frame)

        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n'
        )