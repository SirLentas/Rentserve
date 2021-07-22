import { Injectable } from '@angular/core';
import * as moment from "moment";
import { DataSharingService } from '../services/data-sharing.service';

@Injectable()
export class AuthService {

    constructor(
        private dataSharingService: DataSharingService) { }

    setLocalStorage(responseObj) {
        const expires = moment().add(responseObj.expiresIn);
        localStorage.setItem('token', responseObj.token);
        localStorage.setItem('expires', JSON.stringify(expires.valueOf()));
        localStorage.setItem('isLoggedIn', 'true');
        this.dataSharingService.isUserLoggedIn.next(true);
    }

    findPath(responseObj): String {
        if (responseObj.level == 3) {
            return 'admin-page';
        } else if (responseObj.level == 2) {
            return 'users/host-page';
        } else if (responseObj.level == 1) {
            return 'users/profile';
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('expires');
        localStorage.removeItem('isLoggedIn');
        this.dataSharingService.isUserLoggedIn.next(false);
    }

    checkValid() {
        const token = localStorage.getItem('token');
        if(token!=null){
            const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
            if ((Math.floor((new Date).getTime() / 1000)) >= expiry) {
                this.logout();
            }
        }
    }
}