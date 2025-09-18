import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { Navbar } from '../../../../navbar/navbar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as data from '../../../../labels/label.json';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { FormularioRegistro } from '../../formularios-modulos/formulario-registro/formulario-registro';
import { FormularioComunitaria } from '../../formularios-modulos/formulario-comunitaria/formulario-comunitaria';
import { Reportes } from '../../../../../services/reporteService/reportes';
import { Auth } from '../../../../../services/authService/auth';
import { reporteService } from '../../../../../services/reportesDescargas/reporteService';

@Component({
  selector: 'app-reporte-comunitaria',
  standalone: true,
  imports: [
    Navbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormularioComunitaria
  ],
  templateUrl: './reporte-comunitaria.html',
  styleUrl: './reporte-comunitaria.css'
})

export class ReporteComunitaria implements OnInit {
  
  @ViewChild('miModal', { static: false }) miModal!: ElementRef;
  @ViewChild('formHijo', { static: false }) formHijo!: FormularioComunitaria;

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
  registroSeleccionadoId: number | null = null;
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

  goToBitacora(id: number, tipo: string) {
    this.router.navigate(['/bitacora', id, tipo]);
  }

  getReporte(){
    this.descargarReporteAfluencia.descargarReporteAfluencia(this.area_adscripcion,this.tokenSesion).subscribe((blob: Blob) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'reporte.xlsx';
      link.click();
      window.URL.revokeObjectURL(link.href);
    });
  }
  
  constructor(
    private router: Router,
    private reporteService: Reportes,
    private service: Auth,
    private descargarReporteAfluencia: reporteService
  ) {}

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

  onValidateInfo() {
    this.router.navigate(['/menu']);
  };

  logout() {
    this.router.navigate(['']);
  }

  openModal(id: number | undefined) {
    this.showModal = true;
    this.idRegistroSeleccionado = id;
  }

  closeModal() {
    this.showModal = false;
    this.getRegister();
  }
}