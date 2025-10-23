import { Input, Component, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import * as data from '../../../../labels/label.json';
import Swal from 'sweetalert2';
import { Register } from '../../../../../services/registerService/register';
import { Auth } from '../../../../../services/authService/auth';
import { Catalogos } from '../../../../../services/catService/catalogos';
import { Reportes } from '../../../../../services/reporteService/reportes';
import { DeleteService } from '../../../../../services/deleteServices/delete-service';

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

  tokenSesion: string = '';
  today: string = '';
  labelTitle: string = '';

  consecutivo: number = 0;
  area: number = 0;
  id_usuario: number = 0;
  cabecera: number = 0;
  tipo_usuario: number = 0;
  moduloRegister: number = 0;
  
  opcionDemarcacion: any = null;
  selectedFile: File | null = null;
  selectedKmlFile: File | null = null;
  selectedZipFile: File | null = null;
  selectedFileName: string | null = null;

  fileUploadedu: boolean = false;
  fileUploadedf: boolean = false;

  constructor(
    private catalogos: Catalogos,
    private service: Auth,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private registerService: Reportes,
    private delService: DeleteService,
  ) {}

  ngOnInit() {
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.today = this.datePipe.transform(new Date(), 'dd/MM/yyyy')!;
    this.area = Number(sessionStorage.getItem('area')!);
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.cabecera = Number(sessionStorage.getItem('cabecera'));
    this.id_usuario = Number(sessionStorage.getItem('id_usuario'));
    this.moduloRegister = Number(localStorage.getItem('modulo'));

    this.formularioRegistro = this.formBuilder.group({
      dDistrital: [{ value:'', disabled: true}],
      demarcacion: ['', [Validators.required]],
      lugar_espacio: ['', [Validators.required]],
      intitucion_propietaria: ['', [Validators.required]],
      domicilio: ['', [Validators.required]],
      superficie_espacio: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(1000),
        Validators.pattern('^[0-9]+$')
      ]),
      aforo: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(1000),
        Validators.pattern('^[0-9]+$')
      ]),
      observaciones: [''],
      anterioridad: new FormControl('0', []),
      prestamo: new FormControl('0'),
      ventilacion: new FormControl('0'),
      consecutivo: [{value: '', disabled: true}]
    });

    if(this.moduloRegister === 1){
      this.area = Number(sessionStorage.getItem('area')!);
    }

    if(!this.idRegistro){
      this.idRegistroC = true;
      this.labelTitle = 'Registro - Propuesta de lugares y espacios para Asambleas Comunitarias';
      this.catalogo_demarcacion();
    } else {
      this.labelTitle = 'Edición - Propuesta de lugares y espacios para Asambleas Comunitarias';
      this.idRegistroC = false;
      this.getDataById(this.idRegistro);
    }
  }

  onFileSelect(event: any, type: string) {
    if (event.target.files.length > 0) {
      if (type === "kml") {
        this.selectedKmlFile = event.target.files[0];
         this.fileUploadedu = true;
      } else if (type === "zip") {
        this.selectedZipFile = event.target.files[0];
        this.fileUploadedf = true;
      }
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.fileUploadedf = false;

    if (this.infoUpdate?.enlace_fotografia) {
      this.infoUpdate.enlace_fotografia = null;
    }

    const fileInputf = document.getElementById('formFilef') as HTMLInputElement;
    
    if (fileInputf) {
      fileInputf.value = '';
    }
  }

  removeFileu(): void {
    this.selectedFile = null;
    this.fileUploadedu = false;

    if (this.infoUpdate?.enlace_ubicacion) {
      this.infoUpdate.enlace_ubicacion = null;
    }

    const fileInputu = document.getElementById('formFileu') as HTMLInputElement;
    
    if (fileInputu) {
      fileInputu.value = '';
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

            if (this.selectedZipFile) {
              formData.append("otroFile", this.selectedZipFile);
            }

              formData.append("usuario_registro", this.id_usuario.toString());
              formData.append("distrito_electoral", this.area.toString());
              formData.append("demarcacion", this.formularioRegistro.get('demarcacion')?.value || "");
              formData.append("lugar_espacio", this.formularioRegistro.get('lugar_espacio')?.value || "");
              formData.append("domicilio", this.formularioRegistro.get('domicilio')?.value || "");
              formData.append("fotografia", "0");
              formData.append("enlace_fotografia", "ruta/documento");              
              formData.append("intitucion_propietaria", this.formularioRegistro.get('intitucion_propietaria')?.value || "");
              formData.append("prestamo_iecm", this.formularioRegistro.get('anterioridad')?.value || "0");
              formData.append("nuevo_prestamo", this.formularioRegistro.get('prestamo')?.value || "0");
              formData.append("superficie_espacio", this.formularioRegistro.get('superficie_espacio')?.value || "");
              formData.append("aforo", this.formularioRegistro.get('aforo')?.value || "");
              formData.append("ventilacion", this.formularioRegistro.get('ventilacion')?.value || "0");
              formData.append("observaciones", this.formularioRegistro.get('observaciones')?.value || "");
              formData.append("modulo_registro", this.tipo_usuario.toString());
              formData.append("estado_registro", "1");
              

            this.registerService.nuinsertaRegistroComunitaria(formData, this.tokenSesion).subscribe({
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
              const formData = new FormData();

            if (!this.formularioRegistro) {
              return;
            }

            if (this.selectedKmlFile) {
              formData.append("kmlFile", this.selectedKmlFile);          
            }else if(this.infoUpdate.enlace_ubicacion){
              formData.append("kmlFile", this.infoUpdate.enlace_ubicacion);
            }

            if (this.selectedZipFile) {
              formData.append("otroFile", this.selectedZipFile);          
            }else if(this.infoUpdate.enlace_foto){
              formData.append("otroFile", this.infoUpdate.enlace_foto);
            }


            if (this.idRegistro !== undefined) {
              formData.append("id_registro", this.idRegistro.toString());
            }

              formData.append("distrito_electoral", this.area.toString());
              formData.append("demarcacion", this.formularioRegistro.get('demarcacion')?.value || "");
              formData.append("lugar_espacio", this.formularioRegistro.get('lugar_espacio')?.value || "");
              formData.append("domicilio", this.formularioRegistro.get('domicilio')?.value || "");
              formData.append("fotografia", "0");
              formData.append("enlace_fotografia", "ruta/documento");           
              formData.append("intitucion_propietaria", this.formularioRegistro.get('intitucion_propietaria')?.value || "");
              formData.append("prestamo_iecm", this.formularioRegistro.get('anterioridad')?.value || "0");
              formData.append("nuevo_prestamo", this.formularioRegistro.get('prestamo')?.value || "0");
              formData.append("superficie_espacio", this.formularioRegistro.get('superficie_espacio')?.value || "");
              formData.append("aforo", this.formularioRegistro.get('aforo')?.value || "");
              formData.append("ventilacion", this.formularioRegistro.get('ventilacion')?.value || "0");
              formData.append("observaciones", this.formularioRegistro.get('observaciones')?.value || "");
              formData.append("usuario_registro", this.id_usuario.toString());
              formData.append("modulo_registro", this.moduloRegister === 2 ? '1' : this.tipo_usuario.toString());
              formData.append("estado_registro", "2");

            this.registerService.nuupdateRegistroComunitaria(formData, this.tokenSesion).subscribe({
              next: (data) => {
                if(data.code === 200) {
                  Swal.fire({
                    title: " Se han guardado correctamente los cambios.",
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
    this.onClose();
  };

  getDataById(id: number) {
    try {
      if (!this.idRegistro) return;

      this.registerService.getDataByIdComunitaria(id, this.tokenSesion).subscribe({
        
        next: (data) => {

          this.infoUpdate = data.getRegistroLugares[0];
          
          if(data.getRegistroLugares.length > 0) {

            if(this.moduloRegister === 2){

              this.area = data.getRegistroLugares[0].distrito_electoral;

              const datosFormularioCompletos = {
                usuario_registro: this.id_usuario,
                enlace_fotografia: data.getRegistroLugares[0].enlace_fotografia,
                consecutivo: data.getRegistroLugares[0].consecutivo,
                distrito_electoral: this.area,
                demarcacion: data.getRegistroLugares[0].id_demarcacion,
                lugar_espacio: data.getRegistroLugares[0].lugar_espacio,
                domicilio: data.getRegistroLugares[0].domicilio, 
                intitucion_propietaria: data.getRegistroLugares[0].intitucion_propietaria,
                anterioridad: data.getRegistroLugares[0].prestamo_iecm === false ? "0" : "1",
                prestamo: data.getRegistroLugares[0].nuevo_prestamo === false ? "0" : "1",
                superficie_espacio: data.getRegistroLugares[0].superficie_espacio,
                aforo: data.getRegistroLugares[0].aforo,
                ventilacion: data.getRegistroLugares[0].ventilacion === false ? "0" : "1",
                observaciones: data.getRegistroLugares[0].observaciones,
                enlace_ubicacion: data.getRegistroLugares[0].enlace_ubicacion,
                modulo_registro: this.tipo_usuario,
                estado_registro: 1
              };

              this.formularioRegistro!.patchValue(datosFormularioCompletos);
              this.catalogo_demarcacion();
            
            } else {

              const datosFormularioCompletos = {
                usuario_registro: this.id_usuario,
                enlace_fotografia: data.getRegistroLugares[0].enlace_fotografia,
                consecutivo: data.getRegistroLugares[0].consecutivo,
                distrito_electoral: this.area,
                demarcacion: data.getRegistroLugares[0].id_demarcacion,
                lugar_espacio: data.getRegistroLugares[0].lugar_espacio,
                domicilio: data.getRegistroLugares[0].domicilio, 
                intitucion_propietaria: data.getRegistroLugares[0].intitucion_propietaria,
                anterioridad: data.getRegistroLugares[0].prestamo_iecm === false ? "0" : "1",
                prestamo: data.getRegistroLugares[0].nuevo_prestamo === false ? "0" : "1",
                superficie_espacio: data.getRegistroLugares[0].superficie_espacio,
                aforo: data.getRegistroLugares[0].aforo,
                ventilacion: data.getRegistroLugares[0].ventilacion === false ? "0" : "1",
                observaciones: data.getRegistroLugares[0].observaciones,
                enlace_ubicacion: data.getRegistroLugares[0].enlace_ubicacion,
                modulo_registro: this.tipo_usuario,
                estado_registro: 1
              };

              this.formularioRegistro!.patchValue(datosFormularioCompletos);
              this.catalogo_demarcacion();

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

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    this.onClose();
  }

  eliminaRegistro() {
    Swal.fire({
      title: "¿Está seguro que desea Eliminar la Instacia?",
      icon: "warning", 
      showCancelButton: true,
      confirmButtonColor: "#FBB03B",
      cancelButtonColor: "#9D75CA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.delService.delSecondPointEightStep(this.idRegistro, this.tokenSesion).subscribe({
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
