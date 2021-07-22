import { Component, OnInit, ChangeDetectorRef,ChangeDetectionStrategy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination'

@Component({
  selector: 'app-protected-component',
  templateUrl: './protected-component.component.html',
  styleUrls: ['./protected-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProtectedComponentComponent implements OnInit{

  data: Array<any>
  u_message: String
  h_message: String
  totalRecords: String
  page: Number = 1

  constructor(private http: HttpClient,
    private ref: ChangeDetectorRef) { this.data = new Array<any>() }


  ngOnInit() {
    this.http.get<any>('https://localhost:3000/users/admin_page').subscribe(
      (response) => {
        this.data = response.applications;
        this.totalRecords=response.applications.length;
        this.ref.markForCheck();
      }
    );
  }

  onHouses(){
    const headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded ' });
    this.http.get<any>('https://localhost:3000/users//admin_page/print_houses',{ headers: headers }).subscribe(
      () => {
        this.h_message='Files exported successfully'
        this.ref.markForCheck();
      }
    );
  }

  onUserReviews(id) {
    const headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded ' });
    this.http.get<any>('https://localhost:3000/users//admin_page/print_users_rev/'+id,{ headers: headers }).subscribe(
      () => {
        this.u_message='Files exported successfully'
        this.ref.markForCheck();
      }
    );
  }

  onUserReservations(id) {
    const headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded ' });
    this.http.get<any>('https://localhost:3000/users//admin_page/print_users_res/'+id,{ headers: headers }).subscribe(
      () => {
        this.u_message='Files exported successfully'
        this.ref.markForCheck();
      }
    );
  }

  onHostReviews(id) {
    const headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded ' });
    this.http.get<any>('https://localhost:3000/users//admin_page/print_hosts_rev/'+id,{ headers: headers }).subscribe(
      () => {
        this.u_message='Files exported successfully'
        this.ref.markForCheck();
      }
    );
  }


  onAccept(id) {
    const headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded ' });
    const body=`id=${id}`;
    this.http.post<any>('https://localhost:3000/users/admin_page/accept',body, { headers: headers }).subscribe(
      () => {
        window.location.reload();
      }
    );
  }

  onReject(id) {
    const headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded ' });
    const body=`id=${id}`;
    this.http.post<any>('https://localhost:3000/users/admin_page/reject',body, { headers: headers }).subscribe(
      () => {
        window.location.reload();
      }
    );
  }

}
