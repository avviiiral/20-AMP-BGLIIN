import csv
import os
from core.config import CSV_FILE, CAMERAS
#from .views import camera_dashboard

def read_csv():
    if not os.path.exists(CSV_FILE):
        return []

    with open(CSV_FILE, "r") as f:
        reader = csv.DictReader(f)
        return list(reader)


def validate_column(camera_name, data):
    if not data:
        return False

    if camera_name not in data[0]:
        print(f"[ERROR] Column '{camera_name}' not found in CSV")
        return False

    return True


def get_camera_history(camera_name):
    data = read_csv()

    if not validate_column(camera_name, data):
        return []

    history = []

    for row in data:
        try:
            val = row[camera_name]

            if val == "":
                continue

            history.append({
                "datetime": f"{row['Date']} {row['Time Slot']}",
                "count": float(val)
            })
        except:
            continue

    return history


def compute_production(camera_name):
    history = get_camera_history(camera_name)

    return [
        {
            "time": h["datetime"],
            "production": h["count"]
        }
        for h in history
    ]


def compute_efficiency(camera_name, target=100):
    history = get_camera_history(camera_name)

    result = []

    for h in history:
        actual = h["count"]
        efficiency = (actual / target) * 100 if target else 0

        result.append({
            "time": h["datetime"],
            "actual": actual,
            "target": target,
            "efficiency": round(efficiency, 2)
        })

    return result