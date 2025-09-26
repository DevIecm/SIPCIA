import { Component, Input, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/authService/auth';
import { sha256 } from 'js-sha256';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    Navbar, 
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login implements OnInit {

  username = "";
  password = "";
  formularioLogin: FormGroup | undefined;
  textoFormulario: string = "";
  tipoUsuario: number | number = 0;

  ngOnInit() {
    sessionStorage.removeItem('key');
    if(localStorage.getItem("modulo") === "1" ){
      this.textoFormulario = "Acceso Distrital";
    } else if(localStorage.getItem("modulo") === "2"){
      this.textoFormulario = "Acceso DEOEyG";
    } else if(localStorage.getItem("modulo") === "3"){
      this.textoFormulario = "Acceso Áreas Ejecutivas y Técnicas";
    } else if(localStorage.getItem("modulo") === "4"){
      this.textoFormulario = "Inscripción de datos de contacto de instancias representarivas autoridades tradicionales";
    }

    this.formularioLogin = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.tipoUsuario = Number(localStorage.getItem("modulo"));
    
    sessionStorage.removeItem('key');
    sessionStorage.removeItem('dir');
    sessionStorage.removeItem('tipoUsuario');
    sessionStorage.removeItem('nameUsuario');
  }

  constructor(private router: Router, private formBuilder: FormBuilder, private auth: Auth) {}

  onSubmit() {
    try {
      if(this.formularioLogin?.valid){
        
         this.auth.login(this.formularioLogin?.value.username, sha256(this.formularioLogin?.value.password), this.tipoUsuario).subscribe({
           next: (res) => {
             sessionStorage.setItem("key", res.token);
             sessionStorage.setItem("dir", res.userData[0].adscripcion_usuario);
             sessionStorage.setItem("tipoUsuario", res.userData[0].tipo_usuario);
             sessionStorage.setItem("nameUsuario", res.userData[0].nombre_usuario);
             sessionStorage.setItem("cargo_usuario", res.userData[0].cargo_usuario);
             sessionStorage.setItem("id_usuario", res.userData[0].id);
             sessionStorage.setItem("area", res.userData[0].area_adscripcion);
             sessionStorage.setItem("cabecera", res.userData[0].distrito);
             
            if(this.tipoUsuario === 1) {
              this.router.navigate(['/menu']);
            } else if(this.tipoUsuario === 2) {
              this.router.navigate(['/menutwo']);
            }
             
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
       } else {
         Swal.fire({
           icon: "error",
           title: "Error",
           text: "Es necesario llenar el formulario",
         });
      // }
  }
    } catch (error) {
      console.error("Error al iniciar sesión", error);
    }
  }
}