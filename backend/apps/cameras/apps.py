import os
from django.apps import AppConfig


class CamerasConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.cameras'

    def ready(self):
        # 🔥 Prevent double start (VERY IMPORTANT)
        if os.environ.get('RUN_MAIN') != 'true':
            return

        from core.system_controller import start_system
        start_system()