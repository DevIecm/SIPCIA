import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../../../navbar/navbar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import * as data from '../../../../labels/label.json';
import { MatTableDataSource } from '@angular/material/table';
import { Catalogos } from '../../../../../services/catService/catalogos';
import Swal from 'sweetalert2';
import { Auth } from '../../../../../services/authService/auth';
import { Reportes } from '../../../../../services/reporteService/reportes';
import { reporteService } from '../../../../../services/reportesDescargas/reporteService';

@Component({
  selector: 'app-reporte-representativas',
  imports: [
    Navbar, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './reporte-representativas.html',
  styleUrl: './reporte-representativas.css'
})
export class ReporteRepresentativas implements OnInit{

  data: any = data;
  nombreUser: string = '';
  cargoUser: string = '';
  
  tokenSesion: string = '';
  catalogoDemarcacionI: any = [];
  catalogoDemarcacionA: any = [];
  moduloClicked: string = '';
  opcionDermarcacionI: any;
  opcionDermarcacionA: any;
  formularioRegistro: FormGroup | undefined;
  position: string = '';
  reporteI:  any = [];
  reporteA: any = [];
  area: number = 0;

  constructor(
    private router: Router, 
    private catalogos: Catalogos,
    private service: Auth,
    private formBuilder: FormBuilder,
    private descargarReporteInstancias: reporteService,
    private reportes: Reportes) {}

  ngOnInit(): void {

    this.formularioRegistro = this.formBuilder.group({
      demarcacionI: [''],
      demarcacionA: ['']
    });

    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
    this.area = Number(sessionStorage.getItem('area')!);
    this.moduloClicked = localStorage.getItem('moduloClicked')!;
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.position = sessionStorage.getItem('dir')!;
    this.catalogo_demarcacion();
    this.catalogo_demarcacionA();
  }

    getReporte(){
    this.descargarReporteInstancias.descargarReporteInstancias(this.area,this.tokenSesion).subscribe((blob: Blob) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'Número de Instancias Representativas de Pueblos y Barrios Originarios y Comunidades Indígenas y Afromexicanas Residentes en la Ciudad de México.xlsx';
      link.click();
      window.URL.revokeObjectURL(link.href);
    });
  }

  onValidateInfo() {
    this.router.navigate(['/menu']);
  };

  logout() {
    this.router.navigate(['']);
  }

  catalogo_demarcacion() {
    this.catalogos.getCatalogos(Number(this.area), "cat_demarcacion_territorial", this.tokenSesion).subscribe({
      next: (data) => {
        if(data.cat_demarcacion_territorial.length > 0) {
          this.catalogoDemarcacionI = data.cat_demarcacion_territorial;
        }
      }, error: (err) => {

        Swal.fire("Error al cargar catalogo");

        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };

  catalogo_demarcacionA() {
    this.catalogos.getCatalogos(Number(this.area), "cat_demarcacion_territorial", this.tokenSesion).subscribe({
      next: (data) => {
        if(data.cat_demarcacion_territorial.length > 0) {
          this.catalogoDemarcacionA = data.cat_demarcacion_territorial;
        }
      }, error: (err) => {

        Swal.fire("Error al cargar catalogo");

        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };

  OnChangeGetReporteIndigenas(id: number){
    if(this.opcionDermarcacionI==0){
      this.reportes.getAllRegistrosInd(this.area, this.tokenSesion).subscribe({
      next: (data) => {
        this.reporteI = [data];
      }, error: (err) => {

        Swal.fire("Error al cargar la información");

        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
    }else{
      this.reportes.getRegisterData(1, this.area, this.opcionDermarcacionI, this.tokenSesion).subscribe({
      next: (data) => {
        this.reporteI = [data];
      }, error: (err) => {

        Swal.fire("Error al cargar la información");

        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
    }
  };

  OnChangeGetReporteAfro(id: number) {
    if(this.opcionDermarcacionA==0){
      this.reportes.getAllRegistrosAfro(this.area,this.tokenSesion).subscribe({
      next: (data) => {
        this.reporteA = [data];
      }, error: (err) => {

        Swal.fire("Error al cargar la información");

        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });

    }else{
      this.reportes.getRegisterData(2, this.area, this.opcionDermarcacionA, this.tokenSesion).subscribe({
      next: (data) => {
        this.reporteA = [data];
      }, error: (err) => {

        Swal.fire("Error al cargar la información");

        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });

    }
  };
}
