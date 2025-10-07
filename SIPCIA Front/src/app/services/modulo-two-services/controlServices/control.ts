import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class Control {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }
  
  getAllDistritos(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(this.apiUrl + 'control/getAllDistritos', {headers})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  }

  getModulos(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(this.apiUrl + 'control/getControlModulos', {headers})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  }


  updateRegistroDistrito(distrito: number, estado_sistema: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const data = {
      "distrito": distrito,
      "estado_sistema": estado_sistema
    }

    return this.http.patch(this.apiUrl + 'control/updateEstadoDistrito', data, { headers })
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  }


  updateEstadoModulo(distrito: number, estado_sistema: number, token: string): Observable<any> {
    console.log(distrito)
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const data = {
      "id_modulo": distrito,
      "estado_sistema": estado_sistema
    }

    console.log(data)

    return this.http.patch(this.apiUrl + 'control/updateEstadoModulo', data, { headers })
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  }

  updateDistritos(estado_sistema: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const data = {
      "estado_sistema": estado_sistema
    }

    return this.http.patch(this.apiUrl + 'control/updateAllDistritos', data, { headers })
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  }

  updateClick(distrito: number, nombre: string, estado_sistema: number, token: string){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const data = {
      "distrito": distrito,
      "nombre": nombre,
      "estado_sistema": estado_sistema
    }
    return this.http.patch(this.apiUrl + 'control/updateControlDocs', data, { headers })
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  }

  updateClickModulo(distrito: number, estado_sistema: number, token: string){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const data = {
      "id_modulo": distrito,
      "estado_sistema": estado_sistema
    }

    return this.http.patch(this.apiUrl + 'control/updateDocModulos', data, { headers })
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  }

  updateCheckAllDistritos(distrito: string, estado_sistema: number, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const data = {
      "nombre": distrito,
      "estado_sistema": estado_sistema
    }

    return this.http.patch(this.apiUrl + 'control/updateByColum', data, { headers })
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  }

  cleanChecksData(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch(this.apiUrl + 'control/updateLimpiaDocumentos', {}, {headers})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  }
}
