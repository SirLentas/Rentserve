import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  in: Array<any>
  out: Array<any>
  send_to: String
  about: String
  id: String

  constructor(
    private router: Router,
    private http: HttpClient,
    private ref: ChangeDetectorRef
  ) {
    this.in = new Array<any>(),
      this.out = new Array<any>()
  }


  @ViewChild('sendform', { static: false }) sendForm: NgForm;

  ngOnInit(): void {
    const log = localStorage.getItem('isLoggedIn');
    if (log == null) {
      this.router.navigate(['users/login'])
    } else {
      this.http.get<any>('https://localhost:3000/users/profile/my-messages').subscribe(
        (response) => {
          this.in = response.in;
          this.out = response.out;
          (this.in);
          (this.out);
          this.ref.markForCheck();
        }
      );
    }
  }

  onReply(id, about, username) {
    this.id = id;
    this.send_to = username;
    this.about = about;
    (this.id, this.send_to, this.about)
  }

  onSend() {
    const message = this.sendForm.value.message;
    const headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded ' });
    const body = `to=${this.id}&about=${this.about}&message=${message}`
    this.http.post<any>('https://localhost:3000/users/profile/my-messages/send', body, { headers: headers }).subscribe(
      () => {
        window.location.reload();
      })

  }

  onDelete(id){
    const headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded ' });
    const body = `id=${id}`
    this.http.post<any>('https://localhost:3000/users/profile/my-messages/delete', body, { headers: headers }).subscribe(
      () => {
        window.location.reload();
      })
  }
}
