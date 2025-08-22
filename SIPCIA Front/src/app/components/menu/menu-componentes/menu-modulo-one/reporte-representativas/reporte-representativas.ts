import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../../../navbar/navbar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import * as data from '../../../../labels/label.json';
import { MatTableDataSource } from '@angular/material/table';

interface PeriodicElement {
  position: number;
  edit: string;
  generar: string;
  unico: number;
  demarcacion: string;
  ncompleto: string;
  nporiginario: string;
  npueblo: string;
  nbarrio: string;
  comunidad: string;
  ut: string;
  nindigena: string;
  nrepresentativa: string;
  cinstancia: string;
  domicilio: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  
  {  
    position: 1,
    edit: "test",
    generar: "test",
    unico: 2134123423,
    demarcacion: "test",
    ncompleto: "test",
    nporiginario: "test",
    npueblo: "test",
    nbarrio: "string",
    comunidad: "",
    ut: "",
    nindigena: "test",
    nrepresentativa: "test",
    cinstancia: "test",
    domicilio: "test",
  },
];

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-reporte-representativas',
  imports: [
    Navbar, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './reporte-representativas.html',
  styleUrl: './reporte-representativas.css'
})
export class ReporteRepresentativas implements OnInit{

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];
  data: any = data;
  nombreUser: string = '';
  cargoUser: string = '';
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);


  constructor(private router: Router, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
  }

  onValidateInfo() {
    this.router.navigate(['/menu']);
  };

  logout() {
    this.router.navigate(['']);
  }
}
