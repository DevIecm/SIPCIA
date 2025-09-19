import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../../../navbar/navbar';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import * as data from '../../../../labels/label.json';
import Swal from 'sweetalert2';
import { Catalogos } from '../../../../../services/catService/catalogos';
import { Auth } from '../../../../../services/authService/auth';
import { Register } from '../../../../../services/registerService/register';

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

  data: any = data;
  formularioRegistro: FormGroup | undefined;
  seleccionado: any;
  myDate: string | number | Date | undefined;
  tokenSesion: string = '';
  position: string = '';

  catalogoComunidad: any = [];
  catalogoPueblos: any = [];
  catalogoPueblor: any = [];
  catalogoBarrios: any = [];
  catalogoUnidadTerritorial: any = [];
  catalogoDemarcacion: any = [];

  showIndigenas: boolean = false;
  showAfromexicanos: boolean = false;
  liberaForm: boolean = false;

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
  area: string = '';
  id_usuario: number = 0;  

  constructor(
    private service: Auth, 
    private router: Router, 
    private catalogos: Catalogos, 
    private formBuilder: FormBuilder, 
    private datePipe: DatePipe,
    private serviceRegister: Register
  ) {}  

  ngOnInit(): void {
    this.formularioRegistro = this.formBuilder.group({
      nombre_completo: ['', Validators.required],
      seccion_electoral: ['', Validators.required],
      demarcacion: [''],
      duninominal: [{ value: '', disabled: true }],
      scomunidad: [''],
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

    this.currentTime = this.datePipe.transform(new Date(), 'HH:mm:ss') + ' hrs.';
    this.today = this.datePipe.transform(new Date(), 'dd/MM/yyyy')!;
    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.position = sessionStorage.getItem('dir')!;
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.area = sessionStorage.getItem('area')!;
    this.id_usuario = Number(sessionStorage.getItem('id_usuario')!);

    this.originalFormData = this.formularioRegistro.getRawValue();
    this.catalogo_comunidad();
    this.catalogo_demarcacion();
    this.formularioRegistro?.get('duninominal')?.setValue(this.area);
  }

  onChangeComunidad() {
    if(this.opcionComunidad == 1) {
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


    } else if(this.opcionComunidad == 2) {
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

  onChangePuebloT() {
    if (this.formularioRegistro) {
      this.formularioRegistro.get('pueblor')?.disable();
      this.formularioRegistro.get('comunidadr')?.disable();
      this.formularioRegistro.get('organizacion')?.disable();
      this.formularioRegistro.get('otror')?.disable();
    }
  }

  onChangeComunidadT() {
    if (this.formularioRegistro) {
      this.formularioRegistro.get('pueblor')?.disable();
      this.formularioRegistro.get('comunidadr')?.disable();
      this.formularioRegistro.get('organizacion')?.disable();
      this.formularioRegistro.get('otror')?.disable();
    }
  }

  onChangeOrganizacionT() {
    if (this.formularioRegistro) {
      this.formularioRegistro.get('pueblor')?.disable();
      this.formularioRegistro.get('comunidadr')?.disable();
      this.formularioRegistro.get('organizacion')?.disable();
      this.formularioRegistro.get('otror')?.disable();
    }
  }

  onChangeOtroT() {
    if (this.formularioRegistro) {
      this.formularioRegistro.get('pueblor')?.disable();
      this.formularioRegistro.get('comunidadr')?.disable();
      this.formularioRegistro.get('organizacion')?.disable();
    }
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
  
  liberaFormulario() {
    this.liberaForm = true;
  }

  saveForm() {

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
          
        if (!this.formularioRegistro) {
          return;
        }

        const datosFormularioCompletos = {
          nombre_completo: this.formularioRegistro.get('nombre_completo')?.value || null,
          seccion_electoral: Number(this.formularioRegistro.get('seccion_electoral')?.value || 0),
          demarcacion: this.opcionDemarcacion || null,
          distrito_electoral: Number(this.area),
          comunidad: Number(this.opcionComunidad) || null,
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
          estado_registro: 1,
          tipo_usuario: this.tipo_usuario
        };

        this.serviceRegister.insertaRegistro(datosFormularioCompletos, this.tokenSesion).subscribe({
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
  };
  
  resetData() {
    this.router.navigate(['nregistro']);
    // this.formularioRegistro?.reset();

    if (this.formularioRegistro) {
      this.formularioRegistro.patchValue({
        nombre_completo: '',
        seccion_electoral: '',
        demarcacion: '',
        scomunidad: '',
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
    

    this.liberaForm = false;
  };
}