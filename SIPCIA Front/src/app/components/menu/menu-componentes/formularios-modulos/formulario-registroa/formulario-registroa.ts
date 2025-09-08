import { Input, Component, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import * as data from '../../../../labels/label.json';
import Swal from 'sweetalert2';
import { Register } from '../../../../../services/registerService/register';
import { Auth } from '../../../../../services/authService/auth';
import { Catalogos } from '../../../../../services/catService/catalogos';
import { Reportes } from '../../../../../services/reporteService/reportes';

@Component({
  selector: 'app-formulario-registroa',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
  templateUrl: './formulario-registroa.html',
  styleUrl: './formulario-registroa.css'
})
export class FormularioRegistroa {

  @Input() idRegistro!: number;
  @Input() idRegistroC!: boolean;
  @Output() formSaved = new EventEmitter<void>();

  formularioRegistro: FormGroup | undefined;

  catalogoDemarcacion: any = [];

  opcionDemarcacion: any = null;
  tokenSesion: string = '';
  today: string = '';
  area: string = '';

  tipo_usuario: number = 0;

  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.previewImage();
    }
  }

  previewImage(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreviewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  constructor(
    private catalogos: Catalogos,
    private service: Auth,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private registerService: Reportes
  ) {}

  saveForm(){
    try {
      if(this.idRegistroC) {
        Swal.fire({
          title: "¿Está seguro que desea guardar estos cambios?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#FBB03B",
          cancelButtonColor: "#9D75CA",
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar"
        }).then((result) => {

          if (!this.formularioRegistro) {
            return;
          }

          if (result.isConfirmed) {

            const datosFormularioCompletos = {
              odc_demarcacion: 12,
              demarcacion_territorial: this.formularioRegistro.get('demarcacion')?.value || null,
              denominacion_lugar: this.formularioRegistro.get('denominacionl')?.value || null,
              domicilio_lugar: this.formularioRegistro.get('domiciliol')?.value || null,
              foto: 0,
              enlace_foto: "ruta/documento",
              ubicacion: '0',
              enlace_ubicacion: "ruta/ubicacion",
              observaciones: this.formularioRegistro.get('domiciliol')?.value || null,
              usuario_registro: 1,
              modulo_registro: this.tipo_usuario,
              estado_registro: 1,
              tipo_usuario: this.tipo_usuario
            };

            this.registerService.insertaRegistro(datosFormularioCompletos, this.tokenSesion).subscribe({
              next: (data) => {
                if(data.code === 200) {
                  Swal.fire({
                    title: "Se le ha asignado el folio único.",
                    text: data.folio,
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#FBB03B",
                  });
                  this.resetData();
                }
              }, error: (err) => {
                
                if(err.error.code === 160) {
                  this.service.cerrarSesionByToken();
                }
    
                if(err.error.code === 100) {
                  Swal.fire("Error al registrar");
                }
              }
            });

          }
        });
      } else {
        Swal.fire({
          title: "¿Está seguro que desea guardar estos cambios?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#FBB03B",
          cancelButtonColor: "#9D75CA",
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.isConfirmed) {

            if (!this.formularioRegistro) {
              return;
            }

            const datosFormularioCompletos = {
              odc_demarcacion: 12,
              demarcacion_territorial: this.formularioRegistro.get('demarcacion')?.value || null,
              denominacion_lugar: this.formularioRegistro.get('denominacionl')?.value || null,
              domicilio_lugar: this.formularioRegistro.get('domiciliol')?.value || null,
              foto: 0,
              enlace_foto: "ruta/documento",
              ubicacion: '0',
              enlace_ubicacion: "ruta/ubicacion",
              observaciones: this.formularioRegistro.get('domiciliol')?.value || null,
              usuario_registro: 1,
              modulo_registro: 1,
              estado_registro: 1,
              tipo_usuario: this.tipo_usuario
            };

            this.registerService.insertaRegistro(datosFormularioCompletos, this.tokenSesion).subscribe({
              next: (data) => {
                if(data.code === 200) {
                  Swal.fire({
                    title: "Se le ha asignado el folio único.",
                    text: data.folio,
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#FBB03B",
                  });
                  this.resetData();
                }
              }, error: (err) => {
                
                if(err.error.code === 160) {
                  this.service.cerrarSesionByToken();
                }
    
                if(err.error.code === 100) {
                  Swal.fire("Error al registrar");
                }
              }
            });
          }
        });
      }
    } catch(e) {
      console.error(e);
    }
  }

  resetData() {
    this.formularioRegistro?.reset();
  };

  resetFormulario() {   
    this.formularioRegistro?.patchValue({
      demarcacion: null,    
    });
  }

  ngOnInit() {
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.today = this.datePipe.transform(new Date(), 'dd/MM/yyyy')!;
    this.area = sessionStorage.getItem('area')!;
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);

    this.formularioRegistro = this.formBuilder.group({
      dDistrital: [{ value:'', disabled: true}],
      demarcacion: [''],
      denominacionl: [''],
      domiciliol: [''],
      observaciones: ['']
    });

    this.catalogo_demarcacion();
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.tokenSesion = sessionStorage.getItem('key')!;

    if(changes['idRegistro'] && changes['idRegistro'].currentValue) {
      this.catalogo_demarcacion();
    }

    if(changes['idRegistroC'] && changes['idRegistroC'].currentValue) {
      this.catalogo_demarcacion();
    }
  }

  catalogo_demarcacion() {
    this.catalogos.getCatalogos("cat_demarcacion_territorial", this.tokenSesion).subscribe({
      next: (data) => {
        if(data.cat_demarcacion_territorial.length > 0) {
          this.catalogoDemarcacion = data.cat_demarcacion_territorial;
        }
      }, error: (err) => {
        
        Swal.fire("Error al cargar catalogo");

        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };
}
