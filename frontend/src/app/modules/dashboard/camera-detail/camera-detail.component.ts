import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CameraDetailsService } from './camera-detail.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-camera-detail',
  templateUrl: './camera-detail.component.html',
  styleUrls: ['./camera-detail.component.scss']
})
export class CameraDetailComponent implements OnInit {

  cameraId!: string;
  data: any;

  chartLabels: string[] = [];
  chartData: number[] = [];
  maxValue = 1;
  targetPerHour = 0;

  // 🔹 CALENDAR STATE
  calendarDays: number[] = [];
  selectedDate: string = '';
  calendarData: any = null;
  calendarLoading = false;
  calendarError = '';

  constructor(
    private route: ActivatedRoute,
    private service: CameraDetailsService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cameraId = this.route.snapshot.paramMap.get('id')!;
    this.loadData();
    this.generateCalendar();
  }

  loadData() {
    this.service.getCameraDetails(this.cameraId).subscribe((res: any) => {
      this.data = res;

      this.chartLabels = res.hourly_output.map((x: any) => x.time);
      this.chartData = res.hourly_output.map((x: any) => x.output);

      this.maxValue = Math.max(...this.chartData, 1);
      this.targetPerHour = Math.round(res.target / this.chartData.length);
    });
  }

  // 🔹 CALENDAR
  generateCalendar() {
    this.calendarDays = Array.from({ length: 28 }, (_, i) => i + 1);
  }

  onDateClick(day: number) {
    const month = '02';
    const year = '2026';

    const formattedDay = day.toString().padStart(2, '0');
    this.selectedDate = `${year}-${month}-${formattedDay}`;

    this.fetchCalendarData();
  }

  fetchCalendarData() {
    this.calendarLoading = true;
    this.calendarData = null;
    this.calendarError = '';

    const url = `http://127.0.0.1:8000/camera/${this.cameraId}/calendar/?date=${this.selectedDate}`;

    this.http.get(url).subscribe({
      next: (res: any) => {
        this.calendarLoading = false;

        if (!res || (Array.isArray(res) && res.length === 0)) {
          this.calendarError = 'Data not found';
        } else {
          this.calendarData = res;
        }
      },
      error: () => {
        this.calendarLoading = false;
        this.calendarError = 'Data not found';
      }
    });
  }
}