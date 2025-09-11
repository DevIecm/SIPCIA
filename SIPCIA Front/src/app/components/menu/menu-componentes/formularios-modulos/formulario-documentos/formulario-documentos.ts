import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Catalogos } from '../../../../../services/catService/catalogos';
import { Auth } from '../../../../../services/authService/auth';
import { Reportes } from '../../../../../services/reporteService/reportes';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-documentos',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
  templateUrl: './formulario-documentos.html',
  styleUrl: './formulario-documentos.css'
})
export class FormularioDocumentos {

  @Input() isOpen = false;
  @Input() idRegistroC: any;
  @Input() formId : number | undefined;
  @Output() close = new EventEmitter<void>();

  formularioRegistro: FormGroup | undefined;

  catalogoDemarcacion: any = [];
  infoUpdate: any = [];

  opcionDemarcacion: any = null;

  tokenSesion: string = '';
  today: string = '';
  labelTitle: string = '';
  
  area: number = 0;
  id_usuario: number = 0;
  cabecera: number = 0;
  tipo_usuario: number = 0;

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
              distrito_electoral: this.area,
              distrito_cabecera: this.cabecera,
              demarcacion_territorial: Number(this.formularioRegistro.get('demarcacion_territorial')?.value) || null,
              denominacion_lugar: this.formularioRegistro.get('denominacion_lugar')?.value || null,
              domicilio_lugar: this.formularioRegistro.get('domicilio_lugar')?.value || null,
              foto: 0,
              enlace_foto: "ruta/documento",
              ubicacion: 0,
              enlace_ubicacion: "ruta/ubicacion",
              observaciones: this.formularioRegistro.get('observaciones')?.value || null,
              usuario_registro: this.id_usuario,
              modulo_registro: this.tipo_usuario,
              estado_registro: 1,
              tipo_usuario: this.tipo_usuario
            };

            this.registerService.insertaRegistro(datosFormularioCompletos, this.tokenSesion).subscribe({
              next: (data) => {
                if(data.code === 200) {
                  Swal.fire({
                    title: "Se ha registrado correctamente.",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#FBB03B",
                  });

                  setTimeout(() => {
                    this.onClose();
                    this.resetData();
                  }, 3000);

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
              distrito_electoral: this.area,
              distrito_cabecera: this.cabecera,
              demarcacion_territorial: this.formularioRegistro.get('demarcacion_territorial')?.value || null,
              denominacion_lugar: this.formularioRegistro.get('denominacion_lugar')?.value || null,
              domicilio_lugar: this.formularioRegistro.get('domicilio_lugar')?.value || null,
              foto: 0,
              enlace_foto: "ruta/documento",
              ubicacion: 0,
              enlace_ubicacion: "ruta/ubicacion",
              observaciones: this.formularioRegistro.get('observaciones')?.value || null,
              usuario_registro: this.id_usuario,
              modulo_registro: this.tipo_usuario,
              estado_registro: 1,
              tipo_usuario: this.tipo_usuario
            };

            this.registerService.updateRegistro(datosFormularioCompletos, this.tokenSesion).subscribe({
              next: (data) => {
                if(data.code === 200) {
                  Swal.fire({
                    title: "Se han guardado correctamentelos cambios.",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#FBB03B",
                  });

                  setTimeout(() => {
                    this.onClose();
                    this.resetData();
                  }, 3000);
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

  ngOnInit() {
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.today = this.datePipe.transform(new Date(), 'dd/MM/yyyy')!;
    this.area = Number(sessionStorage.getItem('area')!);
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.cabecera = Number(sessionStorage.getItem('cabecera'));
    this.id_usuario = Number(sessionStorage.getItem('id_usuario'));

    this.formularioRegistro = this.formBuilder.group({
      dDistrital: [{ value:'', disabled: true}],
      demarcacion: ['', [Validators.required]],
      lugar_espacio: ['', [Validators.required]],
      intitucion_propietaria: ['', [Validators.required]],
      domicilio: ['', [Validators.required]],
      superficie_espacio: ['', [Validators.required]],
      aforo: ['', [Validators.required]],
      observaciones: [''],
      anterioridad: ['', [Validators.required]],
      prestamo: ['', [Validators.required]],
      ventilacion: ['', [Validators.required]],
      consecutivo: [{value: '', disabled: true}]
    });

    this.catalogo_demarcacion();

    if(this.formId === 1){
      this.idRegistroC = true;
      this.labelTitle = 'Ficha técnica de la reunión de trabajo con instancias representativas y autoridades tradicionales de forma previa a la realización de las asambleas comunitarias.';
      this.getDataById(1);
    } else {
      this.labelTitle = 'Ficha técnica de la reunión de trabajo con instancias representativas y autoridades tradicionales de forma previa a la realización de las asambleas comunitarias.';
      this.idRegistroC = false
      this.getDataById(2);
    }
  }

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    this.onClose();
  }

  getDataById(id: number) {
    try {
      if (this.formId) return;

      this.registerService.getDataById(id, this.tokenSesion).subscribe({
        
        next: (data) => {

          this.infoUpdate = data.getRegistroAfluencia[0];
          
          if(data.getRegistroAfluencia.length > 0) {

            const datosFormularioCompletos = {
              distrito_electoral: this.area,
              distrito_cabecera: this.cabecera,
              demarcacion_territorial: data.getRegistroAfluencia[0].demarcacion_territorial,
              denominacion_lugar: data.getRegistroAfluencia[0].denominacion_lugar,
              domicilio_lugar: data.getRegistroAfluencia[0].domicilio_lugar,
              foto: 0,
              enlace_foto: "ruta/documento",
              ubicacion: 0,
              enlace_ubicacion: "ruta/ubicacion",
              observaciones: data.getRegistroAfluencia[0].observaciones,
              usuario_registro: this.id_usuario,
              modulo_registro: this.tipo_usuario,
              estado_registro: 1,
              tipo_usuario: this.tipo_usuario
            };

            this.formularioRegistro!.patchValue(datosFormularioCompletos);
          
          } else {
            Swal.fire("No se encontraron registros");
          }
        },
        error: (err) => {
  
          if (err.error.code === 160) {
            this.service.cerrarSesionByToken();
          }
  
          if(err.error.code === 100) {
            Swal.fire("No se encontraron registros")
          }
  
        }
      });
    } catch(error) {
      console.error(error);
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
  
