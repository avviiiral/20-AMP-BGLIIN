import cv2
import time
from core.config import USERNAME, PASSWORD, FRAME_W, FRAME_H
from core.logger import logger


def build_rtsp(ip):
    return f"rtsp://{USERNAME}:{PASSWORD}@{ip}:554/video/live?channel=1&subtype=1&rtsp_transport=tcp"


def capture_worker(cam_id, cam_cfg, frame_queue):

    rtsp = build_rtsp(cam_cfg["ip"])

    while True:
        cap = cv2.VideoCapture(rtsp, cv2.CAP_FFMPEG)
        cap.set(cv2.CAP_PROP_BUFFERSIZE, 2)

        # ✅ THIS MUST BE INSIDE FUNCTION
        if not cap.isOpened():
            logger.error(f"[{cam_id}] Camera connection failed. Retrying...")
            time.sleep(2)
            continue
        else:
            logger.info(f"[{cam_id}] Connected successfully")

        while True:
            ret, frame = cap.read()

            if not ret:
                logger.warning(f"[{cam_id}] Stream lost. Reconnecting...")
                break

            frame = cv2.resize(frame, (FRAME_W, FRAME_H))

            if frame_queue.qsize() < 5:
                frame_queue.put((cam_id, frame))
            else:
                try:
                    frame_queue.get_nowait()
                    frame_queue.put((cam_id, frame))
                except:
                    pass

        cap.release()
        time.sleep(1)