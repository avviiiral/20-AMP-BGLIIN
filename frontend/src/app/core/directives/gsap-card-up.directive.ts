import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[appGsapCardUp]'
})
export class GsapCardUpDirective implements AfterViewInit {

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {

    gsap.from(this.el.nativeElement, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });

  }

}