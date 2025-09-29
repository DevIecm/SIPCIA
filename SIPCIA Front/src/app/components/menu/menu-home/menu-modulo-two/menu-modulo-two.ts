import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as data from '../../../labels/label.json';
import { Navbar } from '../../../navbar/navbar';

@Component({
  selector: 'app-menu-modulo-two',
  imports: [
    Navbar, 
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './menu-modulo-two.html',
  styleUrl: './menu-modulo-two.css'
})
export class MenuModuloTwo implements OnInit{

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

  goControl() {
    this.router.navigate(['ccontrol'])
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
    this.router.navigate(['nregistrotwo']);
  }
  
  goToDIndigenasTwo() {
    this.router.navigate(['dirndigenastwo']);
  }

  goToDAfroTwo() {
    this.router.navigate(['dafroamericanastwo']);
  }

  goToCTecinas() {
    this.router.navigate(['ctecnicas']);
  }

  goToCAfro() {
    this.router.navigate(['cafro']);
  }
  
  goToRRepre() {
    this.router.navigate(['rrepresentativastwo']);
  }

  goToRComunitaria() {
    this.router.navigate(['rcomunitariatwo']);
  }
  
  goToPCom() {
    this.router.navigate(['pcomunitariastwo']);
  }
  
  goToRC() {
    this.router.navigate(['rconsultastwo']);
  }
  
  goToCA() {
    this.router.navigate(['cacmpatwo']);
  }

  goToDI() {
    this.router.navigate(['dindigenastwo']);
  }

  goToDAf() {
    this.router.navigate(['dafrotwo']);
  }
}