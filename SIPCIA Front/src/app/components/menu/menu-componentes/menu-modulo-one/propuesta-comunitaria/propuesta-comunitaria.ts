import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Navbar } from '../../../../navbar/navbar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as data from '../../../../labels/label.json';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { FormularioPropuesta } from '../../formularios-modulos/formulario-propuesta/formulario-propuesta';
import { Reportes } from '../../../../../services/reporteService/reportes';
import { Auth } from '../../../../../services/authService/auth';

@Component({
  selector: 'app-propuesta-comunitaria',
  imports: [
    Navbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormularioPropuesta
  ],
  templateUrl: './propuesta-comunitaria.html',
  styleUrl: './propuesta-comunitaria.css'
})
export class PropuestaComunitaria implements OnInit {

  @ViewChild('miModal', { static: false }) miModal!: ElementRef;
  @ViewChild('formHijo', { static: false }) formHijo!: FormularioPropuesta;

  nombreUser: string = '';
  cargoUser: string = '';
  tokenSesion: string = '';
  position: string = '';
  searchTerm: string = '';

  dataTable: any = [];
  allDatable: any[] = [];

  area_adscripcion: number = 0;
  tipo_usuario: number = 0;
  idRegistroSeleccionado: number | undefined;

  data: any = data;
  showModal = false;

  isRegistroC: boolean = false;

  ngOnInit(): void {
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
    this.position = sessionStorage.getItem('dir')!;
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.area_adscripcion = Number(sessionStorage.getItem('area'));

    this.getRegister();
  }

  search(): void {
    const rawFilter = (this.searchTerm ?? '').trim().toLowerCase();

    if (rawFilter === '') {
      this.dataTable = [...this.allDatable];
      return;
    }

    this.dataTable = this.allDatable.filter((val) => {
      const direccion_distrital = (val.direccion_distrital ?? '').toString().toLowerCase().trim();
      const domicilio_lugar = (val.domicilio_lugar ?? '').toLowerCase().trim();

      return (
        direccion_distrital.includes(rawFilter) ||
        domicilio_lugar.includes(rawFilter)
      );
    });
  };

  constructor(
    private router: Router, 
    private reporteService: Reportes,
    private service: Auth
  ) {}
  
  logout() {
    this.router.navigate(['']);
  }

  getRegister() {
    this.reporteService.getRegisterDataTableComunitaria(this.area_adscripcion, this.tokenSesion).subscribe({
      next: (data) => {
        if(data.getLugares.length > 0) {
          this.dataTable = data.getLugares;
          this.allDatable = data.getLugares;
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

  onValidateInfo() {
    this.router.navigate(['/menu']);
  };

  openModal(id: number | undefined) {
    this.showModal = true;
    this.idRegistroSeleccionado = id;
  }

  closeModal() {
    this.showModal = false;
    this.getRegister();
  }
}