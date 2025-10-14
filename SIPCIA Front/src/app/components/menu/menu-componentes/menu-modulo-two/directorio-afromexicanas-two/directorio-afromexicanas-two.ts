import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Navbar } from '../../../../navbar/navbar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as data from '../../../../labels/label.json';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { FormularioRegistro } from '../../formularios-modulos/formulario-registro/formulario-registro';
import { Register } from '../../../../../services/registerService/register';
import { Auth } from '../../../../../services/authService/auth';
import { reporteService } from '../../../../../services/reportesDescargas/reporteService';

@Component({
  selector: 'app-directorio-afromexicanas-two',
  imports: [
    Navbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormularioRegistro
  ],
  templateUrl: './directorio-afromexicanas-two.html',
  styleUrl: './directorio-afromexicanas-two.css'
})
export class DirectorioAfromexicanasTwo implements OnInit {
  
  showModal = false;

  goToBitacora(id: number, tipo: string) {
    this.router.navigate(['/bitacora', id, tipo]);
  }
    getReporte(){
    //descarga comunidad Afro
        this.descargarReporteAfro.descargarReporteAfro(2, null, 1, this.tokenSesion).subscribe((blob: Blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'reporte.xlsx';
        link.click();
        window.URL.revokeObjectURL(link.href);
      });
    }

  nombreUser: string = '';
  sortColumn: string = '';
  tokenSesion: string = '';
  searchTerm: string = '';
  position: string = '';  
  sortDirection: 'asc' | 'desc' = 'asc';
  cargoUser: string = '';

  data: any = data;
  dataTable: any = [];
  allDatable: any[] = [];

  tipo_usuario: number = 0;
  registroSeleccionadoId: number | undefined;
  area: number = 0;

  ngOnInit(): void {
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.area = Number(sessionStorage.getItem('area')!);
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.position = sessionStorage.getItem('dir')!;
    this.getRegister();
  }

  constructor(
    private router: Router, 
    private serviceRegister: Register,
    private descargarReporteAfro: reporteService,
    private service: Auth) {}
  
  logout() {
    this.router.navigate(['']);
  }

  search(): void {
    const rawFilter = (this.searchTerm ?? '').trim().toLowerCase();

    if (rawFilter === '') {
      this.dataTable = [...this.allDatable];
      return;
    }

    this.dataTable = this.allDatable.filter((val) => {
      const id_registro = (val.id_registro ?? '').toString().toLowerCase().trim();
      const folio = (val.folio ?? '').toString().toLowerCase().trim();
      const demarcacion_territorial = (val.demarcacion_territorial ?? '').toLowerCase().trim();
      const nombre_completo = (val.nombre_completo ?? '').toLowerCase().trim();
      const pueblo_originario = (val.pueblo_originario ?? '').toLowerCase().trim();
      const pueblo = (val.pueblo_afro ?? '').toLowerCase().trim();
      const barrio = (val.barrio ?? '').toLowerCase().trim();
      const comunidad = (val.comunidad_afro ?? '').toLowerCase().trim();
      const unidad_territorial = (val.unidad_territorial ?? '').toLowerCase().trim();
      const nombre_comunidad = (val.nombre_comunidad ?? '').toLowerCase().trim();
      const nombre_instancia = (val.nombre_instancia ?? '').toLowerCase().trim();
      const cargo_instancia = (val.cargo_instancia ?? '').toLowerCase().trim();
      const domicilio = (val.domicilio ?? '').toLowerCase().trim();

      return (
        id_registro.includes(rawFilter) ||
        folio.includes(rawFilter) ||
        demarcacion_territorial.includes(rawFilter) ||
        nombre_completo.includes(rawFilter) ||
        pueblo_originario.includes(rawFilter) ||
        pueblo.includes(rawFilter) ||
        barrio.includes(rawFilter) ||
        comunidad.includes(rawFilter) ||
        unidad_territorial.includes(rawFilter) ||
        nombre_comunidad.includes(rawFilter) ||
        nombre_instancia.includes(rawFilter) ||
        cargo_instancia.includes(rawFilter) ||
        domicilio.includes(rawFilter)
      );
    });
  }

  getRegister() {
    this.serviceRegister.getRegisterData(2, null, 1, this.tokenSesion).subscribe({
      next: (data) => {
        if(data.comunidades.length > 0) {
          this.dataTable = data.comunidades;
          this.allDatable = data.comunidades;
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

  openModal(id: number | undefined) {
    this.showModal = true;
    this.registroSeleccionadoId = id;
  }

  closeModal() {
    this.showModal = false;
    this.getRegister();
  }

  onValidateInfo() {
    this.router.navigate(['/menutwo']);
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
