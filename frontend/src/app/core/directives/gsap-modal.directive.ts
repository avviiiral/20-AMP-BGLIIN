import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import gsap from 'gsap';

@Directive({
  selector: '[appGsapModal]'
})
export class GsapModalDirective implements AfterViewInit {

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {

    const modal = this.el.nativeElement;

    modal.addEventListener('shown.bs.modal', () => {

      gsap.from(modal.querySelector('.modal-dialog'), {
        y: -80,
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        ease: 'power3.out'
      });

      gsap.from(modal.querySelectorAll('.modal-body > *'), {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        delay: 0.2,
        duration: 0.4
      });

    });

    modal.addEventListener('hide.bs.modal', () => {

      gsap.to(modal.querySelector('.modal-dialog'), {
        y: 80,
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.in'
      });

    });

  }

}