import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../../../navbar/navbar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as data from '../../../../labels/label.json';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-documentos-indigenas',
  imports: [
    Navbar, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './documentos-indigenas.html',
  styleUrl: './documentos-indigenas.css'
})
export class DocumentosIndigenas implements OnInit{

  data: any = data;

  nombreUser: string = '';
  cargoUser: string = '';
  position: string = '';

  ngOnInit(): void {
    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
    this.position = sessionStorage.getItem('dir')!;
  }

  constructor(private router: Router, private formBuilder: FormBuilder) {}
  
  logout() {
    this.router.navigate(['']);
  };

  onValidateInfo() {
    this.router.navigate(['/menu']);
  };
}
