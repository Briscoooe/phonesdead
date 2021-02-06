import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from './_models/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;

  private userSubject: BehaviorSubject<IUser>;
  public user: Observable<IUser>;

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('user') || '{}'));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): IUser {
    return this.userSubject.value;
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    //this.userSubject.next(); TODO // fix
    this.router.navigate(['/account/login']);
  }

  login(username: string, password: string) {
    return this.http.post<IUser>(this.baseUrl + 'users/authenticate', { username, password })
      .pipe(map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  register(user: IUser) {
    return this.http.post(this.baseUrl + '/users/register', user);
  }
}
