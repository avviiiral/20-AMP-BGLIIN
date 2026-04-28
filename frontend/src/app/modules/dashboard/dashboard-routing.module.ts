import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { PersonDataComponent } from './person-data/person-data.component';
import { StationComponent } from '../station/station.component';
import { CameraDetailComponent } from './camera-detail/camera-detail.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'person-data',
    component: PersonDataComponent
  },
  {
    path: 'station/:id',
    component: StationComponent
  },
  {
    path: 'camera/:id',
    component: CameraDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}