import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Reportes {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }


  
  getRegisterData(tipo_comunidad: number, id_distrito: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });


    const params = new HttpParams()
      .set('tipo_comunidad', tipo_comunidad)
      .set('id_distrito', id_distrito)
      
    return this.http.get(this.apiUrl + 'reportes/reporteInstancias', {headers, params})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  };

  
  insertaRegistro(data: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      ...data,
    };

    return this.http.post(this.apiUrl + 'afluencia/altaAfluencia', body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };

  updateRegistro(data: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      ...data
    };

    return this.http.patch(this.apiUrl + 'afluencia/updateAfluencia', body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };

  getRegisterDataTable(area: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });


    const params = new HttpParams()
      .set('distrito_electoral', area)
      
    return this.http.get(this.apiUrl + 'afluencia/getAfluencia', {headers, params})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  };

  getDataById(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('id', id)

    return this.http.get(this.apiUrl + 'afluencia/getRegistroAfluencia', {headers, params})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  };

  //propuesta comunitaria

  insertaRegistroComunitaria(data: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      ...data,
    };

    return this.http.post(this.apiUrl + 'lugares/altaLugar', body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };

  updateRegistroComunitaria(data: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      ...data
    };

    return this.http.patch(this.apiUrl + 'lugares/updateLugar', body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };

  getRegisterDataTableComunitaria(area: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });


    const params = new HttpParams()
      .set('distrito_electoral', area)
      
    return this.http.get(this.apiUrl + 'lugares/getLugares', {headers, params})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  };

  getDataByIdComunitaria(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('id', id)

    return this.http.get(this.apiUrl + 'lugares/getRegistroLugares', {headers, params})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  };
}
