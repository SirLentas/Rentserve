import { Component, OnInit, ViewChild,ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @ViewChild('filterform', { static: false }) filterForm: NgForm;

  location: String
  arr_day: String
  dep_day: String
  guests: String
  data: Array<any>
  totalRecords: String
  page: Number = 1

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) { this.data =new Array<any>() }

  navToHouse(id){
    const url='houses/'+id;
    this.router.navigate([url],{queryParams:{from:this.arr_day, to:this.dep_day, guests: this.guests}});
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      (params);
      const location = params.location;
      const arr_day = params.arr_day;
      const dep_day = params.dep_day;
      const guests = params.guests;
      if (!location || !arr_day || !dep_day || !guests) {
        this.router.navigate(['']);
      } else {
        this.location = location;
        this.arr_day = arr_day;
        this.dep_day = dep_day;
        this.guests = guests;
        this.http.get<any>('https://localhost:3000/search', {
          params: {
            location: location, arr_day: arr_day, dep_day: dep_day, guests: guests, min: params.min, max: params.max,
            type: params.type, wifi: params.wifi, oven: params.oven, heating: params.heating, cooling: params.cooling, tv: params.tv, parking: params.parking, elevator: params.elevator
          }
        })
          .subscribe(
            (response) => {
              (response);
              this.data=response.houses;
              this.totalRecords=response.houses.length;
              this.ref.markForCheck();
            }
          )
      }
    });
  }

  onFilterSubmit() {
    const min = this.filterForm.value.min_price;
    const max = this.filterForm.value.max_price;
    const type = this.filterForm.value.h_type;
    const wifi = this.filterForm.value.wifi;
    const oven = this.filterForm.value.oven;
    const heating = this.filterForm.value.heating;
    const cooling = this.filterForm.value.cooling;
    const tv = this.filterForm.value.tv;
    const parking = this.filterForm.value.parking;
    const elevator = this.filterForm.value.elevator;
    const location = this.location;
    const arr_day = this.arr_day;
    const dep_day = this.dep_day;
    const guests = this.guests;
    this.page=1;
    this.router.navigate(['search'], {
      queryParams: {
        location: location, arr_day: arr_day, dep_day: dep_day, guests: guests, min: min,
        max: max, type: type, wifi: wifi, oven: oven, heating: heating, cooling: cooling, tv: tv, parking: parking, elevator: elevator
      }
    });
  }

}

