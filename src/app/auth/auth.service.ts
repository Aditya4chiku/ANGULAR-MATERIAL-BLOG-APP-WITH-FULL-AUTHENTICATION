import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private tokenTimer: NodeJS.Timer
  private isAuthenticated = false;
  private authStatusListner = new Subject<boolean>();




  constructor(private http: HttpClient, private router: Router) { }


  private setAuthTimer(duration: number) {
console.log("setting time duration " + duration)
  this.tokenTimer = setTimeout(() => { 
      this.logout();
    }, duration * 1000)
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }


  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email, password: password
    }
    this.http.post("http://localhost:3000/api/users/signup", authData).subscribe(responce => {
      console.log(responce);
    })
  }
  getAuthstatusListener() {
    return this.authStatusListner.asObservable();
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }


  login(email: string, password: string) {
    const authData: AuthData = {
      email: email, password: password
    }

    this.http.post<{ token: string, expiresIn: number }>(" http://localhost:3000/api/users/login", authData).subscribe(
      responce => {
        const token = responce.token

        this.token = token;
        console.log(this.token)

        if (token) {
          const expiresInDuration = responce.expiresIn
          console.log(expiresInDuration)
          this.setAuthTimer(expiresInDuration)
        
          this.isAuthenticated = true
          this.authStatusListner.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
          console.log(expirationDate)
          this.saveAuthData(token, expirationDate)
          this.router.navigate(['/']);
        }


      }
    )
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration')
  }


  autoAuthUser() {
    const authInformation = this.getAuthData();
    if(!authInformation)
    return ;
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token
      this.isAuthenticated = true
      this.setAuthTimer(expiresIn/1000)
      this.authStatusListner.next(true);
    }



  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }

    return {
        token: token,
       expirationDate: new Date(expirationDate)
    }

  }

}
