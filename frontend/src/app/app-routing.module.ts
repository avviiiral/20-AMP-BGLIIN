import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponentComponent } from './layout/main-layout-component/main-layout-component.component';
import { CameraDashboardComponent } from './pages/camera-dashboard/camera-dashboard.component';
import { PersonDataComponent } from './modules/dashboard/person-data/person-data.component'; 
import { AuthGuard } from './core/gaurd/auth.guard';

const routes: Routes = [

  // 🔹 Default redirect
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // 🔹 Auth Module (Login, etc.)
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule)
  },

  // 🔹 Protected Layout
  {
    path: '',
    component: MainLayoutComponentComponent,
    canActivate: [AuthGuard],   // ✅ protect all children
    children: [

      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module')
            .then(m => m.DashboardModule)
      },

      {
        path: 'camera',
        component: CameraDashboardComponent
      },

      {
        path: 'bgliin',
        component: PersonDataComponent
      }

    ]
  },

  // 🔹 Fallback
  { path: '**', redirectTo: 'auth/login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}