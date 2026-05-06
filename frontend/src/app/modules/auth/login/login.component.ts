import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email: string = '';
  password: any = '';
  errorMessage = '';



  ngOnInit(){
    if (localStorage.getItem('isLoggedIn') === 'true') {
  this.router.navigate(['/dashboard']);
}
  }

  constructor(private router: Router) {}

  login() {
    const demoEmail = 'bagla@gmail.com';
    const demoPassword = 'bagla@123';

    if (this.email === demoEmail && this.password === demoPassword) {

      // ✅ Store login state
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', this.email);

      // ✅ Redirect
      this.router.navigate(['/dashboard']);

    } else {
      this.errorMessage = 'Invalid credentials';
      alert("wrong password")
    }
  }
}