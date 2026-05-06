import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[appFlipVertical]'
})
export class FlipVerticalDirective implements AfterViewInit {

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {

    const head = this.el.nativeElement.querySelector('.dashboard-head');
    const sub = this.el.nativeElement.querySelector('.dashboard-sub');

    const tl = gsap.timeline({ delay: 0.2 });

    tl.from(head, {
      rotateX: -90,
      opacity: 0,
      duration: 1,
      transformOrigin: "top center",
      ease: "power4.out"
    })

    .from(sub, {
      rotateX: -60,
      opacity: 0,
      duration: 0.8,
      transformOrigin: "top center",
      ease: "power3.out"
    }, "-=0.5");

  }
}