import { Input, Component, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Auth } from '../../../../../services/authService/auth';
import { Catalogos } from '../../../../../services/catService/catalogos';
import { Reportes } from '../../../../../services/reporteService/reportes';

@Component({
  selector: 'app-formulario-consultas',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
  templateUrl: './formulario-consultas.html',
  styleUrl: './formulario-consultas.css'
})
export class FormularioConsultas {

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
  opcionComunidad: any = null;
  opcionPuebloOriginario: any = null;
  opcionPueblo: any = null;
  opcionBarrio: any = null;
  opcionUnidadTerritorial: any = null;

  fileUploaded: boolean = false;
  
  tokenSesion: string = '';
  today: string = '';
  area: string = '';
  position: string = '';
  selectedFileName: string | null = null;
  labelTitle: string = '';

  tipo_usuario: number = 0;
  id_usuario: number = 0;
  idConsecutivo: number = 0;
  moduloRegister: number = 0;
  selectedKmlFile: File | null = null;

  constructor(
    private catalogos: Catalogos,
    private service: Auth,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private registerService: Reportes
  ) {}


  onFileSelect(event: any, type: string) {

    if (event.target.files.length > 0) {
      this.selectedKmlFile = event.target.files[0];
      this.selectedFileName = this.selectedKmlFile?.name ?? null;
      this.fileUploaded = true;
    }

  }

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

            if (this.selectedKmlFile) {
              formData.append("kmlFile", this.selectedKmlFile);
            }


              formData.append("distrito_electoral", this.area.toString());
              formData.append("numero_reporte", this.formularioRegistro.get('nreporte')?.value || "");
              formData.append("fecha_periodo", this.formularioRegistro.get('fyperiodo')?.value || "");  
              formData.append("presento_caso", this.formularioRegistro.get('presento_caso')?.value);
              formData.append("numero_consecutivo", this.idConsecutivo.toString());
              formData.append("fecha_consulta", this.formularioRegistro.get('fconsulta')?.value || "");
              formData.append("nombre_completo", this.formularioRegistro.get('ncompleto')?.value || "");
              formData.append("pueblo_originario", this.formularioRegistro.get('ooriginario')?.value || "");
              formData.append("pueblo", this.formularioRegistro.get('pueblo')?.value || "");
              formData.append("barrio", this.formularioRegistro.get('barrio')?.value || "");
              formData.append("unidad_territorial", this.formularioRegistro.get('uterritorial')?.value || "");
              formData.append("otro", this.formularioRegistro.get('otro')?.value || "");
              formData.append("cargo", this.formularioRegistro.get('cargo')?.value || "");
              formData.append("descripcion_consulta", this.formularioRegistro.get('consulta')?.value || "");
              formData.append("forma_atendio", this.formularioRegistro.get('forma')?.value || "");
              formData.append("observaciones", this.formularioRegistro.get('observaciones')?.value || "");
              formData.append("usuario_registro", this.id_usuario.toString());
              formData.append("modulo_registro", this.tipo_usuario.toString());
              formData.append("estado_registro", "1");
            

