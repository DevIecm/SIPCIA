import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Catalogos {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getCatalogos(cat_tipo: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    
    return this.http.get(this.apiUrl + 'catalogos/' + cat_tipo, {headers}).pipe(catchError((error: HttpErrorResponse) => {return throwError(() => error);}));
  };
  
  getSeccion(seccion_electoral: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    
    const params = new HttpParams().set('seccion_electoral', seccion_electoral);

    return this.http.get(this.apiUrl + 'registro/getbyseccion', {headers, params}).pipe(catchError((error: HttpErrorResponse) => {return throwError(() => error);}));
  }; 
}
