import csv
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGET_FILE = os.path.join(BASE_DIR, 'targets.csv')

def load_targets():
    targets = {}

    if not os.path.exists(TARGET_FILE):
        print("targets.csv not found:", TARGET_FILE)
        return targets

    with open(TARGET_FILE, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            try:
                targets[row['camera_id']] = int(row['target_per_hour'])
            except:
                continue

    return targets


# load once (better performance)
TARGETS = load_targets()