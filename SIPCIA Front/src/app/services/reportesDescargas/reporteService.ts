import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})

export class reporteService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

    descargarReporte(tipo_comunidad: number, distrito_electoral: number | null, tipo_usuario: number, token: string): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
    .set('tipo_comunidad', tipo_comunidad)
    .set('distrito_electoral', distrito_electoral !== null ? distrito_electoral: '')
    .set('tipo_usuario', tipo_usuario)

    return this.http.get(this.apiUrl + 'reportesDes/reporteDirectorioIndig', { headers, params, responseType: 'blob' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  } 

  descargarReporteAfro(tipo_comunidad: number, distrito_electoral: number | null, tipo_usuario: number, token: string): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
    .set('tipo_comunidad', tipo_comunidad)
    .set('distrito_electoral', distrito_electoral !== null ? distrito_electoral: '')
    .set('tipo_usuario', tipo_usuario)

    return this.http.get(this.apiUrl + 'reportesDes/reporteDirectorioAfro', { headers, params, responseType: 'blob' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  descargarReporteInstancias(distrito_electoral: number | null, token: string): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
    .set('distrito_electoral', distrito_electoral !== null ? distrito_electoral: '')

    return this.http.get(this.apiUrl + 'reportesDes/reporteInstancias', { headers, params, responseType: 'blob' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  descargarReporteInstitucion(distrito_electoral: number | null, token: string): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
    .set('distrito_electoral', distrito_electoral !== null ? distrito_electoral: '')

    return this.http.get(this.apiUrl + 'reportesDes/reporteInstituciones', { headers, params, responseType: 'blob' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  descargarReporteAtencionAll(distrito_electoral: number | null, token: string): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
    .set('distrito_electoral', distrito_electoral !== null ? distrito_electoral: '')      

    return this.http.get(this.apiUrl + 'reportesDes/reporteAtencion', { headers, params, responseType: 'blob' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  descargarReporteAtencion(distrito_electoral: number | null, id_registro: any, token: string): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
    .set('distrito_electoral', distrito_electoral !== null ? distrito_electoral: '')
    .set('id_registro', id_registro);

    return this.http.get(this.apiUrl + 'reportesDes/reporteAtencionById', { headers, params, responseType: 'blob' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  descargarReporteAfluencia(distrito_electoral: number | null, token: string): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
    .set('distrito_electoral', distrito_electoral !== null ? distrito_electoral: '')

    return this.http.get(this.apiUrl + 'reportesDes/reporteAfluencia', { headers, params, responseType: 'blob' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  descargarReporteAsamblea(distrito_electoral: number | null, token: string): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
    .set('distrito_electoral', distrito_electoral !== null ? distrito_electoral: '');

    return this.http.get(this.apiUrl + 'reportesDes/reporteAsamblea', { headers, params, responseType: 'blob' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
    );
  }
}