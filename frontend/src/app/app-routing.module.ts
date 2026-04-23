import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponentComponent } from './layout/main-layout-component/main-layout-component.component';

const routes: Routes = [
  // ================= DEFAULT =================
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // ================= AUTH (NO LAYOUT) =================
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule)
  },

  // ================= SUPER ADMIN =================
  // ================= SUPER ADMIN =================
  {
    path: '',
    component: MainLayoutComponentComponent,
    // canActivate: [RoleGuard],
    // data: { role: [Roles.SUPER_ADMIN] },
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module')
            .then(m => m.DashboardModule)
      },
       
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
