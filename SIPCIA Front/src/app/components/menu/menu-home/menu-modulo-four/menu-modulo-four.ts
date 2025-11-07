import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as data from '../../../labels/label.json';
import { Navbar } from '../../../navbar/navbar';
import { FormBuilder } from '@angular/forms';
import { Auth } from '../../../../services/authService/auth';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-menu-modulo-four',
  standalone: true,
  imports: [
    Navbar,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './menu-modulo-four.html',
  styleUrl: './menu-modulo-four.css'
})
export class MenuModuloFour implements OnInit{
  

  nombreUser: string = '';
  cargoUser: string = '';
  data: any = data;
  captchaValido = false;
  position: string = '';
  token: string | null = null;
  moduloSelected = localStorage.getItem('modulo');
  
  showModulo1: boolean = false;
  showModulo2: boolean = false;
  showModulo3: boolean = false;
  showModulo4: boolean = false;
  mostrarPantalla: boolean = false;

  tipoUsuario: number | number = 0;
  idRegistroSeleccionado: number | undefined;
  idComunidadSeleccionado: number | undefined;
  
  ngOnInit(): void {
    this.mostrarPantalla = true;

    if(this.moduloSelected === "1"){
      this.showModulo1 = !this.showModulo1;
    } else if(this.moduloSelected === "2"){
      this.showModulo2 = !this.showModulo2;
    } else if(this.moduloSelected === "3"){
      this.showModulo3 = !this.showModulo3;
    } else if(this.moduloSelected === "4"){
      this.showModulo4 = !this.showModulo4;
    };

    localStorage.removeItem('moduloClicked');
    this.tipoUsuario = Number(localStorage.getItem("modulo"));
    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
    this.position = sessionStorage.getItem('dir')!;
  }

  constructor(private router: Router, private formBuilder: FormBuilder, private auth: Auth) {}

  onVerify(token: string) {
    console.log('Token recibido:', token);
    this.token = token;
  }

  onExpired() {
    console.log('hCaptcha expirado');
    this.token = null;
  }

  onError(err: any) {
    console.error('Error hCaptcha:', err);
    this.token = null;
  }

  goToRegister() {

    const user = "110198831a426807bccd9dbdf54b6dcb5298bc5d31ac49069e0ba3d210d970ae";
    const pass = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";

    try {

      this.auth.loginEncrypted(user, pass, this.tipoUsuario).subscribe({
        next: (res) => {
          sessionStorage.setItem("key", res.token);
          sessionStorage.setItem("dir", res.userData[0].adscripcion_usuario);
          sessionStorage.setItem("tipoUsuario", res.userData[0].tipo_usuario);
          sessionStorage.setItem("nameUsuario", res.userData[0].nombre_usuario);
          sessionStorage.setItem("cargo_usuario", res.userData[0].cargo_usuario);
          sessionStorage.setItem("id_usuario", res.userData[0].id);
          sessionStorage.setItem("area", res.userData[0].area_adscripcion);
          sessionStorage.setItem("cabecera", res.userData[0].distrito);

          this.router.navigate(['/moduloRegisterFour']);
        },
          error: (err) => {
            if(err.error.code === 401){
              Swal.fire({
                icon: "error",
                title: "Usuario inactivo",
                text: "Por favor contacta al Administrador del Sistema",
              });
            } else if(err.error.code === 101) {
              Swal.fire({
                icon: "error",
                title: "Usuario no encontrado",
                text: "Por favor contacta al Administrador del Sistema",
              });
            }
          }
      });
    } catch (error) {
      console.error("Error al iniciar sesión", error);
    }
  }

  logout() {
    this.router.navigate(['']);
  }

  cambiarPantalla(){
    this.mostrarPantalla = false;
  }
}