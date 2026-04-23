import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private readonly router: Router) {}

  nowTime = '01:51:57 PM';
  nowDate = 'Wednesday, Mar 04 2026';

  confirmLogout(): void {
    this.router.navigate(['/auth/login']);
  }
}
