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
import { reporteService } from '../../../../../services/reportesDescargas/reporteService';

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
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
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

   getReporte(){
    this.descargarReporteAsamblea.descargarReporteAsamblea(this.area_adscripcion,this.tokenSesion).subscribe((blob: Blob) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'reporte.xlsx';
      link.click();
      window.URL.revokeObjectURL(link.href);
    });
  }


  goToBitacora(id: number, tipo: string) {
    this.router.navigate(['/bitacora', id, tipo]);
  }

  search(): void {
    const rawFilter = (this.searchTerm ?? '').trim().toLowerCase();

    if (rawFilter === '') {
      this.dataTable = [...this.allDatable];
      return;
    }

    console.log(this.allDatable)

    this.dataTable = this.allDatable.filter((val) => {
      const id_registro = (val.id_registro ?? '').toString().toLowerCase().trim();
      const fecha_registro = (val.fecha_registro ?? '').toString().toLowerCase().trim();
      const demarcacion_territorial = (val.demarcacion_territorial ?? '').toString().toLowerCase().trim();
      const lugar_espacio = (val.lugar_espacio ?? '').toLowerCase().trim();
      const domicilio = (val.domicilio ?? '').toLowerCase().trim();
      const intitucion_propietaria = (val.intitucion_propietaria ?? '').toLowerCase().trim();
      const superficie_espacio = (val.superficie_espacio ?? '').toString().toLowerCase().trim();
      const aforo = (val.aforo ?? '').toString().toLowerCase().trim();
      const observaciones = (val.observaciones ?? '').toLowerCase().trim();

      return (
        id_registro.includes(rawFilter) ||
        fecha_registro.includes(rawFilter) ||
        demarcacion_territorial.includes(rawFilter) ||
        lugar_espacio.includes(rawFilter) ||
        domicilio.includes(rawFilter) ||
        intitucion_propietaria.includes(rawFilter) ||
        superficie_espacio.includes(rawFilter) ||
        aforo.includes(rawFilter) ||
        observaciones.includes(rawFilter)
      );
    });
  };

  constructor(
    private router: Router, 
    private reporteService: Reportes,
    private descargarReporteAsamblea: reporteService,
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
}