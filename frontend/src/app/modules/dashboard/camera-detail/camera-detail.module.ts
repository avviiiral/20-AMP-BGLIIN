import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraDetailsComponent } from './camera-details.component';

@NgModule({
  declarations: [CameraDetailsComponent],
  imports: [CommonModule],
  exports: [CameraDetailsComponent]
})
export class CameraDetailsModule {}