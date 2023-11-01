import { HttpClient } from '@angular/common/http';
import { IUserDataApiResponse } from "../../models/IUserData";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(userData: IUserDataApiResponse) {
    // since our app doesn't require login we won't be performing login operation, instead we will get the JWT token provided with user data and store it locally
    localStorage.setItem('token', userData.token);
  }
}
