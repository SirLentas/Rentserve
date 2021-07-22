import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { DataSharingService } from './services/data-sharing.service';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/profile.component';
import { HostComponent } from './host/host.component';
import { HousesComponent } from './houses/houses.component';
import { StaysComponent } from './stays/stays.component';
import { AddListingComponent } from './add-listing/add-listing.component';
import { ProtectedComponentComponent } from './protected-component/protected-component.component';
import { LogoutComponent } from './logout/logout.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule} from '@angular/forms';
import { DragScrollModule } from 'ngx-drag-scroll';
import { MessagesComponent } from './messages/messages.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditListingComponent } from './edit-listing/edit-listing.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    SearchComponent,
    ProfileComponent,
    HostComponent,
    HousesComponent,
    AddListingComponent,
    ProtectedComponentComponent,
    LogoutComponent,
    StaysComponent,
    MessagesComponent,
    EditListingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    DragScrollModule,
    NgbModule,
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    DataSharingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
