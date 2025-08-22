import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../../../navbar/navbar';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Footer } from '../../../../footer/footer';
import * as data from '../../../../labels/label.json';
import Swal from 'sweetalert2';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-nuevo-registro',
  imports: [
    Navbar, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
  templateUrl: './nuevo-registro.html',
  styleUrl: './nuevo-registro.css',
})

export class NuevoRegistro implements OnInit{
  nombreUser: string = '';
  cargoUser: string = '';
  currentTime: string= '';
  today: string = '';
  
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

  data: any = data;
  formularioRegistro: FormGroup | undefined;
  seleccionado: any;
  myDate: string | number | Date | undefined;

  constructor(private router: Router, private formBuilder: FormBuilder, private datePipe: DatePipe) {}  


  ngOnInit(): void {
    this.formularioRegistro = this.formBuilder.group({
      nombreCompleto: ['', Validators.required],
      selctoral: ['', Validators.required],
      demarcacion: ['', Validators.required],
      duninominal: ['', Validators.required],
      scomunidad: [''],
      ncomunidad: ['', Validators.required],

      ooriginario: ['', Validators.required],
      pueblo: ['', Validators.required],
      barrio: ['', Validators.required],
      uterritorial: ['', Validators.required],
      comunidad: ['', Validators.required],
      otro: [''],

      pueblor: ['', Validators.required],
      comunidadr: ['', Validators.required],
      organizacion: ['', Validators.required],
      prelevante: [''],
      otror: [''],

      ninstancia: ['', Validators.required],
      cinstancia: ['', Validators.required],
      domicilio: ['', Validators.required],
      tfijo: ['', Validators.required],
      tcelular: ['', Validators.required],
      docs: [''],
      coficial: ['', Validators.required],
      cpersonal: ['', Validators.required],
    });

    this.currentTime = this.datePipe.transform(new Date(), 'HH:mm:ss') + ' hrs.';
    this.today = this.datePipe.transform(new Date(), 'dd/MM/yyyy')!;
    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
  }

  logout() {
    this.router.navigate(['']);
  }

  onValidateInfo() {
    if (this.formularioRegistro?.dirty){
      Swal.fire({
        title: "Seguro que desea salir?",
        icon: "warning",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        confirmButtonColor: "#FBB03B",
        cancelButtonColor: "#9D75CA",
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/menu']);
        }
      });
    } else {
      this.router.navigate(['/menu']);
    }
  };
  
  saveForm() {
    if (this.formularioRegistro?.valid) {

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
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#FBB03B",
        });
      }
    });

    } else {
      Swal.fire({
        text: "Llenar todos los campos obligatorios",
        showConfirmButton: false,
        
      });
    }
  };
  
  resetData() {
    this.formularioRegistro?.reset();
  };
}