import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../navbar/navbar';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import * as data from '../../labels/label.json';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-home',
  imports: [
    Navbar, 
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './menu-home.html',
  styleUrl: './menu-home.css'
})
export class MenuHome implements OnInit{
  nombreUser: string = '';
  cargoUser: string = '';
  data: any = data;
  moduloSelected = localStorage.getItem('modulo');
  showModulo1: boolean = false;
  showModulo2: boolean = false;
  showModulo3: boolean = false;
  showModulo4: boolean = false;
  position: string = '';
  
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

  logout() {
    this.router.navigate(['']);
  }

  goToRegistro(){
    this.router.navigate(['nregistro']);
  }

  goToDIndigenas(){
    localStorage.setItem('moduloClicked', '1.2');
    this.router.navigate(['dindigenas']);
  }

  goToDAfro(){
    localStorage.setItem('moduloClicked', '1.3');
    this.router.navigate(['dafroamericanas']);
  }

  goToRepresentativas(){
    this.router.navigate(['representativas']);
  }

  goToRComunitarias(){
    this.router.navigate(['rcomunitaria']);
  }

  goToPComunitaria(){
    this.router.navigate(['pcomunitaria']);
  }

  goToRConsultas(){
    this.router.navigate(['rconsultas']);
  }

  goToCAcompanamiento(){
    this.router.navigate(['cacompanamiento']);
  }

  goToDNIndigenas(){
    this.router.navigate(['dnindigenas']);
  }

  goToDNIAfro(){
    this.router.navigate(['dnafroamericanas']);
  }

}
