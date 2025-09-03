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

  constructor(
    private router: Router, 
    private catalogos: Catalogos,
    private service: Auth,
    private formBuilder: FormBuilder,
    private reportes: Reportes) {}

  ngOnInit(): void {

    this.formularioRegistro = this.formBuilder.group({
      demarcacionI: [''],
      demarcacionA: ['']
    });

    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
    this.moduloClicked = localStorage.getItem('moduloClicked')!;
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.position = sessionStorage.getItem('dir')!;
    this.catalogo_demarcacion();
    this.catalogo_demarcacionA();
  }

  onValidateInfo() {
    this.router.navigate(['/menu']);
  };

  logout() {
    this.router.navigate(['']);
  }

  catalogo_demarcacion() {
    this.catalogos.getCatalogos("cat_demarcacion_territorial", this.tokenSesion).subscribe({
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
    this.catalogos.getCatalogos("cat_demarcacion_territorial", this.tokenSesion).subscribe({
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

    this.reportes.getRegisterData(id, this.opcionDermarcacionI, this.tokenSesion).subscribe({
      next: (data) => {
        this.reporteI = [data];
      }, error: (err) => {

        Swal.fire("Error al cargar la información");

        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };

  OnChangeGetReporteAfro(id: number) {
    this.reportes.getRegisterData(id, this.opcionDermarcacionA, this.tokenSesion).subscribe({
      next: (data) => {
        this.reporteA = [data];
      }, error: (err) => {

        Swal.fire("Error al cargar la información");

        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };
}
