import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})

export class Auth {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private router: Router) { }

  private cryptoHash = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"; 

  encrypPostData(data: any): string {
    const json = JSON.stringify(data);
    return CryptoJS.AES.encrypt(json, this.cryptoHash).toString();
  };

  login(username: string, password: string, tipo_usuario: number): Observable<any> {
    return this.http.post(this.apiUrl + 'login/login', {
      username,
      password,
      tipo_usuario
    }).pipe(catchError((error: HttpErrorResponse) => {return throwError(() => error);}));
  };
  
  loginEncrypted(username: string, password: string, tipo_usuario: number): Observable<any> {
    
    const data = {
        username,
        password,
        tipo_usuario
    };

    const encryp = this.encrypPostData(data);

    return this.http.post(this.apiUrl + 'login/loginEncrypt', {
      encryp
    }).pipe(catchError((error: HttpErrorResponse) => {return throwError(() => error);}));
  };

  cerrarSesionByToken() {
    this.router.navigate(['']);
  }
}
