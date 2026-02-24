import { AfterViewInit, inject, Component, ElementRef, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import * as data from '../../../labels/label.json';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Navbar } from '../../../navbar/navbar';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { bitacoras } from '../../../../services/bitacoraService/bitacoras';
import { Auth } from '../../../../services/authService/auth';
@Component({
  selector: 'app-bitacora',
  imports: [Navbar, CommonModule,
    ReactiveFormsModule,
    FormsModule],
  standalone: true,
  templateUrl: './bitacora.html',
  styleUrl: './bitacora.css'
})

export class Bitacora implements OnInit {

  private route = inject(ActivatedRoute);
  idRegistro!: number;
  tipoUsuario: number | number = 0;
  tipoBitacora!: string;
  nombreUser: string = '';
  cargoUser: string = '';
  data: any = data;
  dataTable: any = [];
  tokenSesion: string = '';
  searchTerm: string = '';
  allDatable: any[] = [];
  infoUpdate: any = [];
  position: string = '';
  tipo_usuario: number = 0;
  registroSeleccionadoId: number | undefined;

  ngOnInit() {
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.idRegistro = Number(this.route.snapshot.paramMap.get('id'));
    this.tipoBitacora = this.route.snapshot.paramMap.get('tipo') || 'defaultTipo';

    this.position = sessionStorage.getItem('dir')!;
    this.tipoUsuario = Number(localStorage.getItem("modulo"));
    this.getBitacora();
  }
  constructor(
    private router: Router,
    private getBitacoraComunidad: bitacoras,
    private getbitacoraInstituciones: bitacoras,
    private getBitacoraAfluencia: bitacoras,
    private getbitacoraLugares: bitacoras,
    private service: Auth,
  ) { }

  logout() {
    this.router.navigate(['']);
  }

  formatFecha(data: any) {
    const isoDate = data;
    const date = new Date(isoDate);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }

  formatHora(isoDate: string): string {
  if (!isoDate) return "";

  const hora = isoDate.split("T")[1].split(".")[0];
  return hora;
}


  onValidateInfo() {
    this.router.navigate(['/inicio']);
    if(this.tipoUsuario === 1) {
      this.router.navigate(['/inicio']);
    } else if(this.tipoUsuario === 2) {
      this.router.navigate(['/inicio']);
    }
  };

  getBitacora() {

    if (this.tipoBitacora === 'lugaresAsambleas') {
      this.getbitacoraLugares.getbitacoraLugares(this.idRegistro, this.tokenSesion).subscribe({
        next: (data) => {
          if (data.getbitacoraLugares.length > 0) {
            this.dataTable = data.getbitacoraLugares;
          } else {
            Swal.fire("No se encontraron registros");
          }
        },
        error: (err) => {

          if (err.error.code === 160) {
            this.service.cerrarSesionByToken();
          }

          if (err.error.code === 100) {
            Swal.fire("No se encontraron registros")
          }

        }
      });

    } if (this.tipoBitacora === 'mayorAfluencia') {
        this.getBitacoraAfluencia.getBitacoraAfluencia(this.idRegistro, this.tokenSesion).subscribe({
          next: (data) => {
            if (data.getbitacoraAfluencia.length > 0) {
              this.dataTable = data.getbitacoraAfluencia;
            } else {
              Swal.fire("No se encontraron registros");
            }
          },
          error: (err) => {

            if (err.error.code === 160) {
              this.service.cerrarSesionByToken();
            }

            if (err.error.code === 100) {
              Swal.fire("No se encontraron registros")
            }

          }
        });

    } if (this.tipoBitacora === 'directorio') {
        this.getBitacoraComunidad.getBitacoraComunidad(this.idRegistro, this.tokenSesion).subscribe({
          next: (data) => {
            if (data.bitacora.length > 0) {
              this.dataTable = data.bitacora;
            } else {
              Swal.fire("No se encontraron registros");
            }
          },
          error: (err) => {

            if (err.error.code === 160) {
              this.service.cerrarSesionByToken();
            }

            if (err.error.code === 100) {
              Swal.fire("No se encontraron registros")
            }

          }
        });
    } if (this.tipoBitacora === 'catInstituciones') {
      this.getbitacoraInstituciones.getbitacoraInstituciones(this.idRegistro, this.tokenSesion).subscribe({
        next: (data) => {
          if (data.getbitacoraInstituciones.length > 0) {
            this.dataTable = data.getbitacoraInstituciones;
          } else {
            Swal.fire("No se encontraron registros");
          }
        },
        error: (err) => {

          if (err.error.code === 160) {
            this.service.cerrarSesionByToken();
          }

          if (err.error.code === 100) {
            Swal.fire("No se encontraron registros")
          }

        }
      });

    }
  }
}


