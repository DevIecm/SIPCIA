import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class Auth {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string, tipo_usuario: number): Observable<any> {
    return this.http.post(this.apiUrl + 'login/login', {
      username,
      password,
      tipo_usuario
    }).pipe(catchError((error: HttpErrorResponse) => {return throwError(() => error);}));
  };

  cerrarSesionByToken() {
    this.router.navigate(['']);
  }
}
