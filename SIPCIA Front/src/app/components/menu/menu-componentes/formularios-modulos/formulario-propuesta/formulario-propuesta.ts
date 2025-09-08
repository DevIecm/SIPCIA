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
  selector: 'app-formulario-propuesta',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
  templateUrl: './formulario-propuesta.html',
  styleUrl: './formulario-propuesta.css'
})
export class FormularioPropuesta {

  @Input() isOpen = false;
  @Input() idRegistroC: any;
  @Input() idRegistro : number | undefined;
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
  optionAnterioridad: number = 0;
  optionPrestamo: number = 0;
  optionMedida: number = 0;

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

            const datosForm = {
              usuario_registro:this.id_usuario,
              distrito_electoral: this.area,
              demarcacion: Number(this.formularioRegistro.get('demarcacion')?.value) || null,
              lugar_espacio: this.formularioRegistro.get('lugar_espacio')?.value || null,
              domicilio: this.formularioRegistro.get('domicilio')?.value || null,
              fotografia: 0,
              enlace_fotografia: "ruta/documento",
              ubicacion_kml: 0,
              enlace_ubicacion: "ruta/documento", 
              intitucion_propietaria: this.formularioRegistro.get('intitucion_propietaria')?.value || null,
              prestamo_iecm: Number(this.optionAnterioridad),
              nuevo_prestamo: 1,
              superficie_espacio: Number(this.formularioRegistro.get('superficie_espacio')?.value) || null,
              aforo: Number(this.formularioRegistro.get('aforo')?.value) || null,
              ventilacion: 2,
              observaciones: this.formularioRegistro.get('observaciones')?.value || null,
              modulo_registro: this.tipo_usuario,
              estado_registro: 1,
            };

            console.log(datosForm)

            this.registerService.insertaRegistroComunitaria(datosForm, this.tokenSesion).subscribe({
              next: (data) => {
                if(data.code === 200) {
                  Swal.fire({
                    title: " Se ha registrado correctamente.",
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

            const datosForm = {
              id_registro: 1,
              distrito_electoral: 1,
              demarcacion: Number(this.formularioRegistro.get('demarcacion')?.value) || null,
              lugar_espacio: this.formularioRegistro.get('lugar_espacio')?.value || null,
              domicilio: this.formularioRegistro.get('domicilio')?.value || null,
              fotografia: 0,
              enlace_fotografia: "ruta/documento",
              ubicacion_kml: 0,
              enlace_ubicacion: "ruta/documento", 
              intitucion_propietaria: this.formularioRegistro.get('intitucion_propietaria')?.value || null,
              prestamo_iecm: 2,
              nuevo_prestamo: 1,
              superficie_espacio: Number(this.formularioRegistro.get('superficie_espacio')?.value) || null,
              aforo: Number(this.formularioRegistro.get('aforo')?.value) || null,
              ventilacion: 2,
              observaciones: this.formularioRegistro.get('observaciones')?.value || null,
              usuario_registro: 1,
              modulo_registro: this.tipo_usuario,
              estado_registro: 1,
            };

            this.registerService.updateRegistroComunitaria(datosForm, this.tokenSesion).subscribe({
              next: (data) => {
                if(data.code === 200) {
                  Swal.fire({
                    title: " Se ha registrado correctamente.",
                    text: data.folio,
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

  resetFormulario() {   
    this.formularioRegistro?.patchValue({
      demarcacion: null,    
    });
  }

  ngOnInit() {
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.today = this.datePipe.transform(new Date(), 'dd/MM/yyyy')!;
    this.area = Number(sessionStorage.getItem('area')!);
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.cabecera = Number(sessionStorage.getItem('cabecera'));
    this.id_usuario = Number(sessionStorage.getItem('id_usuario'));

    this.formularioRegistro = this.formBuilder.group({
      dDistrital: [{ value:'', disabled: true}],
      demarcacion: [''],
      lugar_espacio: [''],
      intitucion_propietaria: [''],
      domicilio: [''],
      superficie_espacio: [''],
      aforo: [''],
      observaciones: [''],
      anterioridad: ['']
    });

    this.catalogo_demarcacion();

    if(!this.idRegistro){
      this.idRegistroC = true;
      this.labelTitle = 'Registro - Propuesta de lugares y espacios para Asambleas Comunitarias';
    } else {
      this.labelTitle = 'Edición - Propuesta de lugares y espacios para Asambleas Comunitarias';
      this.idRegistroC = false;
      this.getDataById(this.idRegistro);
    }
  }

  getDataById(id: number) {
    try {
      if (!this.idRegistro) return;

      this.registerService.getDataByIdComunitaria(id, this.tokenSesion).subscribe({
        
        next: (data) => {

          this.infoUpdate = data.getRegistroAfluencia[0];
          
          if(data.getRegistroAfluencia.length > 0) {

            const datosFormularioCompletos = {
              distrito_electoral: this.area,
              distrito_cabecera: this.cabecera,
              demarcacion: data.getRegistroAfluencia[0].demarcacion,
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
            Swal.fire("No se encontraron registros");
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

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    this.onClose();
  }
}
