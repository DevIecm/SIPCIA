import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../../../navbar/navbar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as data from '../../../../labels/label.json';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Reportes } from '../../../../../services/reporteService/reportes';
import { Auth } from '../../../../../services/authService/auth';
import { FormularioDocumentos } from "../../formularios-modulos/formulario-documentos/formulario-documentos";
@Component({
  selector: 'app-documentos-indigenas',
  imports: [
    Navbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormularioDocumentos
],
  templateUrl: './documentos-indigenas.html',
  styleUrl: './documentos-indigenas.css'
})
export class DocumentosIndigenas implements OnInit{

  activeTab: string = 'home';
  data: any = data;

  nombreUser: string = '';
  cargoUser: string = '';
  position: string = '';
  ombreUser: string = '';
  tokenSesion: string = '';
  searchTerm: string = '';

  area_adscripcion: number = 0;
  tipo_usuario: number = 0;
  idformIdSelected: number | undefined;

  dataTable: any = [];
  allDatable: any[] = [];

  showModal = false;

  ngOnInit(): void {
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
    this.position = sessionStorage.getItem('dir')!;
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.area_adscripcion = Number(sessionStorage.getItem('area'));

    this.getRegister();
  }

  constructor(
    private router: Router,
    private reporteService: Reportes,
    private service: Auth
  ) {}
  
  logout() {
    this.router.navigate(['']);
  };

  onValidateInfo() {
    this.router.navigate(['/menu']);
  };

  openModal(id: number | undefined) {
    console.log("najnas")
    this.showModal = true;
    this.idformIdSelected = id;
  }

  closeModal() {
    this.showModal = false;
    this.getRegister();
  }

  getRegister() {
      this.reporteService.getRegisterDataTable(this.area_adscripcion, this.tokenSesion).subscribe({
        next: (data) => {
          if(data.getAfluencia.length > 0) {
            this.dataTable = data.getAfluencia;
            this.allDatable = data.getAfluencia;
          } else {
            Swal.fire("No se encontraron registros");
          }        
        },
        error: (err) => {
  
          if (err.error.code === 160) {
            this.service.cerrarSesionByToken();
          }
  
          if(err.error.code === 100) {
            Swal.fire("No se encontraron registros")
          }
  
        }
      });
    }
}