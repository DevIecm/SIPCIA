import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Navbar } from '../../../../navbar/navbar';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import * as data from '../../../../labels/label.json';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { FomularioRegistroTwo } from '../../formularios-modulos/fomulario-registro-two/fomulario-registro-two';
import { Reportes } from '../../../../../services/reporteService/reportes';
import { Auth } from '../../../../../services/authService/auth';
import { reporteService } from '../../../../../services/reportesDescargas/reporteService';
import { Catalogos } from '../../../../../services/catService/catalogos';
import { Register } from '../../../../../services/registerService/register';

@Component({
  selector: 'app-nregistro',
  imports: [
    Navbar, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FomularioRegistroTwo
  ],
  providers: [DatePipe],
  standalone: true,
  templateUrl: './consulta-tecnicas.html',
  styleUrls: ['./consulta-tecnicas-two.css']
})

export class ConsultaTecnicas implements OnInit {

  formularioRegistro: FormGroup | undefined;

  nombreUser: string = '';
  cargoUser: string = '';
  tokenSesion: string = '';
  position: string = '';
  searchTerm: string = '';
  sortColumn: string = '';  
  moduloClicked: string = '';

  sortDirection: 'asc' | 'desc' = 'asc';

  dataTable: any = [];
  allDatable: any[] = [];
  catalogoComunidad: any = [];

  area_adscripcion: number = 0;
  tipo_usuario: number = 0;
  idComunidad: number = 0;

  data: any = data;
  idRegistroSeleccionado: number | undefined;
  idComunidadSeleccionado: number | undefined;
  
  showModal = false;
  isRegistroC: boolean = false;


  ngOnInit(): void {
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
    this.position = sessionStorage.getItem('dir')!;
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.area_adscripcion = Number(sessionStorage.getItem('area'));
    this.moduloClicked = localStorage.getItem('modulo')!;


    this.formularioRegistro = this.formBuilder.group({
      comunidad: [null],
      searchTerm: ['']
    });

    this.catalogo_comunidad();
    this.getRegisterTwo(1)
    localStorage.setItem('comunidad', '1');
    this.idComunidad = Number(localStorage.getItem('comunidad'));
  }

  goToBitacora(id: number, tipo: string) {
    this.router.navigate(['/bitacora', id, tipo]);
  }

  catalogo_comunidad() {
    this.catalogos.getCatalogos(Number(this.area_adscripcion), "cat_comunidad", this.tokenSesion).subscribe({
      next: (data) => {
      
        if (data.cat_comunidad.length > 0) {
          this.catalogoComunidad = data.cat_comunidad;

          const primerId = this.catalogoComunidad[0].id;
          this.formularioRegistro?.get('comunidad')?.setValue(primerId);
        }
      },
    });
  };
  
  getReporte(){
    const selectedId = this.formularioRegistro?.get('comunidad')?.value;
    if (selectedId == 1) {
    //descarga comunidad Indigena
      this.descargarReporte.descargarReporte(1, null, 3, this.tokenSesion).subscribe((blob: Blob) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'Directorio de Instancias Representativas de Pueblos, Barrios y Comunidades Indígenas.xlsx';
      link.click();
      window.URL.revokeObjectURL(link.href);
    });
    } else {
      this.descargarReporte.descargarReporteAfro(2, null, 3, this.tokenSesion).subscribe((blob: Blob) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'Directorio de Instancias Representativas de Pueblos, Barrios y Comunidades Afromexicanas.xlsx';
      link.click();
      window.URL.revokeObjectURL(link.href);
    });
  }}
 
  search(): void {
    const rawFilter = this.formularioRegistro?.get('searchTerm')?.value.trim().toLowerCase();

    if (rawFilter === '') {
      this.dataTable = [...this.allDatable];
      return;
    }

    this.dataTable = this.allDatable.filter((val) => {
      const id_registro = (val.id_registro ?? '').toString().toLowerCase().trim();
      const nombre_completo = (val.nombre_completo ?? '').toString().toLowerCase().trim();
      const pueblo_originario = (val.pueblo_originario ?? '').toString().toLowerCase().trim();
      const pueblo = (val.pueblo ?? '').toString().toLowerCase().trim();
      const barrio = (val.barrio ?? '').toString().toLowerCase().trim();
      const ut = (val.ut ?? '').toString().toLowerCase().trim();
      const otro  = (val.otro ?? '').toString().toLowerCase().trim();
      const comunidad = (val.comunidad ?? '').toString().toLowerCase().trim();
      const interes_profesional = (val.interes_profesional ?? '').toString().toLowerCase().trim();
      const nombre_institucion = (val.nombre_institucion ?? '').toString().toLowerCase().trim();
      const npueblo = (val.npueblo ?? '').toString().toLowerCase().trim();
               
      return (
        id_registro.includes(rawFilter) ||
        nombre_completo.includes(rawFilter) ||
        pueblo_originario.includes(rawFilter) ||
        pueblo.includes(rawFilter) ||
        barrio.includes(rawFilter) ||
        ut.includes(rawFilter) ||
        otro.includes(rawFilter) ||
        comunidad.includes(rawFilter) ||
        interes_profesional.includes(rawFilter) ||
        nombre_institucion.includes(rawFilter) ||
        npueblo.includes(rawFilter)
      );
    });
  };

  constructor(
    private router: Router,
    private reporteService: Reportes,
    private descargarReporte: reporteService,
    private miServicio: Reportes,
    private catalogos: Catalogos,
    private formBuilder: FormBuilder,
    private service: Auth,
    private registerService: Register) {}

  descargar2(item: any): void {
    this.miServicio.descargarOtrosNorma(item.cv_enlace, this.tokenSesion).subscribe({
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

  getRegisterTwo(tipo_comunidad: number) {
    this.registerService.getRegisterData(tipo_comunidad, null, 3, this.tokenSesion).subscribe({
      next: (data) => {
        if(data.comunidades.length > 0) {
          this.dataTable = data.comunidades;
          this.allDatable = data.comunidades;
        } else {
          this.dataTable = [];
          Swal.fire("No se encontraron registros");
        }
      },
      error: (err) => {

        this.dataTable = [];

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

    this.idComunidadSeleccionado = this.idComunidad;
  }

  closeModal() {
    this.showModal = false;
    this.getRegisterTwo(this.idComunidad);
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

  cambiaComunidad(event: Event): void {
    const selectedId = this.formularioRegistro?.get('comunidad')?.value;
    localStorage.setItem('comunidad', selectedId);
    this.idComunidad = selectedId;
    this.getRegisterTwo(selectedId);
  }
}