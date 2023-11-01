import { Injectable } from "@angular/core";
import { IUserData, IUserDataApiResponse } from "../../models/IUserData";
import { HttpClient } from "@angular/common/http";
import { map, Observable, tap } from "rxjs";
import { environment } from "../../environments/environment.development";
import { AuthService } from "../auth/auth.service";
import { IUserStats } from "../../models/IUserStats";

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService,
  ) {}
  public getUserData(): Observable<IUserData> {
    const userData = sessionStorage.getItem('userData');

    if (userData) {
      return new Observable((observer) => {
        observer.next(JSON.parse(userData));
        observer.complete();
      });
    } else {
      return this.getNewUserData();
    }
  }

  public setAvatarSeen(): Observable<void> {
      return this.http.post<void>(`${environment.apiUrl}/userData/avatar/seen`, {}).pipe(
          tap(() => {
            const userData = JSON.parse(sessionStorage.getItem('userData') ?? '{}');
            userData.isAvatarSeen = true;
            sessionStorage.setItem('userData', JSON.stringify(userData));
          }
      ));
  }

  public getUserStats(): Observable<IUserStats> {
      return this.http.get<IUserStats>(`${environment.apiUrl}/userData/stats`);
  }

  private getNewUserData(): Observable<IUserData> {
    return this.http.get<IUserDataApiResponse>(`${environment.apiUrl}/userData`).pipe(
      tap((data) => {
        this.auth.login(data); // normally this would be a separate process, but in case of this app we're logging in by fetching new user data
        sessionStorage.setItem('userData', JSON.stringify(data));
      }),
      map((apiData: IUserDataApiResponse) => {
        const userData: IUserData = {
          id: apiData.id,
          avatarUrl: apiData.avatarUrl,
          isAvatarSeen: apiData.isAvatarSeen,
        };
        return userData;
      }),
    );
  }
}
