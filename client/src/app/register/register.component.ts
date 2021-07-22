import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  @ViewChild('registerform', { static: false }) registerForm: NgForm;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private ref: ChangeDetectorRef
  ) { }

  message: String

  ngOnInit() {
    const token = localStorage.getItem('isLoggedIn');
    if (token == 'true') {
      this.router.navigate(['users/profile'])
    }
  }

  // Submits a post request to the /users/register route of our Express app
  onRegisterSubmit() {
    const name = this.registerForm.value.name;
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    const password2 = this.registerForm.value.password2;
    const phone = this.registerForm.value.phone;
    const hostApp = this.registerForm.value.HostApplication;

    if (!name) {
      this.message = "Please give name";
    } else if (!email) {
      this.message = "Please give email";
    } else if (!this.validateEmail(email)) {
      this.message = "Invalid email";
    } else if (!phone) {
      this.message = "Please give phone number";
    } else if (!this.validatePhone(phone)) {
      this.message = "Invalid Phone";
    } else if (!password) {
      this.message = "Please give password";
    } else if (!password2) {
      this.message = "Please give password confirmation";
    } else {
      const headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded ' });

      let body = `name=${name}&email=${email}&password=${password}&password2=${password2}&phone=${phone}&HostApplication=${hostApp}`;

      this.http.post('https://localhost:3000/users/register', body, { headers: headers }).subscribe(

        // The response data
        (response) => {
          (response);
          this.authService.setLocalStorage(response);
        },

        // If there is an error
        (error) => {
          (error);
          if (error.status === 499) {
            this.message = error.error;
            this.ref.markForCheck();
          }
        },

        // When observable completes
        () => {
          ('done!');
          this.router.navigate(['users/login']);
        }

      );
    }
  }


  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validatePhone(phone) {
    const re = /^\d{10}$/;
    return phone.match(re);
  }
}