from collections import deque
from core.config import FRAME_W, FRAME_H, ORIGINAL_W, ORIGINAL_H, MOVE_THRESH, COOLDOWN


class Counter:
    def __init__(self, cam):
        self.cam = cam
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
                self.count += self.cam["multiplier"]
                print(f"{self.cam['name']} Count: {self.count}")
                self.cooldown = COOLDOWN
                self.memory.clear()

        if self.cooldown > 0:
            self.cooldown -= 1

        return self.count