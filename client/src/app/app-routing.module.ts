import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/profile.component';
import { HostComponent } from './host/host.component';
import { HousesComponent } from './houses/houses.component';
import { AddListingComponent } from './add-listing/add-listing.component';
import { ProtectedComponentComponent } from './protected-component/protected-component.component';
import { StaysComponent } from './stays/stays.component';
import { MessagesComponent } from './messages/messages.component';
import { EditListingComponent } from './edit-listing/edit-listing.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users/login', component: LoginComponent },
  { path: 'users/register', component: RegisterComponent },
  { path: 'users/logout', component: LogoutComponent },
  { path: 'search', component: SearchComponent },
  { path: 'houses/:id', component: HousesComponent },
  { path: 'users/profile', component: ProfileComponent },
  { path: 'admin-page', component: ProtectedComponentComponent },
  { path: 'users/host-page', component: HostComponent },
  { path: 'users/host-page/add-listing', component: AddListingComponent },
  { path: 'users/my-stays', component: StaysComponent },
  { path: 'users/messages', component:MessagesComponent},
  { path: 'users/host-page/edit-listing', component:EditListingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
