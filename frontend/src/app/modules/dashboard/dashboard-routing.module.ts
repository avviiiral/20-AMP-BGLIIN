import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { PersonDataComponent } from './person-data/person-data.component';
import { StationComponent } from '../station/station.component';
import { CameraDetailComponent } from './camera-detail/camera-detail.component';

const routes: Routes = [
  {
    path: 'camera/:id',
    component: CameraDetailComponent
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
    path: '',
    component: DashboardComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}