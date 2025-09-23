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
  selector: 'app-directorio-afroamericanas',
  imports: [
    Navbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormularioRegistro
  ],
  templateUrl: './directorio-afroamericanas.html',
  styleUrl: './directorio-afroamericanas.css'
})
export class DirectorioAfroamericanas implements OnInit, AfterViewInit, OnDestroy {
  
  @ViewChild('miModal', { static: false }) miModal!: ElementRef;
  @ViewChild('formHijo', { static: false }) formHijo!: FormularioRegistro;

  ngAfterViewInit(): void {
    const modalEl = this.miModal.nativeElement;
    modalEl.addEventListener('hidden.bs.modal', this.onModalClosed);
  }

  ngOnDestroy(): void {
    this.miModal.nativeElement.removeEventListener('hidden.bs.modal', this.onModalClosed);
  }
  goToBitacora(id: number, tipo: string) {
    this.router.navigate(['/bitacora', id, tipo]);
  }
    getReporte(){
    this.descargarReporteAfro.descargarReporteAfro(2,this.area,this.tokenSesion).subscribe((blob: Blob) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'reporte.xlsx';
      link.click();
      window.URL.revokeObjectURL(link.href);
    });
  }

  onModalClosed = () => {
    this.formHijo.resetFormulario();
    this.getRegister();
  };

  nombreUser: string = '';
  cargoUser: string = '';
  data: any = data;
  dataTable: any = [];
  tokenSesion: string = '';
  searchTerm: string = '';
  allDatable: any[] = [];
  position: string = '';
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
      const folio = (val.folio ?? '').toString().toLowerCase().trim();
      const nombre = (val.nombre_completo ?? '').toLowerCase().trim();
      const pueblo = (val.pueblo_afro ?? '').toLowerCase().trim();
      const comunidad = (val.comunidad ?? '').toLowerCase().trim();
      const organizacion = (val.organizacion_afro ?? '').toLowerCase().trim();

      return (
        folio.includes(rawFilter) ||
        nombre.includes(rawFilter) ||
        pueblo.includes(rawFilter) ||
        comunidad.includes(rawFilter) ||
        organizacion.includes(rawFilter)
      );
    });
  }

  getRegister() {
    this.serviceRegister.getRegisterData(2, this.area, this.tokenSesion).subscribe({
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

  abrirModal(id: number) {
    this.registroSeleccionadoId = id;
  }

  onValidateInfo() {
    this.router.navigate(['/menu']);
  };
}
