import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as data from '../../../../labels/label.json';
import Swal from 'sweetalert2';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-formulario-registro',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
  templateUrl: './formulario-registro.html',
  styleUrl: './formulario-registro.css'
})
export class FormularioRegistro implements OnInit{
  
  currentTime: string= '';
  today: string = '';
  moduloClicked: string = '';
  afro: boolean = false;
  indigenas: boolean = false;
  
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
      folio: [{ value: '', disabled: true }],
      nombreCompleto: ['', Validators.required],
      selctoral: ['', Validators.required],
      demarcacion: ['', Validators.required],
      duninominal: ['', Validators.required],
      scomunidad: [{ value: '', disabled: this.indigenas}],
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
    this.moduloClicked = localStorage.getItem('moduloClicked')!;
    if(this.moduloClicked === '1.2') {
      console.log('Modulo 1.2 clicked');
      this.afro = false;
      this.indigenas = true;
      console.log(this.indigenas);
    } else if(this.moduloClicked === '1.3') {
      console.log('Modulo 1.3 clicked');
      this.afro = true;
      this.indigenas = false;
    }

    if (this.indigenas) {
      this.formularioRegistro.get('scomunidad')?.disable();
    }
  }

  onValidateInfo() {
    if (this.formularioRegistro?.dirty){
      Swal.fire({
        title: "Información válida",
        text: "Seguro que desea salir?",
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
        title: "¿Está seguro que desea Editar la Instacia?",
        text: "Se sobrescribirán los datos actuales.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FBB03B",
        cancelButtonColor: "#9D75CA",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Se han guardado correctamente los cambios.",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#FBB03B"
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
