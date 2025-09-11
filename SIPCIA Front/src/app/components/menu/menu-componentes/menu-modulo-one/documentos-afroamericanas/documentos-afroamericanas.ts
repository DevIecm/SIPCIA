import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../../../navbar/navbar';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as data from '../../../../labels/label.json';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-documentos-afroamericanas',
  imports: [
    Navbar, 
    MatCardModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatGridListModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './documentos-afroamericanas.html',
  styleUrl: './documentos-afroamericanas.css'
})

export class DocumentosAfroamericanas implements OnInit{
  activeTab: string = 'home';

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
