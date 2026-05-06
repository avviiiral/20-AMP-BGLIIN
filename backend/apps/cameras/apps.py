import os
from django.apps import AppConfig


class CamerasConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.cameras'

    def ready(self):
        if os.environ.get('RUN_MAIN') == 'true':
            print("🚀 Starting camera threads...")

            from core.video_stream import start_all_cameras
            start_all_cameras()

            from core.system_controller import start_system
            #pass
            start_system()