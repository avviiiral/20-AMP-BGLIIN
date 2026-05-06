import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapModalDirective } from './directives/gsap-modal.directive';
import { GsapCardUpDirective } from './directives/gsap-card-up.directive';
import { FlipVerticalDirective } from './directives/gsap-heading.directive';

@NgModule({
  declarations: [
    GsapModalDirective,
    GsapCardUpDirective,
    FlipVerticalDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GsapModalDirective,
    GsapCardUpDirective,
    FlipVerticalDirective
  ]
})
export class CoreModule {}