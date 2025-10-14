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
  selector: 'app-registro-comunitaria',
  imports: [
    Navbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormularioComunitaria
  ],
  templateUrl: './registro-comunitaria.html',
  styleUrl: './registro-comunitaria.css'
})
export class RegistroComunitaria implements OnInit {
  
  nombreUser: string = '';
  cargoUser: string = '';
  tokenSesion: string = '';
  position: string = '';
  searchTerm: string = '';
  sortColumn: string = '';

  sortDirection: 'asc' | 'desc' = 'asc';

  dataTable: any = [];
  allDatable: any[] = [];

  area_adscripcion: number = 0;
  tipo_usuario: number = 0;
  
  idRegistroSeleccionado: number | undefined;
  registroSeleccionadoId: number | null = null;
  
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
    private descargarReporteAfluencia: reporteService,
    private miServicio: Reportes
  ) {}

  search(): void {
    const rawFilter = (this.searchTerm ?? '').trim().toLowerCase();

    if (rawFilter === '') {
      this.dataTable = [...this.allDatable];
      return;
    }

    this.dataTable = this.allDatable.filter((val) => {
      const direccion_distrital = (val.direccion_distrital ?? '').toString().toLowerCase().trim();
      const distrito = (val.distrito_cabecera ?? '').toString().toLowerCase().trim();
      const demarcacion_territorial = (val.demarcacion_territorial ?? '').toString().toLowerCase().trim();
      const denominacion_lugar = (val.denominacion_lugar ?? '').toLowerCase().trim();
      const domicilio_lugar = (val.domicilio_lugar ?? '').toLowerCase().trim();
      const observaciones = (val.observaciones ?? '').toLowerCase().trim();
      const fecha_registro = (val.fecha_registro ?? '').toString().toLowerCase().trim();

      return (
        direccion_distrital.includes(rawFilter) ||
        distrito.includes(rawFilter) ||
        demarcacion_territorial.includes(rawFilter) ||
        denominacion_lugar.includes(rawFilter) ||
        domicilio_lugar.includes(rawFilter) ||
        observaciones.includes(rawFilter) ||
        fecha_registro.includes(rawFilter)
      );
    });
  };

  formatFecha(data: any) {
    const isoDate = data;
    const date = new Date(isoDate);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }
  
  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.dataTable.sort((a: any, b: any) => {
      const valueA = a[column] ?? '';
      const valueB = b[column] ?? '';

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return this.sortDirection === 'asc'
          ? (valueA > valueB ? 1 : -1)
          : (valueA < valueB ? 1 : -1);
      }
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'bi bi-arrow-down-up';
    return this.sortDirection === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
  }
  
  descargar(item: any): void {
    this.miServicio.descargarDocumento(item.enlace_ubicacion, this.tokenSesion).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        a.download =item.nombre_archivo;

        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error al descargar archivo:', err)
    });
  }

  getRegister() {
    this.reporteService.getRegisterDataTable(null, this.tokenSesion).subscribe({
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
    this.router.navigate(['/menutwo']);
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