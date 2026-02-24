import { Component, OnInit } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { Router } from '@angular/router';
import { Auth } from '../../services/authService/auth';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-home',
  imports: [Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{

  result: any = [];
  isActive: boolean = false;

  ngOnInit(): void {
    this.getInfo();
    sessionStorage.clear();
  }

  constructor(
    private router: Router, 
    private auth: Auth,
  ) {}

  getInfo() {
    try {
      this.auth.getData(4).subscribe({
        next: (resp) => {
            this.result = resp.estado_sistema;
            this.isActive = resp.estado_sistema[0].estado_sistema;
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

  onSubmit(modulo: number){
    this.router.navigate(['/login']);
    localStorage.setItem('modulo', "1");
  };

  onSubmitModulo2(){
    this.router.navigate(['/login']);
    localStorage.setItem('modulo', "2");
  };

  onSubmitModulo3(){
    this.router.navigate(['/login']);
    localStorage.setItem('modulo', "3");
  };
  
  onSubmitModulo4(){
    this.router.navigate(['/modulo']);
    localStorage.setItem('modulo', "4");
  }; 
} 
