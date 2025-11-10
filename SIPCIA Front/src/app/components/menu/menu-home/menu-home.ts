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

  //Modulo 2

  goToRegistroTwo() {
    this.router.navigate(['nregistro-deoeyg']);
    localStorage.setItem('moduloClicked', '2.1');
  }
  
  goToDIndigenasTwo() {
    localStorage.setItem('moduloClicked', '2.2');
    this.router.navigate(['dirndigenas-deoeyg']);
  }

  goToDAfroTwo() {
    localStorage.setItem('moduloClicked', '2.3');
    this.router.navigate(['dafroamericanas-deoeyg']);
  }

  goToCTecinas() {
    this.router.navigate(['ctecnicas-deoeyg']);
  }

  goToCAfro() {
    this.router.navigate(['cafro-deoeyg']);
  }
  
  goToRRepre() {
    this.router.navigate(['rrepresentativas-deoeyg']);
  }

  goToRComunitaria() {
    this.router.navigate(['rcomunitaria-deoeyg']);
  }
  
  goToPCom() {
    this.router.navigate(['pcomunitarias-deoeyg']);
  }
  
  goToRC() {
    this.router.navigate(['rconsultas-deoeyg']);
  }
  
  goToCA() {
    this.router.navigate(['cacmpa-deoeyg']);
  }

  goToDI() {
    this.router.navigate(['dindigenas-deoeyg']);
  }

  goToDAf() {
    this.router.navigate(['dafro-deoeyg']);
  }

  //Modulo 3

  goToRegister() {
    this.router.navigate(['/moduloRegistro']);
  }
}
