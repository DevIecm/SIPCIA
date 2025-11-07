import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as data from '../../../labels/label.json';
import { Navbar } from '../../../navbar/navbar';

@Component({
  selector: 'app-menu-modulo-three',
  imports: [
    Navbar, 
    MatCardModule,
    CommonModule
  ],
  templateUrl: './menu-modulo-three.html',
  styleUrl: './menu-modulo-three.css'
})
export class MenuModuloThree implements OnInit{

  nombreUser: string = '';
  cargoUser: string = '';
  data: any = data;
  moduloSelected = localStorage.getItem('modulo');
  showModulo1: boolean = false;
  showModulo2: boolean = false;
  showModulo3: boolean = false;
  showModulo4: boolean = false;
  position: string = '';

  showModal = false;
  isRegistroC: boolean = false;

  idRegistroSeleccionado: number | undefined;
  idComunidadSeleccionado: number | undefined;
  
  ngOnInit(): void {

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
    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
    this.position = sessionStorage.getItem('dir')!;
  }

  constructor(private router: Router) {}

  goToRegister() {
    this.router.navigate(['/moduloRegister']);
  }

  logout() {
    this.router.navigate(['']);
  }
}