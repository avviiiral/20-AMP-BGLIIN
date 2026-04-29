from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings

from core.target_loader import TARGETS

import pandas as pd
import os


# ===================== CONFIG =====================

CSV_PATH = os.path.join(settings.BASE_DIR, "production_hourly.csv")

COLUMN_TO_CAMERA = {
    "AIR WASHING": "cam1",
    "MIDDLE TESTING": "cam2",
    "COIL SOLDERING": "cam3",
    "FRAME CRIMPING": "cam4",
    "COMMON CRIMPING": "cam5",
    "WIRE ROUTING": "cam6",
    "BASE ASSEMBLY": "cam7",
    "M SPRING RIVETTING": "cam8",
    "CORE RIVETTING": "cam9",
    "BOBBIN PRESSING": "cam10"
}


# ===================== UTIL =====================

def load_csv():
    if not os.path.exists(CSV_PATH):
        return None

    df = pd.read_csv(CSV_PATH, low_memory=False)

    df.columns = [c.strip() for c in df.columns]

    if "Date" not in df.columns or "Time Slot" not in df.columns:
        return None

    # Convert Date properly
    df["Date"] = pd.to_datetime(df["Date"])

    # Sort for correct latest row
    df = df.sort_values(by=["Date", "Time Slot"])

    return df


def get_column_from_camera(camera_id):
    for col, cam in COLUMN_TO_CAMERA.items():
        if cam == camera_id:
            return col
    return None


# ===================== DASHBOARD =====================

@api_view(['GET'])
def dashboard_summary(request):
    df = load_csv()

    if df is None:
        return Response({"error": "CSV not found"}, status=404)

    production_df = df.iloc[:, 2:]

    total_output = production_df.sum().sum()
    total_hours = len(df)

    total_target = sum(TARGETS.values()) * total_hours

    station_totals = production_df.sum()

    active_stations = int((station_totals > 0).sum())
    total_stations = len(station_totals)

    efficiency = (total_output / total_target * 100) if total_target > 0 else 0

    return Response({
        "efficiency": round(efficiency, 1),
        "produced": int(total_output),
        "target": int(total_target),
        "active_stations": active_stations,
        "total_stations": total_stations,
        "status": "All systems operational" if active_stations == total_stations else "Some stations idle"
    })


# ===================== STATIONS =====================

@api_view(['GET'])
def stations(request):
    df = load_csv()

    if df is None:
        return Response({"error": "CSV not found"}, status=404)

    production_df = df.iloc[:, 2:]
    station_totals = production_df.sum()

    latest_row = df.iloc[-1]
    total_hours = len(df)

    result = []

    for column_name, total in station_totals.items():
        cam_id = COLUMN_TO_CAMERA.get(column_name)

        if not cam_id:
            continue

        target_per_hour = TARGETS.get(cam_id, 0)
        target_total = target_per_hour * total_hours

        efficiency = (total / target_total * 100) if target_total > 0 else 0

        latest_output = int(latest_row[column_name])

        result.append({
            "camera_id": cam_id,
            "name": column_name,
            "output": int(total),
            "target": target_total,
            "efficiency": round(efficiency, 1),
            "status": "active" if total > 0 else "idle",
            "latest_output": latest_output,
            "is_live": True
        })

    return Response(result)


# ===================== CAMERA DETAIL =====================

@api_view(['GET'])
def camera_detail(request, camera_id):
    df = load_csv()

    if df is None:
        return Response({"error": "CSV not found"}, status=404)

    column = get_column_from_camera(camera_id)

    if not column or column not in df.columns:
        return Response({"error": "Invalid camera"}, status=404)

    # DATE FILTER
    selected_date = request.GET.get("date")

    if selected_date:
        selected_date = pd.to_datetime(selected_date)
        df_filtered = df[df["Date"] == selected_date]
    else:
        df_filtered = df[df["Date"] == df["Date"].max()]

    if df_filtered.empty:
        return Response({"error": "No data for selected date"}, status=404)

    target_per_hour = TARGETS.get(camera_id, 0)

    total_output = int(df_filtered[column].sum())
    hours = len(df_filtered)

    total_target = target_per_hour * hours
    efficiency = (total_output / total_target * 100) if total_target > 0 else 0

    hourly_output = [
        {
            "time": row["Time Slot"],
            "output": int(row[column])
        }
        for _, row in df_filtered.iterrows()
    ]

    pph = (total_output / hours) if hours > 0 else 0
    avg_cycle_time = (3600 / pph) if pph > 0 else 0

    expected = target_per_hour * hours
    pieces_ahead = total_output - expected

    return Response({
        "camera_id": camera_id,
        "name": column,
        "date": str(df_filtered["Date"].iloc[0].date()),

        "output": total_output,
        "target": total_target,
        "efficiency": round(efficiency, 1),

        "hourly_output": hourly_output,

        "pph": round(pph, 1),
        "avg_cycle_time": round(avg_cycle_time, 2),
        "pieces_ahead": int(pieces_ahead)
    })


# ===================== CALENDAR =====================

@api_view(['GET'])
def camera_calendar(request, camera_id):
    df = load_csv()

    if df is None:
        return Response({"error": "CSV not found"}, status=404)

    column = get_column_from_camera(camera_id)

    if not column:
        return Response({"error": "Invalid camera"}, status=404)

    grouped = df.groupby("Date")
    target_per_hour = TARGETS.get(camera_id, 0)

    result = []

    for date, group in grouped:
        output = group[column].sum()
        hours = len(group)
        target = target_per_hour * hours

        efficiency = (output / target * 100) if target > 0 else 0

        if efficiency >= 80:
            status = "good"
        elif efficiency >= 60:
            status = "average"
        else:
            status = "poor"

        result.append({
            "date": str(date.date()),
            "output": int(output),
            "efficiency": round(efficiency, 1),
            "status": status
        })

    result = sorted(result, key=lambda x: x["date"])

    return Response(result)


# ===================== HISTORY =====================

@api_view(['GET'])
def camera_history(request, camera_id):
    df = load_csv()

    if df is None:
        return Response({"error": "CSV not found"}, status=404)

    column = get_column_from_camera(camera_id)

    if not column:
        return Response({"error": "Invalid camera"}, status=404)

    history = []

    for _, row in df.iterrows():
        history.append({
            "time": f"{row['Date'].date()} {row['Time Slot']}",
            "output": int(row[column])
        })

    return Response(history)