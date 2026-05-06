from datetime import datetime, timedelta

class Metrics:
    def __init__(self):
        self.total_output = 0
        self.target_output = 1896  # you can load from DB
        self.station_status = {}  # {cam_id: last_seen_time}

    def update_count(self, cam_id, count):
        self.total_output += count
        self.station_status[cam_id] = datetime.now()

    def get_active_stations(self):
        now = datetime.now()
        active = 0

        for cam, last_seen in self.station_status.items():
            if now - last_seen < timedelta(seconds=10):
                active += 1

        return active

    def get_metrics(self):
        efficiency = 0
        if self.target_output > 0:
            efficiency = (self.total_output / self.target_output) * 100

        return {
            "efficiency": round(efficiency, 2),
            "output": self.total_output,
            "target": self.target_output,
            "active_stations": self.get_active_stations(),
            "total_stations": len(self.station_status)
        }


metrics = Metrics()