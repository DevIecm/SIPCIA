import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../enviroments/enviroment';
import { CommonModule } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class Auth {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private router: Router, private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl + 'login/login', {
      username,
      password
    }).pipe(catchError((error: HttpErrorResponse) => {return throwError(() => error);}));
  };

}
