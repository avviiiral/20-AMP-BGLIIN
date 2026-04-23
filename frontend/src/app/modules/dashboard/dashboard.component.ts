import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  // 🔥 GLOBAL METRICS FROM BACKEND
  metrics: any = {
    efficiency: 0,
    output: 0,
    target: 0,
    active_stations: 0,
    total_stations: 0,
    per_station: {}
  };

  // 🔥 STATIONS CONFIG (UI + STREAMS)
  stations: any[] = [
  {
    id: 'cam10',
    name: '10 – BOBBIN STOPPER PRESSING',
    target: 200,
    percent: '0%',
    status: '2',
    stream: 'http://127.0.0.1:8000/api/video_feed/cam10'
  },
  {
    id: 'cam9',
    name: '30 – CORE FRAME RIVETTING',
    target: 180,
    percent: '0%',
    status: '2',
    stream: 'http://127.0.0.1:8000/api/video_feed/cam9'
  },
  {
    id: 'cam8',
    name: '50 – FRAME & MSPRING ASS',
    target: 220,
    percent: '0%',
    status: '2',
    stream: 'http://127.0.0.1:8000/api/video_feed/cam8'
  },
  {
    id: 'cam7',
    name: '90 – FRAME & BASE ASS',
    target: 160,
    percent: '0%',
    status: '2',
    stream: 'http://127.0.0.1:8000/api/video_feed/cam7'
  }
  ];

  private intervalId: any;

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  // ==============================
  // INIT
  // ==============================
  ngOnInit(): void {
    this.loadMetrics();

    // 🔥 AUTO REFRESH EVERY 2s
    this.intervalId = setInterval(() => {
      this.loadMetrics();
    }, 2000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // ==============================
  // API CALL
  // ==============================
  loadMetrics(): void {
    this.dashboardService.getMetrics().subscribe({
      next: (res: any) => {
        this.metrics = res;
        this.updateStationData();
      },
      error: (err: any) => {
        console.error('Dashboard API error:', err);
      }
    });
  }

  // ==============================
  // UPDATE UI FROM BACKEND
  // ==============================
  updateStationData(): void {
  if (!this.metrics?.per_station) return;

  this.stations.forEach(station => {
    const count = this.metrics.per_station[station.id] || 0;
    const target = station.target || 1;

    // ✅ REAL EFFICIENCY
    const efficiency = (count / target) * 100;

    station.percent = efficiency.toFixed(1) + '%';

    // ✅ INDUSTRY COLOR LOGIC
    if (efficiency >= 80) {
      station.status = '0'; // green
    } else if (efficiency >= 70) {
      station.status = '1'; // yellow
    } else {
      station.status = '2'; // red
    }
    });
}

  // ==============================
  // NAVIGATION (NO routerLink ISSUE)
  // ==============================
  openStation(station: any): void {
    this.router.navigate(['/dashboard/station', station.id]);
  }
}