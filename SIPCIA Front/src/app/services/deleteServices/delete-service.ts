import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class DeleteService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  eliminaFichInd(id: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      'id': id
    };

    return this.http.patch(this.apiUrl + 'fichas/eliminarFichaInd', body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };
 
  eliminaFichAfro(id: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      'id': id
    };

    return this.http.patch(this.apiUrl + 'fichasAfro/eliminarFichaAfro', body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };

  eliminaDocs(id: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      'id': id
    };

    return this.http.patch(this.apiUrl + 'cargaNormativo/eliminarDocNormativos', body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };
  
  delFirstStep(id: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      'id': id
    };

    return this.http.patch(this.apiUrl + 'registro/eliminarRegistro', body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };

  delSecondPointOneStep(id: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      'id': id
    };

    return this.http.patch(this.apiUrl + 'registro/eliminarRegistro', body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };

  delSecondPointSevenStep(id: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      'id': id
    };

    return this.http.patch(this.apiUrl + 'afluencia/eliminarRegistro', body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };

  delSecondPointEightStep(id: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      'id': id
    };

    return this.http.patch(this.apiUrl + 'lugares/eliminarRegistro', body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };

  delSecondPointNineStep(id: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      'id': id
    };

    return this.http.patch(this.apiUrl + 'atencion/eliminarRegistro', body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };

  delSecondPointTenStep(id: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      'id': id
    };

    return this.http.patch(this.apiUrl + 'instituciones/eliminarRegistro', body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };
}
