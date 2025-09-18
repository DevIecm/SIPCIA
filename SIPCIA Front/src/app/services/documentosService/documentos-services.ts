import { HttpHeaders, HttpErrorResponse, HttpParams, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class DocumentosServices {

    private apiUrl = `${environment.apiUrl}`;

    constructor(private http: HttpClient) { }
    

    insertaFichaTecnica(data: any, token: string): Observable<any> {
        const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
        });

        const body = {
        ...data,
        };

        return this.http.post(this.apiUrl + 'fichas/altaFichaInd', body, { headers })
        .pipe(
            catchError((error: HttpErrorResponse) => {
            return throwError(() => error);
            })
        );
    };

    insertaFichaTecnicaAfro(data: any, token: string): Observable<any> {
        const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
        });

        const body = {
        ...data,
        };

        return this.http.post(this.apiUrl + 'fichasAfro/altaFichaAfro', body, { headers })
        .pipe(
            catchError((error: HttpErrorResponse) => {
            return throwError(() => error);
            })
        );
    };

    getRegisterfichaTecnicaTablaAfro(area: number, token: string): Observable<any> {
        const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
        });


        const params = new HttpParams()
        .set('distrito_electoral', area)
        
        return this.http.get(this.apiUrl + 'fichasAfro/getFichasAfro', {headers, params})
        .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
    };

    getRegisterfichaTecnicaTabla(area: number, token: string): Observable<any> {
        const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
        });


        const params = new HttpParams()
        .set('distrito_electoral', area)
        
        return this.http.get(this.apiUrl + 'fichas/getFichasInd', {headers, params})
        .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
    };

    getDataFichaTecnicaById(id: number, token: string): Observable<any> {
        const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
        });

        const params = new HttpParams()
        .set('id', id)

        return this.http.get(this.apiUrl + 'fichas/getRegistroFichaInd', {headers, params})
        .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
    };

    getDataFichaTecnicaByIdAfro(id: number, token: string): Observable<any> {
        const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
        });

        const params = new HttpParams()
        .set('id', id)

        return this.http.get(this.apiUrl + 'fichasAfro/getRegistroFichaAfro', {headers, params})
        .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
    };
}