            this.registerService.insertaRegistroConsultas(formData, this.tokenSesion).subscribe({
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

            if (this.selectedKmlFile) {
              formData.append("kmlFile", this.selectedKmlFile);          
            }else if(this.infoUpdate.enlace_documento){
              formData.append("kmlFile", this.infoUpdate.enlace_documento);
            }

            if (this.idRegistro !== undefined) {
              formData.append("id_registro", this.idRegistro.toString());
            }
             formData.append("distrito_electoral", this.area.toString());
              formData.append("numero_reporte", this.formularioRegistro.get('nreporte')?.value || "");
              formData.append("fecha_periodo", this.formularioRegistro.get('fyperiodo')?.value || "");  
              formData.append("presento_caso", this.formularioRegistro.get('presento_caso')?.value);
              formData.append("numero_consecutivo", this.idConsecutivo.toString());
              formData.append("fecha_consulta", this.formularioRegistro.get('fconsulta')?.value || "");
              formData.append("nombre_completo", this.formularioRegistro.get('ncompleto')?.value || "");
              formData.append("pueblo_originario", this.formularioRegistro.get('ooriginario')?.value || "");
              formData.append("pueblo", this.formularioRegistro.get('pueblo')?.value || "");
              formData.append("barrio", this.formularioRegistro.get('barrio')?.value || "");
              formData.append("unidad_territorial", this.formularioRegistro.get('uterritorial')?.value || "");
              formData.append("otro", this.formularioRegistro.get('otro')?.value || "");
              formData.append("cargo", this.formularioRegistro.get('cargo')?.value || "");
              formData.append("descripcion_consulta", this.formularioRegistro.get('consulta')?.value || "");
              formData.append("forma_atendio", this.formularioRegistro.get('forma')?.value || "");
              formData.append("observaciones", this.formularioRegistro.get('observaciones')?.value || "");
              formData.append("usuario_registro", this.id_usuario.toString());
              formData.append("modulo_registro", this.tipo_usuario.toString());
              formData.append("estado_registro", "1");
            
              

            this.registerService.updateRegistroConsultas(formData, this.tokenSesion).subscribe({
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

  ngOnInit() {
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.today = this.datePipe.transform(new Date(), 'dd/MM/yyyy')!;
    this.area = sessionStorage.getItem('area')!;
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.position = sessionStorage.getItem('dir')!;
    this.id_usuario = Number(sessionStorage.getItem('id_usuario'));
    this.moduloRegister = Number(localStorage.getItem('modulo'));

    if(this.moduloRegister === 1){
      this.area = sessionStorage.getItem('area')!;
    }

    this.formularioRegistro = this.formBuilder.group({
      nreporte: ['', [Validators.required]],
      fyperiodo: ['', [Validators.required]],
      consecutivo: [{ value: '', disabled: true}],
      fconsulta: ['', [Validators.required]],
      ncompleto: ['', [Validators.required]],
      ooriginario: ['', [Validators.required]],
      pueblo: ['', [Validators.required]],
      barrio: ['', [Validators.required]],
      uterritorial: ['', [Validators.required]],
      otro: [''],
      cargo: [''],
      consulta: [''],
      forma: [''],
      observaciones: [''],
      presento_caso: [0]
    });

    if(!this.idRegistro){
      this.idRegistroC = true;
      this.labelTitle = 'Atención a consultas';
    } else {
      this.labelTitle = 'Edición - Atención a consultas';
      this.idRegistroC = false;
      this.getDataById(this.idRegistro);
    }

    this.getConsecutivo();
    this.catalogo_nreporte();
    this.catalogo_fecha();

    this.onCheckboxChange({ target: { checked: false } });

  }

  catalogo_unidad_territorial() {

    if(this.moduloRegister === 2){} else {}
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

  catalogo_demarcacion() {
    this.catalogos.getCatalogos(Number(this.area), "cat_demarcacion_territorial", this.tokenSesion).subscribe({
      next: (data) => {
        if(data.cat_demarcacion_territorial.length > 0) {
          this.catalogoDemarcacion = data.cat_demarcacion_territorial;
        }
      }, error: (err) => {
        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };

  getConsecutivo() {
    this.registerService.getRegisterConsecutivoConsultas(Number(this.area), this.tokenSesion).subscribe({
      next: (data) => {
        this.idConsecutivo = data.getConsCon;

      },
      error: (err) => {

        if (err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }

        if(err.error.code === 100) {
          Swal.fire("No se encontraron registros")
        }

      }
    })
  }

  onChangePuebloOriginario() {
    if (this.formularioRegistro) {
      this.formularioRegistro.get('pueblo')?.disable();
      this.formularioRegistro.get('barrio')?.disable();
      this.formularioRegistro.get('uterritorial')?.disable();
      this.formularioRegistro.get('otro')?.disable();
    }
  }

  onChangePueblo() {
    if (this.formularioRegistro) {
      this.formularioRegistro.get('ooriginario')?.disable();
      this.formularioRegistro.get('barrio')?.disable();
      this.formularioRegistro.get('uterritorial')?.disable();
      this.formularioRegistro.get('otro')?.disable();
    }
  }

  onChangeBarrio() {
    if (this.formularioRegistro) {
      this.formularioRegistro.get('ooriginario')?.disable();
      this.formularioRegistro.get('pueblo')?.disable();
      this.formularioRegistro.get('uterritorial')?.disable();
      this.formularioRegistro.get('otro')?.disable();
    }
  }

  onChangeUnidadTerritorial() {
    if (this.formularioRegistro) {
      this.formularioRegistro.get('ooriginario')?.disable();
      this.formularioRegistro.get('pueblo')?.disable();
      this.formularioRegistro.get('barrio')?.disable();
      this.formularioRegistro.get('otro')?.disable();
    }
  }

  onChangeOtro() {
    if (this.formularioRegistro) {
      this.formularioRegistro.get('ooriginario')?.disable();
      this.formularioRegistro.get('pueblo')?.disable();
      this.formularioRegistro.get('barrio')?.disable();
      this.formularioRegistro.get('uterritorial')?.disable();
    }
  }

  onCheckboxChange(event: any) {
    const checked = event.target.checked;
    this.formularioRegistro?.get('presento_caso')?.setValue(checked ? 1 : 0);

    if(checked) {
      this.formularioRegistro?.get('ncompleto')?.disable();
      this.formularioRegistro?.get('ooriginario')?.disable();
      this.formularioRegistro?.get('pueblo')?.disable();
      this.formularioRegistro?.get('barrio')?.disable();
      this.formularioRegistro?.get('uterritorial')?.disable();
      this.formularioRegistro?.get('otro')?.disable();
      this.formularioRegistro?.get('cargo')?.disable();
      this.formularioRegistro?.get('consulta')?.disable();
      this.formularioRegistro?.get('forma')?.disable();
      this.formularioRegistro?.get('observaciones')?.disable();

      this.formularioRegistro?.get('ncompleto')?.setValue('');
      this.formularioRegistro?.get('ooriginario')?.setValue('');
      this.formularioRegistro?.get('pueblo')?.setValue('');
      this.formularioRegistro?.get('barrio')?.setValue('');
      this.formularioRegistro?.get('uterritorial')?.setValue('');
      this.formularioRegistro?.get('otro')?.setValue('');
      this.formularioRegistro?.get('cargo')?.setValue('');
      this.formularioRegistro?.get('consulta')?.setValue('');
      this.formularioRegistro?.get('forma')?.setValue('');
      this.formularioRegistro?.get('observaciones')?.setValue('');

      this.formularioRegistro?.get('ncompleto')?.clearValidators();
      this.formularioRegistro?.get('ooriginario')?.clearValidators();
      this.formularioRegistro?.get('pueblo')?.clearValidators();
      this.formularioRegistro?.get('barrio')?.clearValidators();
      this.formularioRegistro?.get('uterritorial')?.clearValidators();

    } else {

      this.formularioRegistro?.get('ncompleto')?.setValidators([Validators.required]);
      this.formularioRegistro?.get('ooriginario')?.clearValidators();
      this.formularioRegistro?.get('pueblo')?.clearValidators();
      this.formularioRegistro?.get('barrio')?.clearValidators();
      this.formularioRegistro?.get('uterritorial')?.clearValidators();

      this.formularioRegistro?.get('ncompleto')?.enable();
      this.formularioRegistro?.get('ooriginario')?.enable();
      this.formularioRegistro?.get('pueblo')?.enable();
      this.formularioRegistro?.get('barrio')?.enable();
      this.formularioRegistro?.get('uterritorial')?.enable();
      this.formularioRegistro?.get('otro')?.enable();
      this.formularioRegistro?.get('cargo')?.enable();
      this.formularioRegistro?.get('consulta')?.enable();
      this.formularioRegistro?.get('forma')?.enable();
      this.formularioRegistro?.get('observaciones')?.enable();

    }
  }
  
  formatFecha(data: any) {
    const isoDate = data;
    const date = new Date(isoDate);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
    const year = date.getUTCFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }

  getDataById(id: number) {
    try {
      if (!this.idRegistro) return;

      this.registerService.getDataByIdConsultas(id, this.tokenSesion).subscribe({
        
        next: (data) => {
          this.infoUpdate = data.getRegistroAtencion[0];
         
          if(data.getRegistroAtencion.length > 0) {

            if(this.moduloRegister === 2){

              this.area = this.infoUpdate.distrito_electoral;

              const datosFormulariosCompletos = {
                nreporte: this.infoUpdate.numero_reporte,
                fyperiodo: this.infoUpdate.fecha_periodo,
                consecutivo: this.infoUpdate.numero_consecutivo,
                fconsulta: this.infoUpdate.fecha_consulta ? new Date(this.infoUpdate.fecha_consulta).toISOString().split('T')[0] : '',
                ncompleto: this.infoUpdate.nombre_completo,
                ooriginario: this.infoUpdate.pueblo_originario,
                pueblo: this.infoUpdate.pueblo,
                barrio: this.infoUpdate.barrio,
                uterritorial: this.infoUpdate.unidad_territorial,
                otro: this.infoUpdate.otro,
                cargo: this.infoUpdate.cargo,
                consulta: this.infoUpdate.descripcion_consulta,
                forma: this.infoUpdate.forma_atendio,
                observaciones: this.infoUpdate.observaciones,
                presento_caso: !!this.infoUpdate.presento_caso
              }

              this.catalogo_demarcacion();
              this.catalogo_pueblor();
              this.catalogo_pueblos();
              this.catalogo_barrios();
              this.catalogo_unidad_territorial();
              this.formularioRegistro!.patchValue(datosFormulariosCompletos);
      
              this.formularioRegistro?.disable();

              if (this.formularioRegistro?.get('presento_caso')?.value === true || this.formularioRegistro?.get('presento_caso')?.value === 1) {
                this.onCheckboxChange({ target: { checked: true } });
              }

            } else {
              
              const datosFormulariosCompletos = {
                nreporte: this.infoUpdate.numero_reporte,
                fyperiodo: this.infoUpdate.fecha_periodo,
                consecutivo: this.infoUpdate.numero_consecutivo,
                fconsulta: this.infoUpdate.fecha_consulta ? new Date(this.infoUpdate.fecha_consulta).toISOString().split('T')[0] : '',
                ncompleto: this.infoUpdate.nombre_completo,
                ooriginario: this.infoUpdate.pueblo_originario,
                pueblo: this.infoUpdate.pueblo,
                barrio: this.infoUpdate.barrio,
                uterritorial: this.infoUpdate.unidad_territorial,
                otro: this.infoUpdate.otro,
                cargo: this.infoUpdate.cargo,
                consulta: this.infoUpdate.descripcion_consulta,
                forma: this.infoUpdate.forma_atendio,
                observaciones: this.infoUpdate.observaciones,
                presento_caso: !!this.infoUpdate.presento_caso
              }
              

              this.catalogo_demarcacion();
              this.catalogo_pueblor();
              this.catalogo_pueblos();
              this.catalogo_barrios();
              this.catalogo_unidad_territorial();
              this.formularioRegistro!.patchValue(datosFormulariosCompletos);

              if (this.formularioRegistro?.get('presento_caso')?.value === true || this.formularioRegistro?.get('presento_caso')?.value === 1) {
                this.onCheckboxChange({ target: { checked: true } });
              }
            }
          
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

  onClose() {
    this.close.emit();
  }

  removeFile(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    this.selectedFileName = null;
    this.fileUploaded = false;
    this.selectedKmlFile = null;
  }

  onBackdropClick(event: MouseEvent) {
    this.onClose();
  }
}