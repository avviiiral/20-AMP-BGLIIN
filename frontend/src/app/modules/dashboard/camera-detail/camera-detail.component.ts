import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CameraDetailsService } from './camera-detail.service';

@Component({
  selector: 'app-camera-detail',
  templateUrl: './camera-detail.component.html',
  styleUrls: ['./camera-detail.component.scss']
})
export class CameraDetailComponent implements OnInit {

  // ================= BASIC =================
  cameraId!: string;

  data: any;

  // ================= CHART =================
  chartLabels: string[] = [];

  chartData: {
    value: number;
    height: number;
  }[] = [];

  maxValue = 1;

  targetPerHour = 0;

  chartHeight = 220;

  yAxisValues: number[] = [];

  // ================= MONTH =================
  today = new Date();

  selectedMonth =
    this.today.getMonth() + 1;

  selectedYear =
    this.today.getFullYear();

  monthName = '';

  calendarDays: number[] = [];

  monthlyData: any[] = [];

  // ================= DATE =================
  selectedDate = '';

  selectedDayData: any = null;

  constructor(
    private route: ActivatedRoute,
    private service: CameraDetailsService
  ) {}

  // ================= INIT =================
  ngOnInit(): void {

    this.cameraId =
      this.route.snapshot.paramMap.get('id')!;

    this.selectedDate =
      this.route.snapshot.queryParamMap.get('date') || '';

    this.setMonthName();

    this.generateCalendar();

    this.loadMonthlyData();

    if (this.selectedDate) {

      this.loadSelectedDay();

    } else {

      this.loadCameraDetails();

    }

  }

  // ================= LOAD CAMERA DETAILS =================
  loadCameraDetails() {

    this.service
      .getCameraDetails(this.cameraId)
      .subscribe({

        next: (res: any) => {

          this.data = res;

          this.prepareChart(
            res.hourly_output,
            res.target_per_hour,
            'time',
            'output'
          );

        },

        error: (err) => {

          console.error(
            'Camera details failed:',
            err
          );

        }

      });

  }

  // ================= LOAD SELECTED DAY =================
  loadSelectedDay() {

    this.service
      .getDayData(
        this.cameraId,
        this.selectedDate
      )
      .subscribe({

        next: (res: any) => {

          this.selectedDayData = res;

          this.data = {
            ...this.data,
            name: res.name,
            efficiency: res.efficiency,
            output: res.total_output,
            target_per_hour:
              res.hourly?.[0]?.target || 0,
            date: res.date
          };

          this.prepareChart(
            res.hourly,
            res.hourly?.[0]?.target || 0,
            'hour',
            'count'
          );

        },

        error: (err) => {

          console.error(
            'Day details failed:',
            err
          );

        }

      });

  }

  // ================= PREPARE CHART =================
  prepareChart(
    source: any[],
    target: number,
    labelKey: string,
    valueKey: string
  ) {

    this.chartLabels =
      source.map(x => x[labelKey]);

    const rawData =
      source.map(x => x[valueKey]);

    this.targetPerHour = target;

    this.maxValue = Math.max(
      ...rawData,
      target,
      1
    );

    this.maxValue =
      Math.ceil(this.maxValue / 20) * 20;

    this.yAxisValues = [];

    for (
      let i = 0;
      i <= this.maxValue;
      i += 20
    ) {

      this.yAxisValues.push(i);

    }

    this.chartData =
      rawData.map((val: number) => ({

        value: val,

        height:
          (val / this.maxValue) *
          this.chartHeight

      }));

  }

  // ================= MONTH NAME =================
  setMonthName() {

    const date = new Date(
      this.selectedYear,
      this.selectedMonth - 1
    );

    this.monthName =
      date.toLocaleString(
        'default',
        {
          month: 'long'
        }
      );

  }

  // ================= GENERATE CALENDAR =================
  generateCalendar() {

    const days = new Date(
      this.selectedYear,
      this.selectedMonth,
      0
    ).getDate();

    this.calendarDays = Array.from(
      { length: days },
      (_, i) => i + 1
    );

  }

  // ================= LOAD MONTHLY DATA =================
  loadMonthlyData() {

    this.service
      .getMonthlyHistory(
        this.cameraId,
        this.selectedYear,
        this.selectedMonth
      )
      .subscribe({

        next: (res) => {

          this.monthlyData = res;

        },

        error: (err) => {

          console.error(
            'Monthly history failed:',
            err
          );

          this.monthlyData = [];

        }

      });

  }

  // ================= GET MONTH DAY =================
  getMonthDay(day: number) {

    return this.monthlyData.find(
      x => x.day === day
    );

  }

  // ================= GET COLOR =================
  getColor(status: string): string {

    if (status === 'green') {
      return '#16a34a';
    }

    if (status === 'yellow') {
      return '#ca8a04';
    }

    return '#dc2626';

  }

  // ================= DAY CLICK =================
  onDateClick(day: number) {

    const formattedDay =
      day.toString().padStart(2, '0');

    this.selectedDate =
      `${this.selectedYear}-${this.selectedMonth
        .toString()
        .padStart(2, '0')}-${formattedDay}`;

    this.loadSelectedDay();

  }

}