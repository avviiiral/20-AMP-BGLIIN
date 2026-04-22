import multiprocessing as mp
import os
import threading
import time
from core.logger import logger

from core.config import CAMERAS
from core.camera_manager import capture_worker
from core.inference import inference_worker
from core.csv_writer import init_csv, csv_logger

manager = None
shared_counts = None
reset_flag = None
frame_queues = None
processes = []

def start_system():
    global manager, shared_counts, reset_flag, frame_queues, processes

    # 🔥 Prevent duplicate start
    if manager is not None:
        print("System already running")
        return

    mp.set_start_method("spawn", force=True)

    manager = mp.Manager()
    shared_counts = manager.dict({cid: 0 for cid in CAMERAS})
    reset_flag = manager.Value('i', 0)

    frame_queues = {cid: mp.Queue(maxsize=5) for cid in CAMERAS}

    # Capture processes
    for cam_id, cam_cfg in CAMERAS.items():
        p = mp.Process(target=capture_worker, args=(cam_id, cam_cfg, frame_queues[cam_id]))
        p.daemon = True
        p.start()
        processes.append(p)

    # Inference process
    p = mp.Process(target=inference_worker, args=(frame_queues, shared_counts, reset_flag))
    p.daemon = True
    p.start()
    processes.append(p)

    # CSV logger
    init_csv()
    p = mp.Process(target=csv_logger, args=(shared_counts, reset_flag))
    p.daemon = True
    p.start()
    processes.append(p)

    threading.Thread(target=monitor_processes, daemon=True).start()
    
    logger.info("🚀 Core system started")

    print("🚀 Core system started")


def get_counts():
    if shared_counts is None:
        return {}
    return dict(shared_counts)

def monitor_processes():
    global processes

    while True:
        for i, p in enumerate(processes):
            if not p.is_alive():
                print(f"[ERROR] Process {i} died. Restarting...")

                new_p = mp.Process(target=p._target, args=p._args)
                new_p.daemon = True
                new_p.start()

                processes[i] = new_p

        time.sleep(5)