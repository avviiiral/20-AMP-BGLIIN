import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponentComponent } from './layout/main-layout-component/main-layout-component.component';
import { CameraDetailComponent } from './modules/camera-detail/camera-detail.component';

const routes: Routes = [

  // ================= DEFAULT =================
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // ================= AUTH =================
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule)
  },

  // ================= MAIN LAYOUT =================
  {
    path: '',
    component: MainLayoutComponentComponent,
    children: [

      // Dashboard (lazy loaded)
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module')
            .then(m => m.DashboardModule)
      },

      // ✅ ADD THIS
      {
        path: 'camera/:id',
        component: CameraDetailComponent
      }

    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 