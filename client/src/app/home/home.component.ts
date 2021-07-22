import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from "moment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('searchform', { static: false }) searchForm: NgForm;

  constructor(
    private router: Router
  ) { }

  nrSelect: number = 1;
  message: String
  today: String
  today1: String

  test(){
    if(!this.searchForm.value.arr_day){
      this.Min_outDate();
    }else{
      this.today1 = this.searchForm.value.arr_day;
    }
  }

  onSearchSubmit() {
    const location = this.searchForm.value.location;
    const arr_day = this.searchForm.value.arr_day;
    const dep_day = this.searchForm.value.dep_day;
    const guests = this.searchForm.value.guests;
    if (!location) {
      this.message = "Please give Country,City,State";
    } else if (!arr_day) {
      this.message = "Please give arrival day";
    } else if (!dep_day) {
      this.message = "Please give departure day";
    } else if (!guests) {
      this.message = "Please give number of guests";
    } else if (moment().isAfter(dep_day)) {
      this.message = "Given departure date is invalid";
    } else if (moment(arr_day).isAfter(dep_day) || moment(arr_day).isSame(dep_day)) {
      this.message = "Given departure date is before given arrival date or the same";
    } else {
      const min = '';
      const max = '';
      const type = '';
      const wifi = '';
      const oven = '';
      const heating = '';
      const cooling = '';
      const tv = '';
      const parking = '';
      const elevator = '';
      this.router.navigate(['search'], {
        queryParams: {
          location: location, arr_day: arr_day, dep_day: dep_day, guests: guests, min: min,
          max: max, type: type, wifi: wifi, oven: oven, heating: heating, cooling: cooling, tv: tv, parking: parking, elevator: elevator
        }
      });
    }

  }

  ngOnInit(): void {
    this.Min_Date();
    this.Min_outDate();
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
    }else {
      this.today = yyyy + '-' + mm + '-' + dd;
    }
  }

  Min_outDate() {
    var today = new Date();
    var dd = today.getDate()+1;
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10 && mm < 0) {
      this.today1 = yyyy + '-0' + mm + '-0' + dd;
    } else if (mm < 10) {
      this.today1 = yyyy + '-0' + mm + '-' + dd;
    } else if (dd < 10) { 
      this.today1 = yyyy + '-' + mm + '-0' + dd;
    }else {
      this.today1= yyyy + '-' + mm + '-' + dd;
    }
  }
}
