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
      this.showModulo1 = true;
      this.showModulo2 = false;
      this.showModulo3 = false;
      this.showModulo4 = false;
    } else if(this.moduloSelected === "2"){
      this.showModulo2 = true;
      this.showModulo1 = false;
      this.showModulo3 = false;
      this.showModulo4 = false;
    } else if(this.moduloSelected === "3"){
      this.showModulo3 = true;
      this.showModulo1 = false;
      this.showModulo2 = false;
      this.showModulo4 = false;
    } else if(this.moduloSelected === "4"){
      this.showModulo4 = true;
      this.showModulo2 = false;
      this.showModulo3 = false;
      this.showModulo1 = false;
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
    this.router.navigate(['nuevo-registro']);
  }

  goToDIndigenas(){
    localStorage.setItem('moduloClicked', '1.2');
    this.router.navigate(['directorio-instancias-indigenas']);
  }

  goToDAfro(){
    localStorage.setItem('moduloClicked', '1.3');
    this.router.navigate(['directorio-instancias-afromexicanas']);
  }

  goToRepresentativas(){
    this.router.navigate(['reporte-instancias-representativas']);
  }

  goToRComunitarias(){
    this.router.navigate(['registro-lugares-mayor-afluencia-comunitaria']);
  }

  goToPComunitaria(){
    this.router.navigate(['propuesta-lugares-asambleas-comunitarias']);
  }

  goToRConsultas(){
    this.router.navigate(['reporte-atencion-distrital-consultas']);
  }

  goToCAcompanamiento(){
    this.router.navigate(['catalogo-instituciones-personas']);
  }

  goToDNIndigenas(){
    this.router.navigate(['documentos-consultas-indigenas']);
  }

  goToDNIAfro(){
    this.router.navigate(['documentos-consultas-afromexicanas']);
  }

  //Modulo 2

  goToRegistroTwo() {
    this.router.navigate(['nuevo-registro-deoeyg']);
    localStorage.setItem('moduloClicked', '2.1');
  }
  
  goToDIndigenasTwo() {
    localStorage.setItem('moduloClicked', '2.2');
    this.router.navigate(['directorio-general-comunidades-indigenas']);
  }

  goToDAfroTwo() {
    localStorage.setItem('moduloClicked', '2.3');
    this.router.navigate(['directorio-general-comunidades-afromexicanas']);
  }

  goToCTecinas() {
    this.router.navigate(['consulta-datos-iecm']);
  }

  goToCAfro() {
    this.router.navigate(['consulta-datos-intancias']);
  }
  
  goToRRepre() {
    this.router.navigate(['reporte-instancias-representativas-deoeyg']);
  }

  goToRComunitaria() {
    this.router.navigate(['registro-lugares-mayor-afluencia-comunitaria-deoeyg']);
  }
  
  goToPCom() {
    this.router.navigate(['propuesta-lugares-asambleas-comunitarias-deoeyg']);
  }
  
  goToRC() {
    this.router.navigate(['reporte-atencion-distrital-consultas-deoeyg']);
  }
  
  goToCA() {
    this.router.navigate(['catalogo-instituciones-personas-deoeyg']);
  }

  goToDI() {
    this.router.navigate(['documentos-consultas-indigenas-deoeyg']);
  }

  goToDAf() {
    this.router.navigate(['documentos-consultas-afromexicanas-deoeyg']);
  }

  //Modulo 3

  goToRegister() {
    this.router.navigate(['/registro-iecm']);
  }

  goControl() {
    this.router.navigate(['centro-control'])
  }
}