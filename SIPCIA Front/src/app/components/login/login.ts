import { Component, Input, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/authService/auth';
import { sha256 } from 'js-sha256';
import { Decrypt } from '../../services/decrypt';

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

    sessionStorage.clear();
    this.LoginForm();
    
    if(localStorage.getItem("modulo") === "1" ){
      this.textoFormulario = "Acceso Distrital";
    } else if(localStorage.getItem("modulo") === "2"){
      this.textoFormulario = "Acceso DEOEyG";
    } else if(localStorage.getItem("modulo") === "3"){
      this.textoFormulario = "Acceso Áreas Ejecutivas y Técnicas";
    } else if(localStorage.getItem("modulo") === "4"){
      this.textoFormulario = "Inscripción de datos de contacto de instancias representarivas autoridades tradicionales";
    }

    this.tipoUsuario = Number(localStorage.getItem("modulo"));
  }

  constructor(
    private router: Router, 
    private formBuilder: FormBuilder, 
    private auth: Auth,
    private crypt: Decrypt
  ) {}

  LoginForm() {
    this.formularioLogin = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    try {
      if(this.formularioLogin?.valid){
        this.auth.login(this.formularioLogin?.value.username, sha256(this.formularioLogin?.value.password), this.tipoUsuario).subscribe({
          next: (resp) => {

            const res = this.crypt.decryptResponse(resp.data);
            sessionStorage.setItem("key", res.token);
            sessionStorage.setItem("dir", res.userData.adscripcion_usuario);
            sessionStorage.setItem("tipoUsuario", res.userData.tipo_usuario);
            sessionStorage.setItem("nameUsuario", res.userData.nombre_usuario);
            sessionStorage.setItem("cargo_usuario", res.userData.cargo_usuario);
            sessionStorage.setItem("id_usuario", res.userData.id);
            sessionStorage.setItem("area", res.userData.area_adscripcion);
            sessionStorage.setItem("cabecera", res.userData.distrito); 
            sessionStorage.setItem("doc1", res.userData.documento_1);
            sessionStorage.setItem("doc2", res.userData.documento_2);
            sessionStorage.setItem("doc3", res.userData.documento_3);
            sessionStorage.setItem("doc4", res.userData.documento_4);
            sessionStorage.setItem("doc5", res.userData.documento_5);
            sessionStorage.setItem("doc6", res.userData.documento_6);
            sessionStorage.setItem("doc7", res.userData.documento_7);
            sessionStorage.setItem("modDoc", res.userData.modDoc);
            this.router.navigate(['/inicio']);
             
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
      }
    } catch (error) {
      console.error("Error al iniciar sesión", error);
    }
  }
}