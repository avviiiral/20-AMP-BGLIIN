from collections import deque
from datetime import datetime
from core.config import FRAME_W, FRAME_H, ORIGINAL_W, ORIGINAL_H, MOVE_THRESH, COOLDOWN



class Counter:
    def __init__(self, cam, cam_id):
        self.cam = cam
        self.cam_id = cam_id  # ✅ use dict key as ID

        self.memory = deque(maxlen=10)
        self.cooldown = 0
        self.count = 0

        if cam["mode"] == "x":
            self.line = int(cam["pos"] * FRAME_W / ORIGINAL_W)
        else:
            self.line = int(cam["pos"] * FRAME_H / ORIGINAL_H)

    def reset(self):
        self.memory.clear()
        self.cooldown = 0
        self.count = 0

    def update(self, centers):
        

        if len(centers) == 0:
            return self.count

        # Get closest object to counting line
        if self.cam["mode"] == "x":
            pos_val = sorted(centers, key=lambda c: abs(c[0] - self.line))[0][0]
        else:
            pos_val = sorted(centers, key=lambda c: abs(c[1] - self.line))[0][1]

        self.memory.append(pos_val)

        if len(self.memory) >= 6:
            vals = list(self.memory)
            prev, curr = vals[0], vals[-1]
            move = abs(curr - prev)

            left = sum(v < self.line for v in vals[:3])
            right = sum(v > self.line for v in vals[:3])

            crossed = False

            if self.cam["dir"] in ["lr", "tb"]:
                crossed = left >= 2 and curr > self.line and move > MOVE_THRESH
            else:
                crossed = right >= 2 and curr < self.line and move > MOVE_THRESH

            if crossed and self.cooldown == 0:
                increment = self.cam["multiplier"]
                self.count += increment

                print(f"{self.cam['name']} Count: {self.count}")


                self.cooldown = COOLDOWN
                self.memory.clear()

        # Cooldown handling
        if self.cooldown > 0:
            self.cooldown -= 1

        return self.count


# ==============================
# MAIN EXECUTION LOOP
# ==============================

def run_counters(counters, shared_counts, detections_source):
    """
    counters: list of Counter objects
    shared_counts: list (same length as counters)
    detections_source: function that returns detections per camera
    """

    last_hour = datetime.now().hour

    while True:
        current_hour = datetime.now().hour

        # 🔥 RESET EVERY HOUR
        if current_hour != last_hour:
            print(f"🔄 Reset at {datetime.now().strftime('%Y-%m-%d %H:00')}")

            for counter in counters:
                counter.reset()

            for i in range(len(shared_counts)):
                shared_counts[i] = 0

            # 🔥 Reset global metrics
            metrics.total_output = 0

            last_hour = current_hour

        # ==============================
        # GET DETECTIONS
        # ==============================
        detections = detections_source()
        # expected: [centers_cam1, centers_cam2, ...]

        # ==============================
        # UPDATE COUNTERS
        # ==============================
        for i, counter in enumerate(counters):
            count = counter.update(detections[i])
            shared_counts[i] = count