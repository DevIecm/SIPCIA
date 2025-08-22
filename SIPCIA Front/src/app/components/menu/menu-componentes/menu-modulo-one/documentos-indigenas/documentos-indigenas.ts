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
import {MatTabChangeEvent, MatTabsModule} from '@angular/material/tabs';

interface PeriodicElement {
  position: number;
  edit: string;
  generar: string;
  unico: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {  
    position: 1,
    edit: "test",
    generar: "test",
    unico: 2134123423,
  },
  { 
    position: 1,
    edit: "test",
    generar: "test",
    unico: 2134123423,
  },
  { 
    position: 1,
    edit: "test",
    generar: "test",
    unico: 2134123423,
  }
];

@Component({
  selector: 'app-documentos-indigenas',
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
    MatPaginatorModule,
    MatTabsModule
  ],
  templateUrl: './documentos-indigenas.html',
  styleUrl: './documentos-indigenas.css'
})
export class DocumentosIndigenas implements OnInit{

  muestraBuscar: boolean = false;
  selectedTabIndex = 0;

  displayedColumns: string[] = [
    'position',
    'edit',
    'generar',
    'unico'
  ];

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  data: any = data;
  formularioRegistro: FormGroup | undefined;

  ngOnInit(): void {
    this.formularioRegistro = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    console.log(this.selectedTabIndex)
    if(this.selectedTabIndex = 0){
      this.muestraBuscar = true;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private router: Router, private formBuilder: FormBuilder) {}
  
  logout() {
    this.router.navigate(['']);
  };

  tabChanged(event: MatTabChangeEvent) {

    this.selectedTabIndex = event.index;

    console.log(this.selectedTabIndex)
    console.log(this.selectedTabIndex)
    if(this.selectedTabIndex = 0){
      this.muestraBuscar = true;
    } else {
      this.muestraBuscar = false;
    }
  };

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
