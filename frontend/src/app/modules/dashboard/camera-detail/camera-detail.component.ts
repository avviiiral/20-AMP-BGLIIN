import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CameraDetailsService } from './camera-detail.service';

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

  constructor(
    private route: ActivatedRoute,
    private service: CameraDetailsService
  ) {}

  ngOnInit(): void {
    this.cameraId = this.route.snapshot.paramMap.get('id')!;
    this.loadData();
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
}