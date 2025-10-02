import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})

export class bitacoras {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getBitacoraComunidad(id_registro: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('id_registro', id_registro)

    return this.http.get(this.apiUrl + 'bitacora/bitacora', {headers, params})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  };

  getBitacoraAfluencia(id_registro: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('id_registro', id_registro)

    return this.http.get(this.apiUrl + 'bitacora/getbitacoraAfluencia', {headers, params})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  }

  getbitacoraLugares(id_registro: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('id_registro', id_registro)

    return this.http.get(this.apiUrl + 'bitacora/getbitacoraLugares', {headers, params})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  }

  getbitacoraInstituciones(id_registro: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('id_registro', id_registro)

    return this.http.get(this.apiUrl + 'bitacora/getbitacoraInstituciones', {headers, params})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  }

}