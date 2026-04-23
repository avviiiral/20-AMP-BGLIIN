import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  stations = [
  {
    name: '10 – BOBBIN STOPPER PRESSING',
    percent: '128.1%',
    status: '0',
    stream: 'http://127.0.0.1:8000/api/video_feed/cam1'
  },
  {
    name: '30 – CORE FRAME RIVETTING',
    percent: '84.4%',
    status: '1',
    stream: 'http://127.0.0.1:8000/api/video_feed/cam2'
  },
  {
    name: '50 – FRAME & MSPRING ASS',
    percent: '109.3%',
    status: '0',
    stream: 'http://127.0.0.1:8000/api/video_feed/cam3'
  },
  {
    name: '90 – FRAME & BASE ASS',
    percent: '65.2%',
    status: '2',
    stream: 'http://127.0.0.1:8000/api/video_feed/cam4'
  }
];
}
