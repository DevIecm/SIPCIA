import { Input, Component, Output, EventEmitter, input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
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

  isOpen = input<boolean>();
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
  
  selectedKmlFile: File | null = null;

  tokenSesion: string = '';
  today: string = '';
  labelTitle: string = '';

  area: number = 0;
  id_usuario: number = 0;
  cabecera: number = 0;
  tipo_usuario: number = 0;

  selectedFoto: File | null = null;
  opcionDemarcacion: any = null;
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;

  onFotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFoto = input.files[0];
      this.previewImage();
    }
  }

  previewImage(): void {
    if (this.selectedFoto) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreviewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFoto);
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
              const formData = new FormData();

            if (this.selectedFoto) {
              formData.append("fotografia", this.selectedFoto);
            }

            if (this.selectedKmlFile) {
              formData.append("kmlFile", this.selectedKmlFile);
            }

            formData.append("distrito_electoral", this.area.toString());
            formData.append("demarcacion_territorial", this.formularioRegistro.get('demarcacion')?.value || null);
            formData.append("nombre_completo", this.formularioRegistro.get('ncompleto')?.value || "");
            formData.append("pueblo_originario", this.formularioRegistro.get('ooriginario')?.value || "");
            formData.append("pueblo", this.formularioRegistro.get('pueblo')?.value || "");
            formData.append("barrio", this.formularioRegistro.get('barrio')?.value || "");
            formData.append("unidad_territorial", this.formularioRegistro.get('uterritorial')?.value || "");
            formData.append("otro", this.formularioRegistro.get('otro')?.value || "");
            formData.append("comunidad", this.formularioRegistro.get('comunidad')?.value || "");
            formData.append("interes_profesional", this.formularioRegistro.get('interes')?.value || "");
            formData.append("nombre_institucion", this.formularioRegistro.get('ninstitucion')?.value || "");
            formData.append("cargo", this.formularioRegistro.get('cargo')?.value || "");
            formData.append("domicilio", this.formularioRegistro.get('domicilio')?.value || "");
            formData.append("telefono", this.formularioRegistro.get('telefono')?.value || "");
            formData.append("correo_electronico", this.formularioRegistro.get('correo')?.value || "");
            formData.append("usuario_registro", this.id_usuario.toString());
            formData.append("modulo_registro", this.tipo_usuario.toString());
            formData.append("estado_registro", "1");

            this.registerService.nuinsertaRegistroAcompa(formData, this.tokenSesion).subscribe({
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
              const formData = new FormData();

            if (!this.formularioRegistro) {
              return;
            }

            if (this.selectedFoto) {
              formData.append("fotografia", this.selectedFoto);
            } else if (this.infoUpdate.fotografia_url) {
              formData.append("fotografia", this.infoUpdate.fotografia_url);
            }

            if (this.selectedKmlFile) {
              formData.append("kmlFile", this.selectedKmlFile);          
            }else if(this.infoUpdate.cv_enlace){
              formData.append("kmlFile", this.infoUpdate.cv_enlace);
            }

            if (this.idRegistro !== undefined) {
              formData.append("id_registro", this.idRegistro.toString());
            }

              formData.append("distrito_electoral", this.area.toString());
              formData.append("demarcacion_territorial", this.formularioRegistro.get('demarcacion')?.value || "");
              formData.append("nombre_completo", this.formularioRegistro.get('ncompleto')?.value || "");
              formData.append("pueblo_originario", this.formularioRegistro.get('ooriginario')?.value || "");
              formData.append("pueblo", this.formularioRegistro.get('pueblo')?.value || "");
              formData.append("barrio", this.formularioRegistro.get('barrio')?.value || "");
              formData.append("unidad_territorial", this.formularioRegistro.get('uterritorial')?.value || "");
              formData.append("otro", this.formularioRegistro.get('otro')?.value || "");
              formData.append("comunidad", this.formularioRegistro.get('comunidad')?.value || "");
              formData.append("interes_profesional", this.formularioRegistro.get('interes')?.value || "");
              formData.append("nombre_institucion", this.formularioRegistro.get('ninstitucion')?.value || "");
              formData.append("cargo", this.formularioRegistro.get('cargo')?.value || "");
              formData.append("domicilio", this.formularioRegistro.get('domicilio')?.value || "");
              formData.append("telefono", this.formularioRegistro.get('telefono')?.value || "");
              formData.append("correo_electronico", this.formularioRegistro.get('correo')?.value || "");
              formData.append("usuario_registro", this.id_usuario.toString());
              formData.append("modulo_registro", this.tipo_usuario.toString());
              formData.append("estado_registro", "2");

            this.registerService.nuupdateRegistroAcompa(formData, this.tokenSesion).subscribe({
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
    this.onClose();
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
      ncompleto: ['', [Validators.required]],
      pueblo: [''],
      barrio: [''],
      otro: [''],
      comunidad: ['', [Validators.required]],
      interes: [''],
      ninstitucion: [''],
      cargo: [''],
      domicilio: [''],
      telefono: [''],
      correo: [''],
    });

    if(!this.idRegistro){
      this.idRegistroC = true;
      this.labelTitle = 'Registro de Instituciones y personas para acompañamiento';
    } else {
      this.labelTitle = 'Edición - Instituciones y personas para acompañamiento';
      this.idRegistroC = false
      this.formularioRegistro.get('comunidad')?.disable();
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
    this.catalogos.getCatalogos(Number(this.area), "cat_unidad_territorial", this.tokenSesion).subscribe({
      next: (data) => {
        if(data.cat_unidad_territorial.length > 0) {
          this.catalogoUnidadTerritorial = data.cat_unidad_territorial;
        }
      }, error: (err) => {
        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };
    
  catalogo_pueblos() {
    this.catalogos.getCatalogos(Number(this.area), "cat_pueblos", this.tokenSesion).subscribe({
      next: (data) => {
        if(data.cat_pueblos.length > 0) {
          this.catalogoPueblos = data.cat_pueblos;
        }
      }, error: (err) => {
        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };
  
  catalogo_pueblor() {
    this.catalogos.getCatalogos(Number(this.area), "cat_pueblos_originarios", this.tokenSesion).subscribe({
      next: (data) => {
        if(data.cat_pueblos_originarios.length > 0) {
          this.catalogoPueblor = data.cat_pueblos_originarios;
        }
      }, error: (err) => {
        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };
  
  catalogo_nreporte() {
    this.catalogos.getCatalogos(Number(this.area), "cat_numero_reporte", this.tokenSesion).subscribe({
      next: (data) => {
        if(data.cat_numero_reporte.length > 0) {
          this.catalogoReporte = data.cat_numero_reporte;
        }
      }, error: (err) => {
        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };

   onFileSelect(event: any, type: string) {
  if (event.target.files.length > 0) {
      this.selectedKmlFile = event.target.files[0];
  }
}

  catalogo_fecha() {
    this.catalogos.getCatalogos(Number(this.area), "cat_fecha_periodo", this.tokenSesion).subscribe({
      next: (data) => {
        if(data.cat_fecha_periodo.length > 0) {
          this.catalogoFecha = data.cat_fecha_periodo;
        }
      }, error: (err) => {
        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };

  catalogo_barrios() {
    this.catalogos.getCatalogos(Number(this.area), "cat_barrios", this.tokenSesion).subscribe({
      next: (data) => {
        if(data.cat_barrios.length > 0) {
          this.catalogoBarrios = data.cat_barrios;
        }
      }, error: (err) => {
        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };

  catalogo_comunidad() {
    this.catalogos.getCatalogos(Number(this.area), "cat_comunidad", this.tokenSesion).subscribe({
      next: (data) => {
        if(data.cat_comunidad.length > 0) {
          this.catalogoComunidad = data.cat_comunidad;
        }
      }, error: (err) => {
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

          this.infoUpdate = data.getRegistroInstituciones[0];
          
          if(data.getRegistroInstituciones.length > 0) {

            this.imagePreviewUrl = data.getRegistroInstituciones[0].fotografia_url;

            const datosFormularioCompletos = {
              cv_enlace: this.infoUpdate.cv_enlace,
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
              telefono: this.infoUpdate.telefono,
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
    this.catalogos.getCatalogos(Number(this.area), "cat_demarcacion_territorial", this.tokenSesion).subscribe({
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

  onChangePuebloOriginario() {
    if (this.formularioRegistro) {

      this.formularioRegistro.patchValue({
        pueblo: null,
        barrio: null,
        uterritorial: null,
        otro: ''
      });

      this.formularioRegistro.get('pueblo')?.disable();
      this.formularioRegistro.get('barrio')?.disable();
      this.formularioRegistro.get('uterritorial')?.disable();
      this.formularioRegistro.get('otro')?.disable();
    }
  }

  onChangePueblo() {
    if (this.formularioRegistro) {
      
      this.formularioRegistro.patchValue({
        ooriginario: null,
        barrio: null,
        uterritorial: null,
        otro: ''
      });

      this.formularioRegistro.get('ooriginario')?.disable();
      this.formularioRegistro.get('barrio')?.disable();
      this.formularioRegistro.get('uterritorial')?.disable();
      this.formularioRegistro.get('otro')?.disable();
    }
  }

  onChangeBarrio() {
    if (this.formularioRegistro) {

      this.formularioRegistro.patchValue({
        ooriginario: null,
        pueblo: null,
        uterritorial: null,
        otro: ''
      });

      this.formularioRegistro.get('ooriginario')?.disable();
      this.formularioRegistro.get('pueblo')?.disable();
      this.formularioRegistro.get('uterritorial')?.disable();
      this.formularioRegistro.get('otro')?.disable();
    }
  }

  onChangeUnidadTerritorial() {
    if (this.formularioRegistro) {

      this.formularioRegistro.patchValue({
        ooriginario: null,
        pueblo: null,
        barrio: null,
        otro: ''
      });

      this.formularioRegistro.get('ooriginario')?.disable();
      this.formularioRegistro.get('pueblo')?.disable();
      this.formularioRegistro.get('barrio')?.disable();
      this.formularioRegistro.get('otro')?.disable();
    }
  }

  onChangeOtro() {
    if (this.formularioRegistro) {

      this.formularioRegistro.patchValue({
        ooriginario: null,
        pueblo: null,
        uterritorial: null,
        barrio: null
      });

      this.formularioRegistro.get('ooriginario')?.disable();
      this.formularioRegistro.get('pueblo')?.disable();
      this.formularioRegistro.get('barrio')?.disable();
      this.formularioRegistro.get('uterritorial')?.disable();
    }
  }
}
