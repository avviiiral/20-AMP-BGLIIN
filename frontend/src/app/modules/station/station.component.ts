import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss']
})
export class StationComponent implements OnInit {

  cameraId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.cameraId = this.route.snapshot.paramMap.get('id')!;
    console.log('Selected Camera:', this.cameraId);
  }
}