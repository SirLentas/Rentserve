import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DragScrollModule, DragScrollComponent } from 'ngx-drag-scroll';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-houses',
  templateUrl: './houses.component.html',
  styleUrls: ['./houses.component.scss']
})
export class HousesComponent implements OnInit {

  LoggedIn: Boolean
  forRes: Boolean
  id: String
  from: String
  to: String
  guests: String
  numDays: Number
  costPerNight: Number
  costTotal: Number
  avgHostR: String
  countRH: String
  path: String
  pathHost: String
  type: String
  images: Array<any>
  data: any
  map: any
  wifi: Boolean
  tv: Boolean
  oven: Boolean
  cooling: Boolean
  heating: Boolean
  elevator: Boolean
  parking: Boolean
  reviews: Array<any>
  send_to: String
  about: String
  host_id: String

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) {
    this.images = new Array<any>(),
      this.reviews = new Array<any>()
  }


  @ViewChild('nav', { read: DragScrollComponent }) ds: DragScrollComponent;
  @ViewChild('sendform', { static: false }) sendForm: NgForm;

  ngOnInit() {
    const token = localStorage.getItem('isLoggedIn');
    if (token == 'true') {
      this.LoggedIn = true;
    } else {
      this.LoggedIn = false;
    }
    this.forRes = false;
    const Par = this.route.params.subscribe(params => {
      const id = params['id'];
      if (!id) {
        this.router.navigate(['']);
      }
      this.id = id;
      const qPar = this.route.queryParams.subscribe(qparams => {
        const from = qparams.from;
        const to = qparams.to;
        const guests = qparams.guests;
        if (!from || !to || !guests) {
          const url2 = 'https://localhost:3000/houses/' + this.id;

                const house_data = this.http.get<any>(url2)
                  .subscribe(
                    (response) => {
                      if (response.house.house_type == 'house') {
                        this.type = 'House';
                      } else if (response.house.house_type == 'private room') {
                        this.type = 'Private Room';
                      } else if (response.house.house_type == 'public room') {
                        this.type = 'Public Room';
                      }
                      this.data = response.house;
                      this.images = response.house.images;
                      this.reviews = response.reviews;
                      this.avgHostR = response.avg;
                      this.countRH = response.count;
                      this.costPerNight = response.house.cost;
                      this.pathHost = "../../assets/public/profile_pics/" + response.house.profile_pic;
                      this.wifi = response.house.wifi;
                      this.tv = response.house.tv;
                      this.oven = response.house.oven;
                      this.heating = response.house.heating;
                      this.cooling = response.house.cooling;
                      this.elevator = response.house.elevator;
                      this.parking = response.house.parking;

                      var total = this.multiply(this.costPerNight, this.numDays);
                      this.costTotal = total;

                      var latitude: Number = +this.data.lat;
                      var longitude: Number = +this.data.lng;
                      this.map = L.map('map').setView([latitude, longitude], 12);

                      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                      }).addTo(this.map);
                      L.marker([latitude, longitude]).addTo(this.map);
                      this.ref.markForCheck();
                    }, () => { () => { house_data.unsubscribe() } }
                  )
                this.ref.markForCheck()
        } else {
          this.from = from;
          this.to = to;
          this.guests = guests;
          var res1 = from.split("-");
          var indate1 = res1[1] + "/" + res1[2] + "/" + res1[0];
          var res2 = to.split("-");
          var outdate1 = res2[1] + "/" + res2[2] + "/" + res2[0];
          var date1 = new Date(indate1);
          var date2 = new Date(outdate1);
          var Difference_In_Time = date2.getTime() - date1.getTime();
          var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
          this.numDays = Difference_In_Days;

          const url = 'https://localhost:3000/houses/' + this.id + '/' + this.from + '/' + this.to + '/' + this.guests;
          const available = this.http.get<any>(url)
            .subscribe(
              (error) => {
                if (error.status === 496) {
                  this.forRes = false;
                }
                if (error.status === 500) {
                  this.router.navigate(['']);
                }
              },
              (response) => {
                if (response.status === 200) {
                  this.forRes = true;
                } else {
                  this.forRes = false;
                }
                const url2 = 'https://localhost:3000/houses/' + this.id;

                const house_data = this.http.get<any>(url2)
                  .subscribe(
                    (response) => {
                      if (response.house.house_type == 'house') {
                        this.type = 'House';
                      } else if (response.house.house_type == 'private room') {
                        this.type = 'Private Room';
                      } else if (response.house.house_type == 'public room') {
                        this.type = 'Public Room';
                      }
                      this.data = response.house;
                      this.images = response.house.images;
                      this.reviews = response.reviews;
                      this.avgHostR = response.avg;
                      this.countRH = response.count;
                      this.costPerNight = response.house.cost;
                      this.pathHost = "../../assets/public/profile_pics/" + response.house.profile_pic;
                      this.wifi = response.house.wifi;
                      this.tv = response.house.tv;
                      this.oven = response.house.oven;
                      this.heating = response.house.heating;
                      this.cooling = response.house.cooling;
                      this.elevator = response.house.elevator;
                      this.parking = response.house.parking;

                      var total = this.multiply(this.costPerNight, this.numDays);
                      this.costTotal = total;

                      var latitude: Number = +this.data.lat;
                      var longitude: Number = +this.data.lng;
                      this.map = L.map('map').setView([latitude, longitude], 12);

                      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                      }).addTo(this.map);
                      L.marker([latitude, longitude]).addTo(this.map);
                      this.ref.markForCheck();
                    }, () => { () => { house_data.unsubscribe() } }
                  )
                this.ref.markForCheck()
              }, () => { available.unsubscribe() }
            )
          this.ref.markForCheck();
        }
      }, () => { qPar.unsubscribe() })
      this.ref.markForCheck();
    }, () => { Par.unsubscribe() });
  }

  ReserveHouse() {
    const headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded' });
    this.http.get<any>('https://localhost:3000/users/profile').subscribe(
      (response) => {
        const renter_id = response.user.user_id;
        let body = `house=${this.id}&from=${this.from}&to=${this.to}&renter_id=${renter_id}`;
        this.http.post('https://localhost:3000/houses/reserve', body, { headers: headers }).subscribe(
          (response) => {
            this.router.navigate(['users/my-stays']);
          }
        )
      },
      (error) => {
        this.router.navigate(['users/login']);
      }
    );

  }

  LoginFirst() {
    this.router.navigate(['users/login'], { queryParams: { id: this.data.house_id, from: this.from, to: this.to, guests: this.guests } });
  }

  multiply(x, y): Number {
    return x * y;
  }

  onReply(id, about, username) {
    this.host_id = id;
    this.send_to = username;
    this.about = about;
  }

  onSend() {
    const message = this.sendForm.value.message;
    const headers = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded ' });
    const body = `to=${this.host_id}&about=${this.about}&message=${message}`
    this.http.post<any>('https://localhost:3000/users/profile/my-messages/send', body, { headers: headers }).subscribe(
      () => {
        window.location.reload();
      })

  }
}
declare var L: any;
