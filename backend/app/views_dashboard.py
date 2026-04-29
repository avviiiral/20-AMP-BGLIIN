import csv
from django.http import JsonResponse
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

def get_production_data(request):
    file_path = BASE_DIR / "production_hourly.csv"

    data = []
    with open(file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data.append(row)

    return JsonResponse(data, safe=False)