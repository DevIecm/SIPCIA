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

  @Input() isOpen = false;
  @Input() idRegistroC: any;
  @Input() idRegistro : number | undefined;
  @Output() close = new EventEmitter<void>();

  formularioRegistro: FormGroup | undefined;

  catalogoDemarcacion: any = [];
  catalogoComunidad: any = [];
  catalogoPueblos: any = [];
  catalogoPueblor: any = [];
  catalogoBarrios: any = [];
  catalogoUnidadTerritorial: any = [];
  catalogoReporte: any = [];
  catalogoFecha: any = [];
  infoUpdate: any = [];

  opcionDemarcacion: any = null;

  tokenSesion: string = '';
  today: string = '';
  labelTitle: string = '';

  area: number = 0;
  id_usuario: number = 0;
  cabecera: number = 0;
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
              distrito_electoral: this.area,
              fotografia: "hayFoto",//mandar  0
              demarcacion_territorial: Number(this.formularioRegistro.get('demarcacion')?.value) || null,
              nombre_completo: this.formularioRegistro.get('ncompleto')?.value || null,
              pueblo_originario: Number(this.formularioRegistro.get('ooriginario')?.value) || null,
              pueblo: Number(this.formularioRegistro.get('pueblo')?.value) || null,
              barrio: Number(this.formularioRegistro.get('barrio')?.value) || null,
              unidad_territorial: Number(this.formularioRegistro.get('uterritorial')?.value) || null,
              otro: this.formularioRegistro.get('otro')?.value || null,
              comunidad: Number(this.formularioRegistro.get('comunidad')?.value) || null,
              interes_profesional: this.formularioRegistro.get('interes')?.value || null,
              nombre_institucion: this.formularioRegistro.get('ninstitucion')?.value || null,
              cargo: this.formularioRegistro.get('cargo')?.value || null,
              domicilio: this.formularioRegistro.get('domicilio')?.value || null,
              telefono: this.formularioRegistro.get('telefono')?.value || null,
              correo_electronico: this.formularioRegistro.get('correo')?.value || null,
              usuario_registro: this.id_usuario,
              modulo_registro: 1,
              estado_registro: 1, 
              cv_documento: 0,
              cv_enlace: "ruta/documento"
            }; 

            console.log(datosFormularioCompletos);

            this.registerService.insertaRegistroAcompa(datosFormularioCompletos, this.tokenSesion).subscribe({
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
              id_registro: this.idRegistro,
              fotografia: "hayFoto",//mandar  0
              demarcacion_territorial: Number(this.formularioRegistro.get('demarcacion')?.value) || null,
              nombre_completo: this.formularioRegistro.get('ncompleto')?.value || null,
              pueblo_originario: Number(this.formularioRegistro.get('ooriginario')?.value) || null,
              pueblo: Number(this.formularioRegistro.get('pueblo')?.value) || null,
              barrio: Number(this.formularioRegistro.get('barrio')?.value) || null,
              unidad_territorial: Number(this.formularioRegistro.get('uterritorial')?.value) || null,
              otro: this.formularioRegistro.get('otro')?.value || null,
              comunidad: Number(this.formularioRegistro.get('comunidad')?.value) || null,
              interes_profesional: this.formularioRegistro.get('interes')?.value || null,
              nombre_institucion: this.formularioRegistro.get('ninstitucion')?.value || null,
              cargo: this.formularioRegistro.get('cargo')?.value || null,
              domicilio: this.formularioRegistro.get('domicilio')?.value || null,
              telefono: this.formularioRegistro.get('telefono')?.value || null,
              correo_electronico: this.formularioRegistro.get('correo')?.value || null,
              usuario_registro: this.id_usuario,
              modulo_registro: 1,
              estado_registro: 1, 
              cv_documento: 0,
              cv_enlace: "ruta/documento"
            };

            this.registerService.updateRegistroAcompa(datosFormularioCompletos, this.tokenSesion).subscribe({
              next: (data) => {
                if(data.code === 200) {
                  Swal.fire({
                    title: "Se han guardado correctamente los cambios.",
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

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    this.onClose();
  }

  ngOnInit() {
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.today = this.datePipe.transform(new Date(), 'dd/MM/yyyy')!;
    this.area = Number(sessionStorage.getItem('area')!);
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.cabecera = Number(sessionStorage.getItem('cabecera'));
    this.id_usuario = Number(sessionStorage.getItem('id_usuario'));

    this.formularioRegistro = this.formBuilder.group({
      demarcacion: [''],
      ooriginario: [''],
      uterritorial: [''],
      ncompleto: [''],
      pueblo: [''],
      barrio: [''],
      otro: [''],
      comunidad: [''],
      interes: [''],
      ninstitucion: [''],
      cargo: [''],
      domicilio: [''],
      telefono: [''],
      correo: ['']
    });

    if(!this.idRegistro){
      this.idRegistroC = true;
      this.labelTitle = 'Registro de Instituciones y personas para acompañamiento';
    } else {
      this.labelTitle = 'Edición - Instituciones y personas para acompañamiento';
      this.idRegistroC = false
      this.getDataById(this.idRegistro);
    }

    this.catalogo_demarcacion();
    this.catalogo_pueblor();
    this.catalogo_pueblos();
    this.catalogo_barrios();
    this.catalogo_unidad_territorial();
    this.catalogo_nreporte();
    this.catalogo_fecha();
    this.catalogo_comunidad();
  }

  catalogo_unidad_territorial() {
    this.catalogos.getCatalogos("cat_unidad_territorial", this.tokenSesion).subscribe({
      next: (data) => {
        if(data.cat_unidad_territorial.length > 0) {
          this.catalogoUnidadTerritorial = data.cat_unidad_territorial;
        }
      }, error: (err) => {
        
        Swal.fire("Error al cargar catalogo");

        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };
    
  catalogo_pueblos() {
    this.catalogos.getCatalogos("cat_pueblos", this.tokenSesion).subscribe({
      next: (data) => {
        if(data.cat_pueblos.length > 0) {
          this.catalogoPueblos = data.cat_pueblos;
        }
      }, error: (err) => {
        
        Swal.fire("Error al cargar catalogo");

        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };
  
  catalogo_pueblor() {
    this.catalogos.getCatalogos("cat_pueblos_originarios", this.tokenSesion).subscribe({
      next: (data) => {
        if(data.cat_pueblos_originarios.length > 0) {
          this.catalogoPueblor = data.cat_pueblos_originarios;
        }
      }, error: (err) => {
        
        Swal.fire("Error al cargar catalogo");

        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };
  
  catalogo_nreporte() {
    this.catalogos.getCatalogos("cat_numero_reporte", this.tokenSesion).subscribe({
      next: (data) => {
        if(data.cat_numero_reporte.length > 0) {
          this.catalogoReporte = data.cat_numero_reporte;
        }
      }, error: (err) => {
        
        Swal.fire("Error al cargar catalogo");

        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };

  catalogo_fecha() {
    this.catalogos.getCatalogos("cat_fecha_periodo", this.tokenSesion).subscribe({
      next: (data) => {
        if(data.cat_fecha_periodo.length > 0) {
          this.catalogoFecha = data.cat_fecha_periodo;
        }
      }, error: (err) => {
        
        Swal.fire("Error al cargar catalogo");

        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };

  catalogo_barrios() {
    this.catalogos.getCatalogos("cat_barrios", this.tokenSesion).subscribe({
      next: (data) => {
        if(data.cat_barrios.length > 0) {
          this.catalogoBarrios = data.cat_barrios;
        }
      }, error: (err) => {
        
        Swal.fire("Error al cargar catalogo");

        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };

  catalogo_comunidad() {
    this.catalogos.getCatalogos("cat_comunidad", this.tokenSesion).subscribe({
      next: (data) => {
        if(data.cat_comunidad.length > 0) {
          this.catalogoComunidad = data.cat_comunidad;
        }
      }, error: (err) => {
        
        Swal.fire("Error al cargar catalogo");

        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };

  getDataById(id: number) {
    try {
      if (!this.idRegistro) return;

      this.registerService.getDataByIdAcompa(id, this.tokenSesion).subscribe({
        
        next: (data) => {
          console.log(data)

          this.infoUpdate = data.getRegistroInstituciones[0];
          
          if(data.getRegistroInstituciones.length > 0) {

            const datosFormularioCompletos = {
              demarcacion: this.infoUpdate.id_demarcacion,
              ooriginario: this.infoUpdate.id_pueblo_originario,
              uterritorial: this.infoUpdate.id_unidad_territorial,
              ncompleto: this.infoUpdate.nombre_completo,
              pueblo: this.infoUpdate.id_pueblo,
              barrio: this.infoUpdate.id_barrio,
              otro: this.infoUpdate.otro,
              comunidad: this.infoUpdate.id_comunidad,
              interes: this.infoUpdate.interes_profesional,
              ninstitucion: this.infoUpdate.nombre_institucion,
              cargo: this.infoUpdate.cargo,
              domicilio: this.infoUpdate.domicilio,
              telefono: this.infoUpdate.telfono,
              correo: this.infoUpdate.correo_electronico
            }

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
