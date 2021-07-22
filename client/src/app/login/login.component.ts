import { Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('loginform', { static: false }) loginForm: NgForm;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) {}

  message: String

  onLoginSubmit() {
    const email = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    if (!email) {
      this.message = "Please give email";
    } else if (!password) {
      this.message = "Please give password";
    } else {
      const headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded' });

      let body = `email=${email}&password=${password}`;

      this.http.post<any>('https://localhost:3000/users/login', body, { headers: headers }).subscribe(

        // The response data
        (response) => {
          (response);
          this.authService.setLocalStorage(response);
          const qPar = this.route.queryParams.subscribe(params => {
            const id = params.id;
            const from = params.from;
            const to = params.to;
            const guests = params.guests;
            if (!id || !from || !to || !guests) {
              this.router.navigate([this.authService.findPath(response)]);
            } else {
              this.router.navigate(['houses/', id], { queryParams: { from: from, to: to, guests: guests } });
            }
          }, () => {
            qPar.unsubscribe();
          })
        },
        (error) => {
          (error.error);
          this.message=error.error;
          this.ref.markForCheck();
        }
      );
    }
  }

  ngOnInit() {
    const token = localStorage.getItem('isLoggedIn');
    if(token=='true'){
      this.router.navigate(['users/profile'])
    }
  }

}
