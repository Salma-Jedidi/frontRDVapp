import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';
@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private baseUrl = 'http://localhost:8089/api/v1/auth';

  constructor(private http: HttpClient) {}

  
  signup(signUpRequest: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/signup`, signUpRequest);
  }

  signin(signinRequest: any): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/signin`, signinRequest);
  }

  refresh(refreshTokenRequest: any): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/refresh`, refreshTokenRequest);
  }
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/forgot-password`, { email });
  }
}