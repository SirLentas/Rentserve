import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-stays',
  templateUrl: './stays.component.html',
  styleUrls: ['./stays.component.scss']
})
export class StaysComponent implements OnInit {

  @ViewChild('reviewform', { static: false }) reviewForm: NgForm;

  dataRev: Array<any>
  dataNotRev: Array<any>
  house_id: Number
  message: String

  constructor(
    private http: HttpClient,
    private router: Router,
    private ref: ChangeDetectorRef
  ) { this.dataRev = new Array<any>(); this.dataNotRev = new Array<any>() }

  setHouseId(id) {
    this.house_id = id;
    (this.house_id);
  }

  navToHouse(id){
    const url='houses/'+id;
    this.router.navigate([url]);
  }

  onReview() {
    const rating = this.reviewForm.value.rating;
    const comment = this.reviewForm.value.comment;
    if (!rating) {
      this.message = 'Rate the home first'
    } else if (!comment) {
      this.message = 'Tell us a bit more...'
    } else {
      const headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded ' });
      const body = `house_id=${this.house_id}&grade=${rating}&comment=${comment}`
      this.http.post<any>('https://localhost:3000/users/profile/my-stays/review', body, { headers: headers }).subscribe(
        () => {
          window.location.reload();
        })
    }
  }

  ngOnInit(): void {
    this.http.get<any>('https://localhost:3000/users/profile/my-stays').subscribe(
      (response) => {
        this.dataRev = response.reviewed;
        this.dataNotRev = response.not_reviewed;
        this.ref.markForCheck();
      },
      () => {
        ('HTTP request done');
      }
    );
  }

}
