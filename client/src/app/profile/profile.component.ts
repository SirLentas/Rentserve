import { Component, OnInit, ChangeDetectorRef,ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @ViewChild('updateform', { static: false }) updateForm: NgForm;


  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private ref: ChangeDetectorRef
  ) { }

  username: String
  email: String
  uploadForm: FormGroup
  route: String
  message: String
  pass_message: String
  app_message: String
  host: Boolean

  onPicUpdate() {
    if (!this.uploadForm.get('file').value) {
      this.message = 'Select a photo first';
    }
    const headers = new HttpHeaders();
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('file').value);

    const up = this.http.post<any>('https://localhost:3000/users/profile/update-pic', formData, { headers: headers }).subscribe(
      (error) => {
        if (error.status === 497 || error.status === 500) {
          this.message = 'Error updating your photo';
        }
        // console.log(error.error)
      }, () => { up.unsubscribe() }
    )
  }

  onPasswordUpdate() {
    const old_password=this.updateForm.value.password;
    const password1=this.updateForm.value.password1;
    const password2=this.updateForm.value.password2;
    if(!password1 || !password2 || !old_password){
      this.pass_message="All fields are Required"
    }else{
      const headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded ' });
      let body='old_password='+old_password+'&password1='+password1+'&password2='+password2;
      this.http.post<any>('https://localhost:3000/users/update-password',body, { headers: headers }).subscribe(
        (response)=>{
          this.router.navigate(['users/logout'])
        },
        (error)=>{
          console.log(error)
          if(error.status===499){
            this.message=error.error;
            this.ref.markForCheck();
          }
        }
      );
    }
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('file').setValue(file);
    }
  }

  onApplyHost() {
    const headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded ' });
    this.http.post<any>('https://localhost:3000/users/profile/host_appl', { headers: headers }).subscribe(
      () => {this.app_message='Application successful'
      this.ref.markForCheck();}
    );
  }

  ngOnInit(): void {
    const log = localStorage.getItem('isLoggedIn');
    if (log == null) {
      this.router.navigate(['users/login'])
    }

    this.uploadForm = this.formBuilder.group({
      file: ['']
    });
    this.http.get<any>('https://localhost:3000/users/profile').subscribe(
      (response) => {
        console.log(response);
        this.username = response.user.username;
        this.host= response.user.is_host;
        this.email = response.user.email;
        this.route = "../../assets/public/profile_pics/" + response.user.profile_pic;
      },
      (error) => {
        this.router.navigate(['users/login']);
        console.log(error);
      },
      () => {
        this.ref.markForCheck();
        console.log('HTTP request done');
      }
    );
  }
}

