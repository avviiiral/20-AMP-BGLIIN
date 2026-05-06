import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { MainLayoutComponentComponent } from './main-layout-component/main-layout-component.component';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { share } from 'rxjs';
import { SharedModule } from '../shared/shared.module';
 

@NgModule({
  declarations: [ 
    MainLayoutComponentComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [ 
    MainLayoutComponentComponent

  ]
})
export class LayoutModule { }