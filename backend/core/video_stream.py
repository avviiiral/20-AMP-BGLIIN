import cv2
from threading import Lock

# Store camera objects globally (avoid reopening repeatedly)
CAMERA_OBJECTS = {}
LOCK = Lock()

CAMERA_URLS = {
    "cam1": "rtsp://admin:Admin%40123@192.168.1.193:554/video/live?channel=1&subtype=2",  # replace with RTSP later
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

def get_camera(cam_id):
    with LOCK:
        if cam_id not in CAMERA_OBJECTS:
            url = CAMERA_URLS.get(cam_id)
            if url is None:
                raise ValueError(f"Invalid camera ID: {cam_id}")
            cap = cv2.VideoCapture(url)
            CAMERA_OBJECTS[cam_id] = cap
        return CAMERA_OBJECTS[cam_id]


def generate_frames(cam_id):
    cap = get_camera(cam_id)

    while True:
        success, frame = cap.read()

        if not success:
            continue

        # OPTIONAL: resize for performance
        frame = cv2.resize(frame, (640, 480))

        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n'
        )