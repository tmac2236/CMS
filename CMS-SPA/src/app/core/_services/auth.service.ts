import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../_models/user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  //decodedToken: any; // keep the imformation from token
  //photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  //currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) {}

  //changeMemberPhoto(photoUrl: string) {
  //  this.photoUrl.next(photoUrl);
  // }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.token);
          //localStorage.setItem('user', JSON.stringify(user.user));
          //this.decodedToken = this.jwtHelper.decodeToken(user.token);
          
        }
      })
    );
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}