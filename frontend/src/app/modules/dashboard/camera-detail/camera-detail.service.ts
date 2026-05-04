import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CameraDetailsService {

  BASE_URL = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getCameraDetails(cameraId: string) {
    return this.http.get(`${this.BASE_URL}/camera/${cameraId}/`);
  }
}