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

    // const params = new HttpParams()
    //   .set('id_registro', id_registro)

    return this.http.get(this.apiUrl + 'control/getAllDistritos', {headers})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  }
}
