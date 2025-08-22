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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

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
  dconsulta: string;
  fconsulta: string;
  observaciones: string;
  sdocumentos: string;
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
    dconsulta: "",
    fconsulta: "",
    observaciones: "",
    sdocumentos: "",
  },
  { 
    position: 1,
    edit: "test",
    generar: "test",
    unico: 2134123423,
    demarcacion: "test",
    ncompleto: "test",
    nporiginario: "test",
    npueblo: "",
    nbarrio: "string",
    comunidad: "",
    ut: "",
    nindigena: "test",
    fconsulta: "",
    observaciones: "",
    sdocumentos: "",
    dconsulta: "",
  },
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
    fconsulta: "",
    observaciones: "",
    sdocumentos: "",
    dconsulta: "",
  }
];

@Component({
  selector: 'app-catalogo-acompanamiento',
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
    ReactiveFormsModule,
    MatTableModule, 
    MatPaginatorModule
  ],
  templateUrl: './catalogo-acompanamiento.html',
  styleUrl: './catalogo-acompanamiento.css'
})
export class CatalogoAcompanamiento implements OnInit {
  displayedColumns: string[] = [
    'position',
    'edit',
    'generar',
    'unico',
    'demarcacion',
    'ncompleto',
    'nporiginario',
    'npueblo',
    'nbarrio',
    'comunidad',
    'ut',
    'nindigena',
    'dconsulta'
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  data: any = data;

  ngOnInit(): void {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private router: Router, private formBuilder: FormBuilder) {}
  
  logout() {
    this.router.navigate(['']);
  }

  onSubmit() {
    Swal.fire({
      title: "¿Está seguro que desea registrar la información capturada?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FBB03B",
      cancelButtonColor: "#9D75CA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Se le ha asignado el folio único.",
          text: "5684684641516516-ASSADAS",
          icon: "success",
          confirmButtonText: "Aceptar" 
        });
      }
    });
  };
}
