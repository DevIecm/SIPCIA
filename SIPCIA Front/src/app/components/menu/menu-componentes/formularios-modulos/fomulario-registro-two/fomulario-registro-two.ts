import { CommonModule, DatePipe } from '@angular/common';
import { Input, Component, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as data from '../../../../labels/label.json';
import Swal from 'sweetalert2';
import { Register } from '../../../../../services/registerService/register';
import { Auth } from '../../../../../services/authService/auth';
import { Catalogos } from '../../../../../services/catService/catalogos';
import { DeleteService } from '../../../../../services/deleteServices/delete-service';

@Component({
  selector: 'app-fomulario-registro-two',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
  templateUrl: './fomulario-registro-two.html',
  styleUrl: './fomulario-registro-two.css'
})
export class FomularioRegistroTwo implements OnInit{
  
  @Input() isOpen = false;
  @Input() idRegistroC: any;
  @Input() idRegistro : number | undefined;
  @Input() idComunidad: number | undefined
  @Output() close = new EventEmitter<void>();

  currentTime: string= '';
  today: string = '';
  moduloClicked: string = '';
  afro: boolean = false;
  indigenas: boolean = false;
  data: any = data;
  formularioRegistro: FormGroup | undefined;
  seleccionado: any;
  myDate: string | number | Date | undefined;

  tokenSesion: string = '';
  dataToEdit: any[] =[];

  nombreUser: string = '';
  cargoUser: string = '';
  position: string = '';
  labelText: string = '';
  area: string = '';

  catalogoComunidad: any = [];
  catalogoPueblos: any = [];
  catalogoPueblor: any = [];
  catalogoBarrios: any = [];
  catalogoUnidadTerritorial: any = [];
  catalogoDemarcacion: any = [];
  infoUpdate: any = [];

  showIndigenas: boolean = false;
  showAfromexicanos: boolean = false;
  hayCambios: boolean = false;
  oculta_folio: boolean = false;
  fileUploaded: boolean = false;
  
  selectedFileName: string | null = null;
  selectedFile: File | null = null;
  
  originalFormData: any = {};
  demarcacion: number = 0;
  distrito: number = 0;
  tipo_usuario: number = 0;
  id_usuario: number = 0;
  distritoElectoral: number = 0;
  
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private registerService: Register,
    private service: Auth,
    private catalogos: Catalogos,
    private delService: DeleteService
  ) {}

  ngOnInit(): void {

     this.formularioRegistro = this.formBuilder.group({
      folio: [{ value: '', disabled: true }],
      nombre_completo: ['', Validators.required],
      seccion_electoral: ['', Validators.required],
      demarcacion: [''],
      duninominal: [{ value: '', disabled: true }],
      scomunidad: [{ value: '', disabled: true }],
      ncomunidad: ['', Validators.required],

      ooriginario: [''],
      pueblo: [''],
      barrio: [''],
      uterritorial: [''],
      comunidad: [''],
      otro: [''],

      pueblor: [''],
      comunidadr: [''],
      organizacion: [''],
      prelevante: [''],
      otror: [''],

      ninstancia: ['', Validators.required],
      cinstancia: ['', Validators.required],
      domicilio: ['', Validators.required],
      tfijo: ['', [Validators.pattern('^[0-9]+$')]],
      tcelular: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      docs: [{ value: '' }],
      coficial: ['', [Validators.email]],
      cpersonal: ['', [Validators.required, Validators.email]],
    });

    this.moduloClicked = localStorage.getItem('moduloClicked')!;
    this.tokenSesion = sessionStorage.getItem('key')!;

    this.currentTime = this.datePipe.transform(new Date(), 'HH:mm:ss') + ' hrs.';
    this.today = this.datePipe.transform(new Date(), 'dd/MM/yyyy')!;
    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
    this.position = sessionStorage.getItem('dir')!;
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.area = sessionStorage.getItem('area')!;

    this.originalFormData = this.formularioRegistro.getRawValue();
    this.id_usuario =  Number(sessionStorage.getItem('id_usuario')!);

    if(this.moduloClicked === '2.1') {
      this.oculta_folio = true;
    }

    if(this.idRegistro === undefined) {

      this.catalogo_comunidad();

    } else {
      
      this.formularioRegistro.get('scomunidad')?.disable();
      this.hayCambios = true;
      this.getDataById();

    }

    if(!this.idRegistro){
      this.idRegistroC = true;
    } else {
      this.idRegistroC = false
      this.getDataById();
    }
  }

  onFileSelect(event: any, type: string) {
    if (event.target.files.length > 0) {
      if (type === "zip") {
        this.selectedFile = event.target.files[0];
      }
    }
  }
  
  removeFile(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    this.selectedFileName = null;
    this.fileUploaded = false;
    this.selectedFile = null;
  }

  changeSeccion(){
    this.getSeccion();
  }

  getSeccion(){
    this.registerService.getSeccion(Number(this.formularioRegistro?.get('seccion_electoral')?.value), this.tokenSesion).subscribe({
      next: (data) => {

        const distritos = data as { distrito_electoral: number }[];
        this.distritoElectoral = distritos[0]?.distrito_electoral;
        this.formularioRegistro?.get('duninominal')?.setValue(this.distritoElectoral);
        this.catalogo_demarcacion();

        if (this.formularioRegistro) {
          this.formularioRegistro.get('scomunidad')?.enable();
        }

      }, error: (err) => {
        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  }

  onChangeComunidad() {
    if(Number(this.formularioRegistro?.get('scomunidad')?.value) == 1) {
      this.showIndigenas = true;
      this.showAfromexicanos = false;

      this.catalogo_pueblor();
      this.catalogo_pueblos();
      this.catalogo_barrios();
      this.catalogo_unidad_territorial();

      if (this.formularioRegistro) {
        this.formularioRegistro.get('pueblor')?.enable();
        this.formularioRegistro.get('comunidadr')?.enable();
        this.formularioRegistro.get('organizacion')?.enable();
        this.formularioRegistro.get('otror')?.enable();
      }

      if (this.formularioRegistro) {
        this.formularioRegistro.patchValue({
          pueblor: '',
          comunidadr: '',
          comunidad: '',
          organizacion: '',
          prelevante: '',
          otror: ''
        });
      };


    } else if(Number(this.formularioRegistro?.get('scomunidad')?.value) == 2) {
      this.showAfromexicanos = true;
      this.showIndigenas = false;

      if (this.formularioRegistro) {
        this.formularioRegistro.patchValue({
          ooriginario: '',
          pueblo: '',
          barrio: '',
          uterritorial: '',
          comunidad: '',
          otro: '',
          prelevante: ''
        });
      };

      if(this.formularioRegistro) {
        this.formularioRegistro.get('ooriginario')?.enable();
        this.formularioRegistro.get('pueblo')?.enable();
        this.formularioRegistro.get('barrio')?.enable();
        this.formularioRegistro.get('uterritorial')?.enable();
        this.formularioRegistro.get('otro')?.enable();
      }
    }
  }

  getDataById() {
    try {
      this.registerService.getDataById(this.idRegistro ?? 0, this.tokenSesion).subscribe({
        next: (data) => {

          this.infoUpdate = data.getRegistro[0];

          const userDataIndigenas = {
            folio: data.getRegistro[0].folio,
            nombre_completo: data.getRegistro[0].nombre_completo,
            seccion_electoral: data.getRegistro[0].seccion_electoral,
            demarcacion: data.getRegistro[0].id_demarcacion_territorial,
            scomunidad: data.getRegistro[0].id_comunidad,
            ncomunidad: data.getRegistro[0].nombre_comunidad,

            ooriginario: data.getRegistro[0].id_pueblo_originario,
            pueblo: data.getRegistro[0].id_pueblo,
            barrio: data.getRegistro[0].id_barrio,
            uterritorial: data.getRegistro[0].id_ut,
            comunidad: data.getRegistro[0].comunidad_pbl,
            otro: data.getRegistro[0].otro_pbl,
            
            duninominal: data.getRegistro[0].id_direccion_distrital,

            ninstancia: data.getRegistro[0].nombre_instancia,
            cinstancia: data.getRegistro[0].cargo_instancia,
            domicilio: data.getRegistro[0].domicilio,
            tfijo: data.getRegistro[0].telefono_particular,
            tcelular: data.getRegistro[0].telefono_celular,
            coficial: data.getRegistro[0].correo_electronico_oficial,
            cpersonal: data.getRegistro[0].correo_electronico_personal,
            docs: data.getRegistro[0].enlace_documentos
          };

          const userDataAfro = {

            folio: data.getRegistro[0].folio,
            nombre_completo: data.getRegistro[0].nombre_completo,
            seccion_electoral: data.getRegistro[0].seccion_electoral,
            demarcacion: data.getRegistro[0].id_demarcacion_territorial,
            scomunidad: data.getRegistro[0].id_comunidad,
            ncomunidad: data.getRegistro[0].nombre_comunidad,

            duninominal: data.getRegistro[0].id_direccion_distrital,

            pueblor: data.getRegistro[0].pueblo_afro,
            comunidadr: data.getRegistro[0].comunidad_afro,
            organizacion: data.getRegistro[0].organizacion_afro,
            prelevante: data.getRegistro[0].persona_relevante_afro,
            otror: data.getRegistro[0].otro_afro,

            ninstancia: data.getRegistro[0].nombre_instancia,
            cinstancia: data.getRegistro[0].cargo_instancia,
            domicilio: data.getRegistro[0].domicilio,
            tfijo: data.getRegistro[0].telefono_particular,
            tcelular: data.getRegistro[0].telefono_celular,
            coficial: data.getRegistro[0].correo_electronico_oficial,
            cpersonal: data.getRegistro[0].correo_electronico_personal,
            docs: data.getRegistro[0].enlace_documentos
          };
        
          if(data.getRegistro[0].id_comunidad == 1){
            
            this.showIndigenas = true;
            this.showAfromexicanos = false;
            this.formularioRegistro!.patchValue(userDataIndigenas);
            this.catalogo_comunidad();
            this.catalogo_barrios();
            this.catalogo_pueblor();
            this.catalogo_pueblos();
            this.catalogo_unidad_territorial();
            this.catalogo_demarcacion();

          } else {
            
            this.showAfromexicanos = true;
            this.showIndigenas = false;
            this.formularioRegistro!.patchValue(userDataAfro);
            this.catalogo_demarcacion();
            this.catalogo_comunidad();

          }

        }, error: (err) => {

          Swal.fire("Error al cargar información");

          if(err.error.code === 160) {
            this.service.cerrarSesionByToken();
          }
        }
      });

    } catch(error) {
      console.error(error)
    }
  };

  catalogo_unidad_territorial() {
    this.catalogos.getCatalogos(Number(this.formularioRegistro?.get('duninominal')?.value), "cat_unidad_territorial", this.tokenSesion).subscribe({
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

  catalogo_demarcacion() {
    this.catalogos.getCatalogos(Number(this.formularioRegistro?.get('duninominal')?.value), "cat_demarcacion_territorial", this.tokenSesion).subscribe({
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

  catalogo_pueblos() {
    this.catalogos.getCatalogos(Number(this.formularioRegistro?.get('duninominal')?.value), "cat_pueblos", this.tokenSesion).subscribe({
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
    this.catalogos.getCatalogos(Number(this.formularioRegistro?.get('duninominal')?.value), "cat_pueblos_originarios", this.tokenSesion).subscribe({
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

  catalogo_barrios() {
    this.catalogos.getCatalogos(Number(this.formularioRegistro?.get('duninominal')?.value), "cat_barrios", this.tokenSesion).subscribe({
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
    this.catalogos.getCatalogos(Number(this.formularioRegistro?.get('duninominal')?.value), "cat_comunidad", this.tokenSesion).subscribe({
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

  resetData() {
    this.onClose();
  };

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

          if (this.selectedFile instanceof File) {
            formData.append("kmlFile", this.selectedFile, this.selectedFile.name);
          } else if (!this.selectedFile && this.infoUpdate?.enlace_documentos) {
            formData.append("enlace_documentos", this.infoUpdate.enlace_documentos);
          }

          formData.append("nombre_completo", this.formularioRegistro.get('nombre_completo')?.value || "");    
          formData.append("seccion_electoral", this.formularioRegistro.get('seccion_electoral')?.value || "");
          formData.append("demarcacion", this.formularioRegistro.get('demarcacion')?.value || ""); 
          formData.append("comunidad", this.formularioRegistro.get('scomunidad')?.value || "");
          formData.append("distrito_electoral", this.formularioRegistro.get('duninominal')?.value || "");
          formData.append("nombre_comunidad", this.formularioRegistro.get('ncomunidad')?.value || "");   
          formData.append("pueblo_originario", this.formularioRegistro.get('ooriginario')?.value || "");
          formData.append("pueblo_pbl", this.formularioRegistro.get('pueblo')?.value || "");
          formData.append("barrio_pbl", this.formularioRegistro.get('barrio')?.value || "");
          formData.append("unidad_territorial_pbl", this.formularioRegistro.get('uterritorial')?.value || "");
          formData.append("comunidad_pbl", this.formularioRegistro.get('comunidad_pbl')?.value || "");
          formData.append("otro_pbl", this.formularioRegistro.get('otro')?.value || "");
          formData.append("pueblo_afro", this.formularioRegistro.get('pueblor')?.value || "");
          formData.append("comunidad_afro", this.formularioRegistro.get('comunidadr')?.value || "");
          formData.append("organizacion_afro", this.formularioRegistro.get('organizacion')?.value || "");
          formData.append("persona_relevante_afro", this.formularioRegistro.get('prelevante')?.value || "");
          formData.append("otro_afro", this.formularioRegistro.get('otror')?.value || "");
          formData.append("nombre_instancia", this.formularioRegistro.get('ninstancia')?.value || "");
          formData.append("cargo_instancia", this.formularioRegistro.get('cinstancia')?.value || "");
          formData.append("domicilio", this.formularioRegistro.get('domicilio')?.value || "");
          formData.append("telefono_particular", this.formularioRegistro.get('tfijo')?.value || "");
          formData.append("telefono_celular", this.formularioRegistro.get('tcelular')?.value || "");
          formData.append("correo_electronico_oficial", this.formularioRegistro.get('coficial')?.value || "");
          formData.append("correo_electronico_personal", this.formularioRegistro.get('cpersonal')?.value || "");
          formData.append("usuario_registro", this.id_usuario.toString());
          formData.append("modulo_registro", this.tipo_usuario.toString());
          formData.append("estado_registro", "1");
          formData.append("tipo_usuario", this.tipo_usuario.toString());

          this.registerService.nuinsertaRegistro(formData, this.tokenSesion).subscribe({
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

            if (this.selectedFile) {
              formData.append("kmlFile", this.selectedFile);          
            }else if(this.infoUpdate.enlace_documentos){
              formData.append("kmlFile", this.infoUpdate.enlace_documentos);
            }  

            if (this.idRegistro !== undefined) {
              formData.append("id_registro", this.idRegistro.toString());
            }

          formData.append("nombre_completo", this.formularioRegistro.get('nombre_completo')?.value || "");    
          formData.append("seccion_electoral", this.formularioRegistro.get('seccion_electoral')?.value || "");
          formData.append("demarcacion", this.formularioRegistro.get('demarcacion')?.value || ""); 
          formData.append("distrito_electoral", this.formularioRegistro.get('duninominal')?.value || "");
          formData.append("nombre_comunidad", this.formularioRegistro.get('ncomunidad')?.value || "");   
          formData.append("pueblo_originario", this.formularioRegistro.get('ooriginario')?.value || "");
          formData.append("pueblo_pbl", this.formularioRegistro.get('pueblo')?.value || "");
          formData.append("barrio_pbl", this.formularioRegistro.get('barrio')?.value || "");
          formData.append("unidad_territorial_pbl", this.formularioRegistro.get('uterritorial')?.value || "");
          formData.append("comunidad_pbl", this.formularioRegistro.get('comunidad_pbl')?.value || "");
          formData.append("otro_pbl", this.formularioRegistro.get('otro')?.value || "");
          formData.append("pueblo_afro", this.formularioRegistro.get('pueblor')?.value || "");
          formData.append("comunidad_afro", this.formularioRegistro.get('comunidadr')?.value || "");
          formData.append("organizacion_afro", this.formularioRegistro.get('organizacion')?.value || "");
          formData.append("persona_relevante_afro", this.formularioRegistro.get('prelevante')?.value || "");
          formData.append("otro_afro", this.formularioRegistro.get('otror')?.value || "");
          formData.append("nombre_instancia", this.formularioRegistro.get('ninstancia')?.value || "");
          formData.append("cargo_instancia", this.formularioRegistro.get('cinstancia')?.value || "");
          formData.append("domicilio", this.formularioRegistro.get('domicilio')?.value || "");
          formData.append("telefono_particular", this.formularioRegistro.get('tfijo')?.value || "");
          formData.append("telefono_celular", this.formularioRegistro.get('tcelular')?.value || "");
          formData.append("correo_electronico_oficial", this.formularioRegistro.get('coficial')?.value || "");
          formData.append("correo_electronico_personal", this.formularioRegistro.get('cpersonal')?.value || "");
          formData.append("usuario_registro", this.id_usuario.toString());
          formData.append("modulo_registro", this.tipo_usuario.toString());
          formData.append("estado_registro", "2");
          formData.append("tipo_usuario", this.tipo_usuario.toString());

            this.registerService.nuupdateRegistro(formData, this.tokenSesion).subscribe({
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

  onChangePuebloT() {
    if (this.formularioRegistro) {

      this.formularioRegistro.patchValue({
        // pueblor: '',
        comunidadr: '',
        organizacion: '',
        otror: ''
      });

      // this.formularioRegistro.get('pueblor')?.disable();
      this.formularioRegistro.get('comunidadr')?.disable();
      this.formularioRegistro.get('organizacion')?.disable();
      this.formularioRegistro.get('otror')?.disable();
    }
  }

  onChangeComunidadT() {
    if (this.formularioRegistro) {

      this.formularioRegistro.patchValue({
        pueblor: '',
        // comunidadr: '',
        organizacion: '',
        otror: ''
      });

      this.formularioRegistro.get('pueblor')?.disable();
      //this.formularioRegistro.get('comunidadr')?.disable();
      this.formularioRegistro.get('organizacion')?.disable();
      this.formularioRegistro.get('otror')?.disable();
    }
  }

  onChangeOrganizacionT() {
    if (this.formularioRegistro) {

      this.formularioRegistro.patchValue({
        pueblor: '',
        comunidadr: '',
        // organizacion: '',
        otror: ''
      });
      
      this.formularioRegistro.get('pueblor')?.disable();
      this.formularioRegistro.get('comunidadr')?.disable();
      // this.formularioRegistro.get('organizacion')?.disable();
      this.formularioRegistro.get('otror')?.disable();
    }
  }

  onChangeOtroT() {
    if (this.formularioRegistro) {

      this.formularioRegistro.patchValue({
        pueblor: '',
        comunidadr: '',
        organizacion: ''
      });

      this.formularioRegistro.get('pueblor')?.disable();
      this.formularioRegistro.get('comunidadr')?.disable();
      this.formularioRegistro.get('organizacion')?.disable();
    }
  }

  onClose() {
    this.close.emit();
  }

  eliminaRegistro() {
    Swal.fire({
      title: "¿Está seguro que desea Eliminar la Instnacia?",
      icon: "warning", 
      showCancelButton: true,
      confirmButtonColor: "#FBB03B",
      cancelButtonColor: "#9D75CA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.delService.delFirstStep(this.idRegistro, this.tokenSesion).subscribe({
          next: (data) => {
            if(data.code === 200) {
              Swal.fire({
                title: "Se han aplicado correctamente los cambios.",
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
          }
        });
      } else {
        return;
      }
    });
  }
}

