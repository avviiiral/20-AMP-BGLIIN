import csv
from django.http import JsonResponse
from pathlib import Path

def production_data(request):
    file_path = Path("backend/production_hourly.csv")

    data = []

    with open(file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data.append(row)

    return JsonResponse(data, safe=False)