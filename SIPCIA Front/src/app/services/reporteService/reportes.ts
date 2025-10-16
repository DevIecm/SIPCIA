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
  
  getRegisterData(tipo_comunidad: number, id_distrito: number, id_demarcacion: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('tipo_comunidad', tipo_comunidad)
      .set('id_distrito', id_distrito)
      .set('id_demarcacion', id_demarcacion)
      
    return this.http.get(this.apiUrl + 'reportes/reporteInstancias', {headers, params})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  };

  getAllRegistrosInd(id_distrito: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('id_distrito', id_distrito)
      
    return this.http.get(this.apiUrl + 'reportes/reporteInstanciasInd', {headers, params})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  };

  getAllRegistrosAfro(id_distrito: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('id_distrito', id_distrito)
      
    return this.http.get(this.apiUrl + 'reportes/reporteInstanciasAfro', {headers, params})
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

  nuinsertaRegistro(data: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(this.apiUrl + 'afluencia/altaAfluencia', data, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

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

  nuupdateRegistro(data: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    
    return this.http.patch(this.apiUrl + 'afluencia/updateAfluencia', data, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };

  descargarDocumento(nombreFisico: string, token: string): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}descargaDoc/download/${nombreFisico}`, {
      headers,
      responseType: 'blob'
    }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  subirDocumentoNormativo(formData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}cargaNormativo/subirDocumentoNormativo`, formData, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => error))
      );
  }

  getOtrosDocumentos(distrito_electoral:number, tipo_comunidad:number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });


    const params = new HttpParams()
      .set('distrito_electoral', distrito_electoral)
      .set('tipo_comunidad', tipo_comunidad)
      
    return this.http.get(this.apiUrl + 'cargaNormativo/getOtrosDocumentos', {headers, params})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  };

  descargarDocNorma(nombreFisico: string, token: string): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}descargaDoc/downloadNorma/${nombreFisico}`, {
      headers,
      responseType: 'blob'
    }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  descargarOtrosNorma(nombreFisico: string, token: string): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const url = this.apiUrl + 'descargaDoc/downloadOtrosNorma/' + encodeURIComponent(nombreFisico);

    return this.http.get(url, {
      headers,
      responseType: 'blob'
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getCabezera(id_distrito: number, demarcacion: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('id_distrito', id_distrito)
      .set('demarcacion', demarcacion)
      
    return this.http.get(this.apiUrl + 'catalogos/getCabezera', {headers, params})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  };

  getRegisterDataTable(area: number | null, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('distrito_electoral', area !== null ? area: '')
      
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
  
  nuinsertaRegistroComunitaria(data: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(this.apiUrl + 'lugares/altaLugar', data, { headers })
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

  nuupdateRegistroComunitaria(data: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch(this.apiUrl + 'lugares/updateLugar', data, { headers })
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

  getRegisterDataTableComunitariaTwo(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(this.apiUrl + 'lugares/getLugares', {headers})
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

  insertaRegistroConsultas(data: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(this.apiUrl + 'atencion/altaAtencion', data, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };

  updateRegistroConsultas(data: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch(this.apiUrl + 'atencion/updateAntencion', data, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };

  getRegisterDataTableConsultas(area: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('distrito_electoral', area)
      
    return this.http.get(this.apiUrl + 'atencion/getAtencion', {headers, params})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  };

  getRegisterDataTableConsultasTwo(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
      
    return this.http.get(this.apiUrl + 'atencion/getAtencion', {headers})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  };

  getRegisterConsecutivoConsultas(area: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('distrito_electoral', area)
      
    return this.http.get(this.apiUrl + 'atencion/getConsCon', {headers, params})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  };

  getDataByIdConsultas(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('id', id)

    return this.http.get(this.apiUrl + 'atencion/getRegistroAtencion', {headers, params})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  };

  insertaRegistroAcompa(data: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      ...data,
    };

    return this.http.post(this.apiUrl + 'instituciones/altaInstituciones', body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };

  nuinsertaRegistroAcompa(data: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(this.apiUrl + 'instituciones/altaInstituciones', data, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };

  updateRegistroAcompa(data: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      ...data
    };

    return this.http.patch(this.apiUrl + 'instituciones/updateInstituciones', body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };

  nuupdateRegistroAcompa(data: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch(this.apiUrl + 'instituciones/updateInstituciones', data, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };

  getRegisterDataTableAcompa(area: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('distrito_electoral', area)
      
    return this.http.get(this.apiUrl + 'instituciones/getInstituciones', {headers, params})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  };

  getRegisterDataTableAcompaTwo(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(this.apiUrl + 'instituciones/getInstituciones', {headers})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  };

  getDataByIdAcompa(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('id', id)

    return this.http.get(this.apiUrl + 'instituciones/getRegistroInstituciones', {headers, params})
      .pipe(catchError((error: HttpErrorResponse) => { return throwError(() => error); }))
  };

}
