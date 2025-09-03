import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { Navbar } from '../../../../navbar/navbar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as data from '../../../../labels/label.json';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormularioRegistroa } from '../../formularios-modulos/formulario-registroa/formulario-registroa';
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
    position: 2,
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
    position: 3,
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
    CommonModule,
    FormsModule,
    FormularioRegistroa
  ],
  templateUrl: './catalogo-acompanamiento.html',
  styleUrl: './catalogo-acompanamiento.css'
})
export class CatalogoAcompanamiento implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('miModal', { static: false }) miModal!: ElementRef;
  @ViewChild('formHijo', { static: false }) formHijo!: FormularioRegistroa;

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
    this.isRegistroC = edicion
    this.registroSeleccionadoId = id;
  }
}