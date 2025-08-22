import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../../../navbar/navbar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as data from '../../../../labels/label.json';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { FormularioRegistro } from '../../formularios-modulos/formulario-registro/formulario-registro';
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
    nrepresentativa: "",
    cinstancia: "test",
    domicilio: "test",
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
    nrepresentativa: "test",
    cinstancia: "test",
    domicilio: "test",
  }
];


@Component({
  selector: 'app-directorio-indigenas',
  imports: [
    Navbar, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormularioRegistro
  ],
  templateUrl: './directorio-indigenas.html',
  styleUrl: './directorio-indigenas.css'
})
export class DirectorioIndigenas implements OnInit{
  nombreUser: string = '';
  cargoUser: string = '';
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  data: any = data;

  ngOnInit(): void {
    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
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

  onValidateInfo() {
    this.router.navigate(['/menu']);
  };
}
