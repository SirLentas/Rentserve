import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import * as jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AddListingComponent implements OnInit {


  @ViewChild('addform', { static: false }) addForm: NgForm;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder) {
  }

  map: any;
  message: String;
  formData: FormData;
  uploadForm: FormGroup
  files: string[] = [];
  address: String
  lat: String;
  lng: String;
  city: String;
  today: String;
  today1: String;

  onFileSelect(event) {
    this.files=[]
    for (var i = 0; i < event.target.files.length; i++) {
      this.files.push(event.target.files[i]);
    }
  }

  onAddListing() {
    const headers = new HttpHeaders();
    const formData = new FormData();

    const address = localStorage.getItem('address');
    const city = localStorage.getItem('city');
    const lat = +localStorage.getItem('lat');
    const lng = +localStorage.getItem('lng');

    const country = this.addForm.value.country;
    const name = this.addForm.value.name;
    const size = this.addForm.value.size;
    const min_days = this.addForm.value.min_days;
    const a_from = this.addForm.value.a_from;
    const a_to = this.addForm.value.a_to;
    const guests = this.addForm.value.guests;
    const cost = this.addForm.value.cost;
    const h_type = this.addForm.value.h_type;
    const wifi = this.addForm.value.wifi;
    const oven = this.addForm.value.oven;
    const heating = this.addForm.value.heating;
    const cooling = this.addForm.value.cooling;
    const tv = this.addForm.value.tv;
    const parking = this.addForm.value.parking;
    const elevator = this.addForm.value.elevator;
    const des = this.addForm.value.des;
    const info = this.addForm.value.info;

    if (!address || !lat || !lng || !city) {
      this.message = 'Find your address in the map';
    } else if (!country) {
      this.message = 'Type the country where your house is located';
    } else if (!name) {
      this.message = "Type your house's name";
    } else if (!size) {
      this.message = 'Type the size of your house in square meters';
    } else if (!min_days) {
      this.message = 'Set the minimun number of days for a reservation';
    } else if (!a_from || !a_to) {
      this.message = 'Select the dates when your house is available ';
    } else if (!guests) {
      this.message = "Type your house's capacity";
    } else if (!cost) {
      this.message = 'Set the cost per night';
    } else if (!h_type) {
      this.message = 'Select a type of house for your listing';
    } else if (!des) {
      this.message = 'Add a description for your house';
    }else if (!info) {
      this.message = 'Add more info for your house';
    } else if (this.files.length > 10) {
      this.message = 'Too many files selected (max 10)';
      this.files = [];
    } else if (this.files.length < 3) {
      this.message = 'Select at least 3 photos';
    } else {

      localStorage.removeItem('address');
      localStorage.removeItem('city');
      localStorage.removeItem('lat');
      localStorage.removeItem('lng');

      
      for (var i = 0; i < this.files.length; i++) {
        formData.append('multi-files', this.files[i]);
      }

      const up = this.http.post<any>('https://localhost:3000/houses/add-listing/photos', formData, { headers: headers }).subscribe(
        (response) => {
          (response.jsonIm)
          const images = response.jsonIm;


          const headers_2 = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded ' });

          // let body;
          let body = `country=${country}&city=${city}&address=${address}&capacity=${guests}&a_from=${a_from}
                      &a_to=${a_to}&name=${name}&size=${size}&cost=${cost}&h_type=${h_type}&des=${des}&info=${info}
                      &min_days=${min_days}&lat=${lat}&lng=${lng}&images=${images}&wifi=${wifi}&tv=${tv}&oven=${oven}
                      &heating=${heating}&cooling=${cooling}&parking=${parking}&elevator=${elevator}`;

          const add = this.http.post('https://localhost:3000/houses/add-listing', body, { headers: headers_2 }).subscribe(
            () => {
              this.router.navigate(['users/host-page'])
              add.unsubscribe();
            });
        },
        () => { up.unsubscribe() })
    }
  }

  ngOnDestroy() {

  }

  ngOnInit() {
    let token = jwt_decode(localStorage.getItem('token'));
    let level = token.level;
    if (level != 2) {
      this.router.navigate(['users/profile']);
    }

    this.Min_Date();
    this.Min_outDate();

    var map = L.map('map').setView([40, 25], 4);
    ("hello again");
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var searchControl = L.esri.Geocoding.geosearch().addTo(map);

    var results = L.layerGroup().addTo(map);

    searchControl.on('results', function (data) {
      results.clearLayers();
      results.addLayer(L.marker(data.results[0].latlng));
      localStorage.setItem('lat', data.results[0].latlng.lat);
      localStorage.setItem('lng', data.results[0].latlng.lng);
      var f_addr = data.text;
      var address = f_addr.split(", ");
      localStorage.setItem('address', address[0])
      localStorage.setItem('city', address[2])
    });
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
declare var L: any;
