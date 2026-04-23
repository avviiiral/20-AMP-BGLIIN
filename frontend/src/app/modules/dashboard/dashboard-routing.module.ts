import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { PersonDataComponent } from './person-data/person-data.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent

  },
  {
    path: 'person-data',
    component: PersonDataComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
