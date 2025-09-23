import { CommonModule, DatePipe } from '@angular/common';
import { Input, Component, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as data from '../../../../labels/label.json';
import Swal from 'sweetalert2';
import { Register } from '../../../../../services/registerService/register';
import { Auth } from '../../../../../services/authService/auth';
import { Catalogos } from '../../../../../services/catService/catalogos';

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
  
  @Input() isOpen = false;
  @Input() idRegistroC: any;
  @Input() idRegistro : number | undefined;
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

  opcionComunidad: any = null;
  opcionPuebloOriginario: any = null;
  opcionPueblo: any = null;
  opcionBarrio: any = null;
  opcionUnidadTerritorial: any = null;
  opcionDemarcacion: any = null;

  originalFormData: any = {};
  demarcacion: number = 0;
  distrito: number = 0;
  tipo_usuario: number = 0;
  id_usuario: number = 0;
  area: string = '';
  

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private registerService: Register,
    private service: Auth,
    private catalogos: Catalogos,
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
      tfijo: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      tcelular: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      docs: [{ value: '', disabled: true }],
      coficial: ['', [Validators.required, Validators.email]],
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

    console.log(this.area);

    this.originalFormData = this.formularioRegistro.getRawValue();
    this.formularioRegistro?.get('duninominal')?.setValue(this.area);
    this.id_usuario =  Number(sessionStorage.getItem('id_usuario')!);


    if(this.moduloClicked === '1.2') {
      this.showAfromexicanos = false;
      this.labelText = "Edición de Instancia Indígena";
      this.showIndigenas = true;
    } else if(this.moduloClicked === '1.3') {
      this.showAfromexicanos = true;
      this.labelText = "Edición de Instancia Afromexicana";
      this.showIndigenas = false;
    }

    this.getDataById();
    this.catalogo_comunidad();
    this.catalogo_demarcacion();
    this.catalogo_barrios();
    this.catalogo_pueblor();
    this.catalogo_pueblos();
    this.catalogo_unidad_territorial();
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

            ninstancia: data.getRegistro[0].nombre_instancia,
            cinstancia: data.getRegistro[0].cargo_instancia,
            domicilio: data.getRegistro[0].domicilio,
            tfijo: data.getRegistro[0].telefono_particular,
            tcelular: data.getRegistro[0].telefono_celular,
            coficial: data.getRegistro[0].correo_electronico_oficial,
            cpersonal: data.getRegistro[0].correo_electronico_personal
          };

          const userDataAfro = {

            folio: data.getRegistro[0].folio,
            nombre_completo: data.getRegistro[0].nombre_completo,
            seccion_electoral: data.getRegistro[0].seccion_electoral,
            demarcacion: data.getRegistro[0].id_demarcacion_territorial,
            scomunidad: data.getRegistro[0].id_comunidad,
            ncomunidad: data.getRegistro[0].nombre_comunidad,

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
            cpersonal: data.getRegistro[0].correo_electronico_personal

          };

          if(this.moduloClicked === '1.2') {
            this.showIndigenas = true;
            this.showAfromexicanos = false;
            this.formularioRegistro!.patchValue(userDataIndigenas);
          } else if(this.moduloClicked === '1.3') {
            this.showAfromexicanos = true;
            this.showIndigenas = false;
            this.formularioRegistro!.patchValue(userDataAfro);
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

  catalogo_demarcacion() {
    console.log(this.area);
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

  resetData() {
    if (this.formularioRegistro) {
      this.formularioRegistro.patchValue({
        nombre_completo: '',
        seccion_electoral: '',
        demarcacion: '',
        ncomunidad: '',

        ooriginario: '',
        pueblo: '',
        barrio: '',
        uterritorial: '',
        comunidad: '',
        otro: '',

        pueblor: '',
        comunidadr: '',
        organizacion: '',
        prelevante: '',
        otror: '',

        ninstancia: '',
        cinstancia: '',
        domicilio: '',
        tfijo: '',
        tcelular: '',
        docs: '',
        coficial: '',
        cpersonal: '',
      });

      this.formularioRegistro.get('pueblor')?.enable();
      this.formularioRegistro.get('comunidadr')?.enable();
      this.formularioRegistro.get('organizacion')?.enable();
      this.formularioRegistro.get('otror')?.enable();
      this.formularioRegistro.get('ooriginario')?.enable();
      this.formularioRegistro.get('pueblo')?.enable();
      this.formularioRegistro.get('barrio')?.enable();
      this.formularioRegistro.get('uterritorial')?.enable();
      this.formularioRegistro.get('otro')?.enable();
    }
  };

  resetFormulario() {
    this.formularioRegistro?.patchValue({
      scomunidad: this.infoUpdate.id_comunidad,

      nombre_completo: this.infoUpdate.nombre_completo,
      seccion_electoral: this.infoUpdate.seccion_electoral,
      demarcacion: this.infoUpdate.id_demarcacion_territorial,
      ncomunidad: this.infoUpdate.nombre_comunidad,

      ooriginario: this.infoUpdate.id_pueblo_originario,
      pueblo: this.infoUpdate.id_pueblo,
      barrio: this.infoUpdate.id_barrio,
      uterritorial: this.infoUpdate.id_ut,
      comunidad: this.infoUpdate.comunidad_pbl,
      otro: this.infoUpdate.otro_pbl,

      pueblor: this.infoUpdate.pueblo_afro,
      comunidadr: this.infoUpdate.comunidad_afro,
      organizacion: this.infoUpdate.organizacion_afro,
      prelevante: this.infoUpdate.persona_relevante_afro,
      otror: this.infoUpdate.otro_afro,

      ninstancia: this.infoUpdate.nombre_instancia,
      cinstancia: this.infoUpdate.cargo_instancia,
      domicilio: this.infoUpdate.domicilio,
      tfijo: this.infoUpdate.telefono_particular,
      tcelular: this.infoUpdate.telefono_celular,
      coficial: this.infoUpdate.correo_electronico_oficial,
      cpersonal: this.infoUpdate.correo_electronico_personal
    });

    if(this.formularioRegistro) {
      this.formularioRegistro.get('ooriginario')?.enable();
      this.formularioRegistro.get('pueblo')?.enable();
      this.formularioRegistro.get('barrio')?.enable();
      this.formularioRegistro.get('uterritorial')?.enable();
      this.formularioRegistro.get('otro')?.enable();

      this.formularioRegistro.get('pueblor')?.enable();
      this.formularioRegistro.get('comunidadr')?.enable();
      this.formularioRegistro.get('organizacion')?.enable();
      this.formularioRegistro.get('otror')?.enable();
      
    }
    if(this.moduloClicked === '1.2') {
      this.showIndigenas = true;
      this.showAfromexicanos = false;
    } else if(this.moduloClicked === '1.3') {
      this.showAfromexicanos = true;
      this.showIndigenas = false;
    }

    
  };

  saveForm() {
    Swal.fire({
      title: "¿Está seguro que desea Editar la Instacia? Se sobrescribirán los datos actuales.",
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
          nombre_completo: this.formularioRegistro.get('nombre_completo')?.value || null,
          seccion_electoral: Number(this.formularioRegistro.get('seccion_electoral')?.value || 0),
          demarcacion: this.opcionDemarcacion || null,
          distrito_electoral: Number(this.area),
          nombre_comunidad: this.formularioRegistro.get('ncomunidad')?.value || null,
          pueblo_originario: this.opcionPuebloOriginario || null,
          pueblo_pbl: this.opcionPueblo || null,
          barrio_pbl: this.opcionBarrio || null,
          unidad_territorial_pbl: this.opcionUnidadTerritorial || null,
          comunidad_pbl: this.formularioRegistro.get('comunidad')?.value || null,
          otro_pbl: this.formularioRegistro.get('otro')?.value || null,
          pueblo_afro: this.formularioRegistro.get('pueblor')?.value || null,
          comunidad_afro: this.formularioRegistro.get('comunidadr')?.value || null,
          organizacion_afro: this.formularioRegistro.get('organizacion')?.value || null,
          persona_relevante_afro: this.formularioRegistro.get('prelevante')?.value || null,
          otro_afro: this.formularioRegistro.get('otror')?.value || null,
          nombre_instancia: this.formularioRegistro.get('ninstancia')?.value || null,
          cargo_instancia: this.formularioRegistro.get('cinstancia')?.value || null,
          domicilio: this.formularioRegistro.get('domicilio')?.value || null,
          telefono_particular: this.formularioRegistro.get('tfijo')?.value || null,
          telefono_celular: this.formularioRegistro.get('tcelular')?.value || null,
          correo_electronico_oficial: this.formularioRegistro.get('coficial')?.value || null,
          correo_electronico_personal: this.formularioRegistro.get('cpersonal')?.value || null,
          documentos: 0,
          enlace_documentos: "https://drive.google.com/documento",
          usuario_registro: this.id_usuario,
          modulo_registro: this.tipo_usuario,
          estado_registro: 2,
          tipo_usuario: this.tipo_usuario,
          id_registro: this.idRegistro,
        };

        this.registerService.updateRegistro(datosFormularioCompletos, this.tokenSesion).subscribe({
          next: (data) => {
            if(data.code === 200) {
              Swal.fire({
                title: "Se han actualizado correctamente los cambios.",
                icon: "success",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#FBB03B",
              }).then(() => {
                this.getDataById();
                this.hayCambios = true;
              })
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

  onChangePuebloT() {
    if (this.formularioRegistro) {

      this.formularioRegistro.patchValue({
        pueblor: '',
        comunidadr: '',
        organizacion: '',
        otror: ''
      });

      this.formularioRegistro.get('pueblor')?.disable();
      this.formularioRegistro.get('comunidadr')?.disable();
      this.formularioRegistro.get('organizacion')?.disable();
      this.formularioRegistro.get('otror')?.disable();
    }
  }

  onChangeComunidadT() {
    if (this.formularioRegistro) {

      this.formularioRegistro.patchValue({
        pueblor: '',
        comunidadr: '',
        organizacion: '',
        otror: ''
      });

      this.formularioRegistro.get('pueblor')?.disable();
      this.formularioRegistro.get('comunidadr')?.disable();
      this.formularioRegistro.get('organizacion')?.disable();
      this.formularioRegistro.get('otror')?.disable();
    }
  }

  onChangeOrganizacionT() {
    if (this.formularioRegistro) {

      this.formularioRegistro.patchValue({
        pueblor: '',
        comunidadr: '',
        organizacion: '',
        otror: ''
      });
      
      this.formularioRegistro.get('pueblor')?.disable();
      this.formularioRegistro.get('comunidadr')?.disable();
      this.formularioRegistro.get('organizacion')?.disable();
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

  onBackdropClick(event: MouseEvent) {
    this.onClose();
  }
}

