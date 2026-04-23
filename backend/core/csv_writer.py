import csv
import os
import time
from datetime import datetime
from core.config import CSV_FILE, CAMERAS


def init_csv():
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["Date", "Time Slot"] + [CAMERAS[c]["name"] for c in CAMERAS])


def csv_logger(shared_counts, reset_flag):
    last_slot = None

    while True:
        now = datetime.now()
        current_slot = now.strftime("%H:00-%H:59")

        if current_slot != last_slot:
            row = [now.strftime("%Y-%m-%d"), current_slot]

            for c in CAMERAS:
                row.append(shared_counts[c])

            with open(CSV_FILE, "a", newline="") as f:
                writer = csv.writer(f)
                writer.writerow(row)

            last_slot = current_slot

        time.sleep(5)