import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { Navbar } from '../../../../navbar/navbar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as data from '../../../../labels/label.json';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { FormularioRegistro } from '../../formularios-modulos/formulario-registro/formulario-registro';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormularioPropuesta } from '../../formularios-modulos/formulario-propuesta/formulario-propuesta';

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
  observaciones: string;
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
    observaciones: ""
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
    observaciones: ""
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
    observaciones: ""
  }
];

@Component({
  selector: 'app-propuesta-comunitaria',
  imports: [
    Navbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormularioPropuesta
  ],
  templateUrl: './propuesta-comunitaria.html',
  styleUrl: './propuesta-comunitaria.css'
})
export class PropuestaComunitaria implements OnInit, AfterViewInit, OnDestroy {
  
  @ViewChild('miModal', { static: false }) miModal!: ElementRef;
  @ViewChild('formHijo', { static: false }) formHijo!: FormularioPropuesta;

  ngAfterViewInit(): void {
    const modalEl = this.miModal.nativeElement;
    modalEl.addEventListener('hidden.bs.modal', this.onModalClosed);
  }

  ngOnDestroy(): void {
    this.miModal.nativeElement.removeEventListener('hidden.bs.modal', this.onModalClosed);
  }

  onModalClosed = () => {
    this.formHijo.resetFormulario();
    // this.getRegister();
  };

  nombreUser: string = '';
  cargoUser: string = '';
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  data: any = data;
  registroSeleccionadoId: number | undefined;
  position: string = '';

  isRegistroC: boolean = false;

  ngOnInit(): void {
    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
    this.position = sessionStorage.getItem('dir')!;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private router: Router) {}
  
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

  abrirModal(id: number, edicion: boolean) {
    console.log("++++++++++++++++"+edicion)
    this.isRegistroC = edicion
    this.registroSeleccionadoId = id;
  }
}