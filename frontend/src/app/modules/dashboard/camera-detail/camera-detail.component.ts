import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
selector: 'app-camera-detail',
templateUrl: './camera-detail.component.html',
styleUrls: ['./camera-detail.component.scss']
})
export class CameraDetailComponent implements OnInit {

cameraId: string = '';

constructor(private route: ActivatedRoute) {}

ngOnInit(): void {
// Get camera ID from URL
this.cameraId = this.route.snapshot.paramMap.get('id') || '';

```
console.log('Camera ID:', this.cameraId);
```

}

}
