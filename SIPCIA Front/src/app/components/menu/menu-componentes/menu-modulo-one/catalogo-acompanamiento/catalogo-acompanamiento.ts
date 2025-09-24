import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Navbar } from '../../../../navbar/navbar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as data from '../../../../labels/label.json';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { FormularioRegistroa } from '../../formularios-modulos/formulario-registroa/formulario-registroa';
import { Reportes } from '../../../../../services/reporteService/reportes';
import { Auth } from '../../../../../services/authService/auth';
import { reporteService } from '../../../../../services/reportesDescargas/reporteService';

@Component({
  selector: 'app-catalogo-acompanamiento',
  imports: [
    Navbar,
    CommonModule,
    FormsModule,
    FormularioRegistroa
  ],
  templateUrl: './catalogo-acompanamiento.html',
  styleUrl: './catalogo-acompanamiento.css'
})
export class CatalogoAcompanamiento implements OnInit {

  @ViewChild('miModal', { static: false }) miModal!: ElementRef;
  @ViewChild('formHijo', { static: false }) formHijo!: FormularioRegistroa;
  
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

  data: any = data;
  idRegistroSeleccionado: number | undefined;
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
    this.descargarReporteInstitucion.descargarReporteInstitucion(this.area_adscripcion,this.tokenSesion).subscribe((blob: Blob) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'reporte.xlsx';
      link.click();
      window.URL.revokeObjectURL(link.href);
    });
  }

 
  search(): void {
    const rawFilter = (this.searchTerm ?? '').trim().toLowerCase();

    if (rawFilter === '') {
      this.dataTable = [...this.allDatable];
      return;
    }

    this.dataTable = this.allDatable.filter((val) => {
      const nombre_completo = (val.nombre_completo ?? '').toString().toLowerCase().trim();

      return (
        nombre_completo.includes(rawFilter)      
      );
    });
  };

  constructor(
    private router: Router,
    private reporteService: Reportes,
    private descargarReporteInstitucion: reporteService,
    private service: Auth) {}

  onSubmit() {
    Swal.fire({
      title: "¿Está seguro que desea registrar la información capturada?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FBB03B",
      cancelButtonColor: "#9D75CA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Se le ha asignado el folio único.",
          text: "5684684641516516-ASSADAS",
          icon: "success",
          confirmButtonText: "Aceptar" 
        });
      }
    });
  };

  getRegister() {
    this.reporteService.getRegisterDataTableAcompa(this.area_adscripcion, this.tokenSesion).subscribe({
      next: (data) => {
        if(data.getInstituciones.length > 0) {
          this.dataTable = data.getInstituciones;
          this.allDatable = data.getInstituciones;
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