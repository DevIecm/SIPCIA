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

export class Bitacora implements OnInit, AfterViewInit, OnDestroy {

  private route = inject(ActivatedRoute);
  idRegistro!: number;
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
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.idRegistro = Number(this.route.snapshot.paramMap.get('id'));
    this.tipoBitacora = this.route.snapshot.paramMap.get('tipo') || 'defaultTipo';
    console.log('ID recibido:', this.idRegistro, this.tipoBitacora);
    this.position = sessionStorage.getItem('dir')!;
    this.getBitacora();
  }
  constructor(
    private router: Router,
    private getBitacoraComunidad: bitacoras,
    private getBitacoraAfluencia: bitacoras,
    private getbitacoraLugares: bitacoras,
    private service: Auth,
  ) { }

  ngOnDestroy(): void {

  }
  ngAfterViewInit(): void {

  }
  logout() {
    this.router.navigate(['']);
  }

  onValidateInfo() {
    this.router.navigate(['/menu']);
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

    }
    if (this.tipoBitacora === 'mayorAfluencia') {
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
      console.log("entro aqui");
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
    }
  }
}


