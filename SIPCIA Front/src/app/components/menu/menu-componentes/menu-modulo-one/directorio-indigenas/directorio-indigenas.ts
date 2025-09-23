import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { Navbar } from '../../../../navbar/navbar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as data from '../../../../labels/label.json';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { FormularioRegistro } from '../../formularios-modulos/formulario-registro/formulario-registro';
import { Register } from '../../../../../services/registerService/register';
import { reporteService } from '../../../../../services/reportesDescargas/reporteService';
import { Auth } from '../../../../../services/authService/auth';

@Component({
  selector: 'app-directorio-indigenas',
  imports: [
    Navbar, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormularioRegistro
  ],
  templateUrl: './directorio-indigenas.html',
  styleUrl: './directorio-indigenas.css'
})
export class DirectorioIndigenas implements OnInit {

  showModal = false;

  goToBitacora(id: number, tipo: string) {
    this.router.navigate(['/bitacora', id, tipo]);
  }
  getReporte(){
    this.descargarReporte.descargarReporte(1,this.area,this.tokenSesion).subscribe((blob: Blob) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'reporte.xlsx';
      link.click();
      window.URL.revokeObjectURL(link.href);
    });
  }
  
  nombreUser: string = '';
  cargoUser: string = '';
  data: any = data;
  tokenSesion: string = '';
  dataTable: any = [];
  searchTerm: string = '';
  allDatable: any[] = [];
  position: string = '';  
  area: number = 0;
  tipo_usuario: number = 0;
  registroSeleccionadoId: number | undefined;

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
    private descargarReporte: reporteService,
    private service: Auth
  ) {}
  
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
      const folio = (val.folio ?? '').toString().toLowerCase().trim();
      const nombre = (val.nombre_completo ?? '').toLowerCase().trim();
      const pueblo = (val.pueblo ?? '').toLowerCase().trim();
      const comunidad = (val.comunidad ?? '').toLowerCase().trim();

      return (
        folio.includes(rawFilter) ||
        nombre.includes(rawFilter) ||
        pueblo.includes(rawFilter) ||
        comunidad.includes(rawFilter)
      );
    });
  };

  getRegister() {
    this.serviceRegister.getRegisterData(1, this.area, this.tokenSesion).subscribe({
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

  onValidateInfo() {
    this.router.navigate(['/menu']);
  };

  openModal(id: number | undefined) {
    this.showModal = true;
    this.registroSeleccionadoId = id;
  }

  closeModal() {
    this.showModal = false;
    this.getRegister();
  }
}
