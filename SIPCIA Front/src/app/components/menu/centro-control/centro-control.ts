import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Navbar } from '../../navbar/navbar';
import * as data from '../../../..//app/components/labels/label.json';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-centro-control',
  imports: [
    Navbar, 
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './centro-control.html',
  styleUrl: './centro-control.css'
})
export class CentroControl {

  formularioRegistro: FormGroup | undefined;

  data: any = data;

  nombreUser: string = '';
  cargoUser: string = '';
  currentTime: string= '';
  today: string = '';
  position: string = '';
  tokenSesion: string = '';

  demarcacion: number = 0;
  distrito: number = 0;
  tipo_usuario: number = 0;
  area: string = '';
  id_usuario: number = 0; 

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}  


  ngOnInit(): void {
    this.formularioRegistro = this.formBuilder.group({
      nombre_completo: ['', Validators.required],
      seccion_electoral: ['', Validators.required],
      demarcacion: [''],
      duninominal: [{ value: '', disabled: true }],
      scomunidad: [''],
      ncomunidad: ['', Validators.required],

      ooriginario: [''],
      pueblo: [''],
      barrio: [''],
      uterritorial: [''],
      comunidad: [''],
      otro: [''],

      pueblor: [''],
      comunidadr: [''],
      organizacion: [''],
      prelevante: [''],
      otror: [''],

      ninstancia: ['', Validators.required],
      cinstancia: ['', Validators.required],
      domicilio: ['', Validators.required],
      tfijo: ['', [Validators.pattern('^[0-9]+$')]],
      tcelular: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      docs: [{ value: '', disabled: true }],
      coficial: ['', [Validators.email]],
      cpersonal: ['', [Validators.required, Validators.email]],
    });

    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.position = sessionStorage.getItem('dir')!;
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.area = sessionStorage.getItem('area')!;
    this.id_usuario = Number(sessionStorage.getItem('id_usuario')!);

  }

  
  onValidateInfo() {
    if (this.formularioRegistro?.dirty){
      Swal.fire({
        title: "Seguro que desea salir?",
        icon: "warning",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        confirmButtonColor: "#FBB03B",
        cancelButtonColor: "#9D75CA",
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/menu']);
        }
      });
    } else {
      this.router.navigate(['/menutwo']);
    }
  };

  logout() {
    this.router.navigate(['']);
  };

}
