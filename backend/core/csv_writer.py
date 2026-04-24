import csv
import os
import time
from datetime import datetime
from core.config import CSV_FILE, CAMERAS


def init_csv():
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(
                ["Date", "Time Slot"] +
                [CAMERAS[c]["name"] for c in CAMERAS]
            )


def csv_logger(shared_counts, reset_flag):
    last_hour = None
    last_date = None

    while True:
        now = datetime.now()

        current_date = now.strftime("%Y-%m-%d")
        current_hour = now.strftime("%H")
        current_slot = f"{current_hour}:00-{current_hour}:59"

        # 🔥 Detect hour change
        hour_changed = (
            last_hour is not None and
            (current_hour != last_hour or current_date != last_date)
        )

        if hour_changed:
            # 🔁 Reset counters at hour boundary
            reset_flag.value = 1
            print(f"🔄 Hour changed → Reset triggered")

        # ✅ Build current row (always latest counts)
        row = [current_date, current_slot]
        for c in CAMERAS:
            row.append(shared_counts[c])

        # ================= CSV UPDATE =================
        rows = []
        if os.path.exists(CSV_FILE):
            with open(CSV_FILE, "r") as f:
                rows = list(csv.reader(f))

        header = rows[0] if rows else ["Date", "Time Slot"] + [CAMERAS[c]["name"] for c in CAMERAS]
        data = rows[1:] if rows else []

        updated = False

        # 🔁 Update existing row if same hour exists
        for i in range(len(data)):
            if data[i][0] == current_date and data[i][1] == current_slot:
                data[i] = row
                updated = True
                break

        # ➕ If new hour → add new row
        if not updated:
            data.append(row)

        # ✍️ Rewrite CSV
        with open(CSV_FILE, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(header)
            writer.writerows(data)

        # update trackers
        last_hour = current_hour
        last_date = current_date

        print(f"📊 Updated CSV: {current_date} {current_slot}")

        # ⏱️ Run every 5 minutes
        time.sleep(300)
