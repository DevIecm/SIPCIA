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

  @ViewChild('miModal', { static: false }) miModal!: ElementRef;
  @ViewChild('formHijo', { static: false }) formHijo!: FormularioConsultas;

  dataTable: any = [];
  allDatable: any[] = [];

  area_adscripcion: number = 0;
  tipo_usuario: number = 0;
  idRegistroSeleccionado: number | undefined;

  tokenSesion: string = '';
  nombreUser: string = '';
  cargoUser: string = '';
  searchTerm: string = '';
  data: any = data;
  position: string = '';

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

  constructor(
    private router: Router, 
    private reporteService: Reportes, 
    private service: Auth
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
      const nombre_completo = (val.nombre_completo ?? '').toString().toLowerCase().trim();
      const fecha_consulta = (val.fecha_consulta ?? '').toLowerCase().trim();

      return (
        fecha_consulta.includes(rawFilter) ||
        nombre_completo.includes(rawFilter)
      );
    });
  };

}