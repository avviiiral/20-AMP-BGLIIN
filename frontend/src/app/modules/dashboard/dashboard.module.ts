import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { LayoutModule } from 'src/app/layout/layout.module';
import { PersonDataComponent } from './person-data/person-data.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CoreModule } from 'src/app/core/core.module';
import { StationComponent } from '../station/station.component';
import { CameraDetailComponent } from './camera-detail/camera-detail.component';

@NgModule({
  declarations: [
    DashboardComponent,
    PersonDataComponent,
    StationComponent,
    CameraDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    DashboardRoutingModule,
    LayoutModule,
    NgApexchartsModule,
    CoreModule
  ]
})
export class DashboardModule { }