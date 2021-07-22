import { Component, OnInit, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { DataSharingService } from './services/data-sharing.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent implements OnInit {

  isUserLoggedIn: boolean;
  isHost: boolean;
  isAdmin: boolean;


  constructor(
    private dataSharingService: DataSharingService,
    private authService: AuthService
  ) {

    this.dataSharingService.isUserLoggedIn.subscribe(value => {
      this.isUserLoggedIn = value;
    });
  }

  onActivate() {
    localStorage.removeItem('address')
    localStorage.removeItem('city')
    localStorage.removeItem('lat')
    localStorage.removeItem('lng')
  }

  ngOnInit() {
    this.authService.checkValid();
  }
}



