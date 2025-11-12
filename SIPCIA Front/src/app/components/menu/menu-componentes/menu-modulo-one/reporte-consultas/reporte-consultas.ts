import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { Navbar } from '../../../../navbar/navbar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as data from '../../../../labels/label.json';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormularioConsultas } from "../../formularios-modulos/formulario-consultas/formulario-consultas";
import { Reportes } from '../../../../../services/reporteService/reportes';
import { Auth } from '../../../../../services/authService/auth';
import { reporteService } from '../../../../../services/reportesDescargas/reporteService';

@Component({
  selector: 'app-reporte-consultas',
  imports: [
    Navbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormularioConsultas
  ],
  templateUrl: './reporte-consultas.html',
  styleUrl: './reporte-consultas.css'
})
export class ReporteConsultas implements OnInit {

  dataTable: any = [];
  allDatable: any[] = [];
  selectedIds: number[] = [];

  area_adscripcion: number = 0;
  tipo_usuario: number = 0;
  idRegistroSeleccionado: number | undefined;

  tokenSesion: string = '';
  nombreUser: string = '';
  cargoUser: string = '';
  searchTerm: string = '';
  data: any = data;
  position: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  showModal = false;
  isRegistroC: boolean = false;
  enableButtom: boolean = false;
  
  idSelected: number | undefined;

  ngOnInit(): void {
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
    this.position = sessionStorage.getItem('dir')!;
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.area_adscripcion = Number(sessionStorage.getItem('area'));
    this.getRegister();
  }

  selectRow(id: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    
    if (checkbox.checked) {
      this.enableButtom = true;
      if (!this.selectedIds.includes(id)) {
        this.selectedIds.push(id);
      }
    } else {
      this.enableButtom = false;
      this.selectedIds = this.selectedIds.filter(selectedId => selectedId !== id);
    }
  }

  get isAllSelected(): boolean {
    return this.dataTable.length > 0 && this.selectedIds.length === this.dataTable.length;
  }


  toggleAll(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    
    if (checkbox.checked) {
      this.enableButtom = true;
      this.selectedIds = this.dataTable.map((item: any) => item.id_registro);
    } else {
      this.enableButtom = false;
      this.selectedIds = [];
    }
  }

  descargar2(item: any): void {
    this.miServicio.descargarOtrosNorma(item.enlace_documento, this.tokenSesion).subscribe({
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

  getReporte(){
    if(this.selectedIds.length === 0) {
      this.descargarReporteAtencion.descargarReporteAtencionAll(this.area_adscripcion, this.tokenSesion).subscribe((blob: Blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Reporte de la atención distrital a consultas.xlsx';
        link.click();
        window.URL.revokeObjectURL(link.href);
      });
    } else{
      this.descargarReporteAtencion.descargarReporteAtencion(this.area_adscripcion, this.selectedIds,  this.tokenSesion).subscribe((blob: Blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Reporte de la atención distrital a consultas.xlsx';
        link.click();
        window.URL.revokeObjectURL(link.href);
      });
    }
  }

  constructor(
    private router: Router, 
    private reporteService: Reportes, 
    private descargarReporteAtencion: reporteService,
    private service: Auth,
    private miServicio: Reportes
  ) {}
  
  logout() {
    this.router.navigate(['']);
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

  formatFecha(data: any) {
    const isoDate = data;
    const date = new Date(isoDate);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
    const year = date.getUTCFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }

  getRegister() {
    this.reporteService.getRegisterDataTableConsultas(this.area_adscripcion, this.tokenSesion).subscribe({
      next: (data) => {
        
        if(data.getAtencion.length > 0) {
          this.dataTable = data.getAtencion;
          this.allDatable = data.getAtencion;
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

  search(): void {
    const rawFilter = (this.searchTerm ?? '').trim().toLowerCase();

    if (rawFilter === '') {
      this.dataTable = [...this.allDatable];
      return;
    }

    this.dataTable = this.allDatable.filter((val) => {
      const numero_consecutivo = (val.numero_consecutivo ?? '').toString().toLowerCase().trim();
      const fecha_consulta = (val.fecha_consulta ?? '').toLowerCase().trim();
      const nombre_completo = (val.nombre_completo ?? '').toString().toLowerCase().trim();
      const pueblo_originario = (val.pueblo_originario ?? '').toString().toLowerCase().trim();
      const pueblo = (val.pueblo ?? '').toString().toLowerCase().trim();
      const barrio = (val.barrio ?? '').toString().toLowerCase().trim();
      const ut = (val.ut ?? '').toString().toLowerCase().trim();
      const otro = (val.otro ?? '').toString().toLowerCase().trim();
      const cargo = (val.cargo ?? '').toString().toLowerCase().trim();
      const descripcion_consulta = (val.descripcion_consulta ?? '').toString().toLowerCase().trim();
      const forma_atendio = (val.forma_atendio ?? '').toString().toLowerCase().trim();
      const observaciones = (val.observaciones ?? '').toString().toLowerCase().trim();
      
      return (
        numero_consecutivo.includes(rawFilter) ||
        fecha_consulta.includes(rawFilter) ||
        nombre_completo.includes(rawFilter) ||
        pueblo_originario.includes(rawFilter) ||
        pueblo.includes(rawFilter) ||
        barrio.includes(rawFilter) ||
        ut.includes(rawFilter) ||
        otro.includes(rawFilter) ||
        cargo.includes(rawFilter) ||
        descripcion_consulta.includes(rawFilter) ||
        forma_atendio.includes(rawFilter) ||
        observaciones.includes(rawFilter)
      );
    });
  };

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