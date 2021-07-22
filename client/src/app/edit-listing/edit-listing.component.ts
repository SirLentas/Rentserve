import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, NgForm } from '@angular/forms';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-edit-listing',
  templateUrl: './edit-listing.component.html',
  styleUrls: ['./edit-listing.component.scss']
})
export class EditListingComponent implements OnInit {

  @ViewChild('editform', { static: false }) editForm: NgForm;

  id: Number;
  name: String
  message: String;
  formData: FormData;
  uploadForm: FormGroup;
  cost: Number
  capacity: Number;
  minDays: Number;
  info: String;
  desc: String;
  files: string[] = [];
  today: String;
  today1: String

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef) {
    this.id = this.router.getCurrentNavigation().extras.state.id
  }

  onEditListing() {
    const headers = new HttpHeaders();
    const formData = new FormData();

    let min_days = this.editForm.value.min_days;
    if (!min_days) {
      min_days = this.minDays;
    }
    const a_from = this.editForm.value.a_from;
    const a_to = this.editForm.value.a_to;
    let guests = this.editForm.value.guests;
    if (!guests) {
      guests = this.capacity;
    }
    let cost = this.editForm.value.cost;
    if (!cost) {
      cost = this.cost;
    }
    let des = this.editForm.value.des;
    if (!des) {
      des = this.desc;
    }
    let info = this.editForm.value.info;
    if (!info) {
      info = this.info;
    }
    const wifi = this.editForm.value.wifi;
    const oven = this.editForm.value.oven;
    const heating = this.editForm.value.heating;
    const cooling = this.editForm.value.cooling;
    const tv = this.editForm.value.tv;
    const parking = this.editForm.value.parking;
    const elevator = this.editForm.value.elevator;

    if (!min_days) {
      this.message = 'Set the minimun number of days for a reservation';
    } else if (!a_from || !a_to) {
      this.message = 'Select the dates when your house is available ';
    } else if (!guests) {
      this.message = "Type your house's capacity";
    } else if (!cost) {
      this.message = 'Set the cost per night';
    } else if (!des) {
      this.message = 'Add a description for your house';
    } else if (!info) {
      this.message = 'Add more info for your house';
    } else if (this.files.length > 10) {
      this.message = 'Too many files selected (max 10)';
      this.files = [];
    } else if (this.files.length < 3) {
      this.message = 'Select at least 3 photos';
    } else {

      for (var i = 0; i < this.files.length; i++) {
        formData.append('multi-files', this.files[i]);
      }

      const up = this.http.post<any>('https://localhost:3000/houses/add-listing/photos', formData, { headers: headers }).subscribe(
        (response) => {
          (response.jsonIm)
          const images = response.jsonIm;

          const headers_2 = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded ' });

          let body = `capacity=${guests}&a_from=${a_from}&a_to=${a_to}&name=${name}&cost=${cost}&des=${des}&info=${info}
                      &min_days=${min_days}&images=${images}&id=${this.id}&wifi=${wifi}&tv=${tv}&oven=${oven}
                      &heating=${heating}&cooling=${cooling}&parking=${parking}&elevator=${elevator}`;

          const add = this.http.post('https://localhost:3000/houses/edit-listing', body, { headers: headers_2 }).subscribe(
            () => {
              this.router.navigate(['users/host-page'])
              add.unsubscribe();
            });
        },
        () => { up.unsubscribe() })
    }
  }

  onFileSelect(event) {
    this.files = []
    for (var i = 0; i < event.target.files.length; i++) {
      this.files.push(event.target.files[i]);
    }
    (this.files)
  }

  ngOnInit(): void {
    this.Min_Date();
    this.Min_outDate();

    (this.id);
    const url2 = 'https://localhost:3000/houses/' + this.id;

    const house_data = this.http.get<any>(url2)
      .subscribe(
        (response) => {
          (response)
          this.name = response.house.house_name;
          this.cost = response.house.cost;
          this.capacity = response.house.capacity
          this.minDays = response.house.min_days;
          this.desc = response.house.description;
          this.info = response.house.extra_info;
          this.ref.markForCheck();
        }, () => { () => { house_data.unsubscribe() } }
      )
    this.ref.markForCheck()
  }

  Min_Date() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10 && mm < 0) {
      this.today = yyyy + '-0' + mm + '-0' + dd;
    } else if (mm < 10) {
      this.today = yyyy + '-0' + mm + '-' + dd;
    } else if (dd < 10) {
      this.today = yyyy + '-' + mm + '-0' + dd;
    } else {
      this.today = yyyy + '-' + mm + '-' + dd;
    }
  }

  Min_outDate() {
    var today = new Date();
    var dd = today.getDate() + 1;
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10 && mm < 0) {
      this.today1 = yyyy + '-0' + mm + '-0' + dd;
    } else if (mm < 10) {
      this.today1 = yyyy + '-0' + mm + '-' + dd;
    } else if (dd < 10) {
      this.today1 = yyyy + '-' + mm + '-0' + dd;
    } else {
      this.today1 = yyyy + '-' + mm + '-' + dd;
    }
  }
}
