import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss']
})
export class HostComponent implements OnInit {

  data: Array<any>

  constructor(
    private http: HttpClient,
    private router: Router,
    private ref: ChangeDetectorRef
  ) { this.data =new Array<any>()}

  navTo(id){
    const url='houses/'+id
    this.router.navigate([url]);
  }

  navToEdit(id){
    const url='users/host-page/edit-listing'
    this.router.navigate([url],{state:{id:id}});
  }

  ngOnInit(): void {
    this.http.get<any>('https://localhost:3000/users/host_page').subscribe(
      (response) => {
        this.data=response.houses;
        (this.data);
        this.ref.markForCheck();
      },
      (error) => {
        (error);
        if (error.status === 401) {
          this.router.navigate(['users/login']);
        }
        if (error.status === 498) {
          this.router.navigate(['users/profile']);
        }
      },
      () => {
        ('HTTP request done');
      }
    );
  }

}
