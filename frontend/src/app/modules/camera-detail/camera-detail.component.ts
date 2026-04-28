import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

cameraId: string = '';
dashboardData: any;

constructor(private route: ActivatedRoute, private http: HttpClient) {}

ngOnInit() {
  this.cameraId = this.route.snapshot.paramMap.get('id') || '';
  this.loadData();
}

loadData() {
  this.http.get(`http://127.0.0.1:8000/api/camera/${this.cameraId}`)
    .subscribe((res: any) => {
      this.dashboardData = res;
    });
}