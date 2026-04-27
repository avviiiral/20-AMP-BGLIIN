import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.scss']
})
export class CameraDetailComponent implements OnInit {

  stationId: string = '';
  data: any = {};
  loading = true;
  activeTab: 'efficiency' | 'clips' | 'monthly' = 'efficiency';

  // ApexCharts options
  efficiencyGauge: any;
  hourlyBar: any;
  idleDonut: any;
  dailyBar: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.stationId = this.route.snapshot.paramMap.get('id') || 'cam10';
    this.loadData();
  }

  loadData() {
    this.api.getStationDashboard(this.stationId).subscribe({
      next: (res: any) => {
        this.data = res;
        this.loading = false;
        this.initCharts();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  initCharts() {
    // 1. Today's Output Gauge
    this.efficiencyGauge = {
      series: [this.data.efficiency || 0],
      chart: { type: 'radialBar', height: 240, sparkline: { enabled: true } },
      plotOptions: {
        radialBar: {
          hollow: { size: '68%' },
          dataLabels: {
            name: { show: false },
            value: { fontSize: '32px', fontWeight: 700, color: '#22c55e' }
          }
        }
      },
      colors: ['#22c55e']
    };

    // 2. Hourly Output Bar
    const hourly = this.data.hourly_output || [];
    this.hourlyBar = {
      series: [{ name: 'Output', data: hourly.map((h: any) => h.value) }],
      chart: { type: 'bar', height: 220, toolbar: { show: false } },
      colors: ['#22c55e'],
      xaxis: { categories: hourly.map((h: any) => h.time) },
      plotOptions: { bar: { columnWidth: '60%' } },
      annotations: {
        yaxis: [{ y: this.data.target || 400, borderColor: '#f59e0b', label: { text: 'Target' } }]
      }
    };

    // 3. Idle Time Donut
    const idle = this.data.idle_breakdown || { absent: 73, operator_idle: 27 };
    this.idleDonut = {
      series: [idle.absent, idle.operator_idle],
      chart: { type: 'donut', height: 200 },
      colors: ['#ef4444', '#a855f7'],
      labels: ['Operator absent', 'Operator idle'],
      plotOptions: { pie: { donut: { size: '72%' } } }
    };

    // 4. Daily Output Bar (Monthly)
    const daily = this.data.monthly?.daily_output || [];
    this.dailyBar = {
      series: [{ name: 'Daily Output', data: daily }],
      chart: { type: 'bar', height: 200, toolbar: { show: false } },
      colors: ['#ef4444'],
      xaxis: { categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'] }
    };
  }

  setTab(tab: 'efficiency' | 'clips' | 'monthly') {
    this.activeTab = tab;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}