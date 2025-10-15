import { Input, Component, OnInit, Output, SimpleChanges, EventEmitter, input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Auth } from '../../../../../services/authService/auth';
import { Catalogos } from '../../../../../services/catService/catalogos';
import { Reportes } from '../../../../../services/reporteService/reportes';

@Component({
  selector: 'app-formulario-comunitaria',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
  templateUrl: './formulario-comunitaria.html',
  styleUrl: './formulario-comunitaria.css'
})
export class FormularioComunitaria {

  @Input() isOpen = false;
  @Input() idRegistroC: any;
  @Input() idRegistro : number | undefined;
  @Output() close = new EventEmitter<void>();

  formularioRegistro: FormGroup | undefined;

  catalogoDemarcacion: any = [];
  allData: any[] = [];
  infoUpdate: any = [];

  tokenSesion: string = '';
  today: string = '';
  labelTitle: string = '';
  
  moduloRegister = 0;
  area: number = 0;
  id_usuario: number = 0;
  tipo_usuario: number = 0;

  cabecera: number | null = null;
  selectedFileName: string | null = null;
  fileUploaded: boolean = false;
  selectedFile: File | null = null;
  opcionDemarcacion: any = null;

  selectedKmlFile: File | null = null;
  selectedZipFile: File | null = null;

  constructor(
    private catalogos: Catalogos,
    private service: Auth,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private registerService: Reportes,
    private Cabezera: Reportes
  ) {}

  onFileSelect(event: any, type: string) {
    if (event.target.files.length > 0) {
      if (type === "kml") {
        this.selectedKmlFile = event.target.files[0];
      } else if (type === "zip") {
        this.selectedZipFile = event.target.files[0];
      }
    }
  }

  removeFile(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    this.selectedKmlFile = null;
    this.fileUploaded = false;
    this.selectedKmlFile = null;
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

          formData.append("distrito_electoral", this.formularioRegistro.get('distrito_electoral')?.value || "");
          formData.append("distrito_cabecera", (this.cabecera ?? "").toString());
          formData.append("demarcacion_territorial", this.formularioRegistro.get('demarcacion_territorial')?.value || "");
          formData.append("denominacion_lugar", this.formularioRegistro.get('denominacion_lugar')?.value || "");
          formData.append("domicilio_lugar", this.formularioRegistro.get('domicilio_lugar')?.value || "");
          formData.append("foto", "0");
          formData.append("enlace_foto", "");
          formData.append("observaciones", this.formularioRegistro.get('observaciones')?.value || "");
          formData.append("usuario_registro", this.id_usuario.toString());
          formData.append("modulo_registro", this.moduloRegister == 2 ? '1' : this.tipo_usuario.toString());
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

            if (this.selectedKmlFile) {
              formData.append("kmlFile", this.selectedKmlFile);          
            }else if(this.infoUpdate.enlace_ubicacion){
              formData.append("kmlFile", this.infoUpdate.enlace_ubicacion);
            }

            if (this.selectedZipFile) {
              formData.append("otroFile", this.selectedZipFile);          
            }else if(this.infoUpdate.enlace_fotografia){
              formData.append("otroFile", this.infoUpdate.enlace_fotografia);
            }
            


            if (this.idRegistro !== undefined) {
              formData.append("id_registro", this.idRegistro.toString());
            }

          formData.append("distrito_electoral", this.formularioRegistro.get('distrito_electoral')?.value || "");
          formData.append("distrito_cabecera", (this.cabecera ?? "").toString());
          formData.append("demarcacion_territorial", this.formularioRegistro.get('demarcacion_territorial')?.value || "");
          formData.append("denominacion_lugar", this.formularioRegistro.get('denominacion_lugar')?.value || "");
          formData.append("domicilio_lugar", this.formularioRegistro.get('domicilio_lugar')?.value || "");
          formData.append("foto", "0");
          formData.append("enlace_foto", "");
          formData.append("observaciones", this.formularioRegistro.get('observaciones')?.value || "");
          formData.append("usuario_registro", this.id_usuario.toString());
          formData.append("modulo_registro", this.moduloRegister == 2 ? '1' : this.tipo_usuario.toString());
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

  resetData() {
    this.onClose();
    this.formularioRegistro?.reset();
  };

  ngOnInit() {
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.today = this.datePipe.transform(new Date(), 'dd/MM/yyyy')!;
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.moduloRegister = Number(localStorage.getItem('modulo')!);
    this.id_usuario = Number(sessionStorage.getItem('id_usuario'));

    if(this.moduloRegister === 1){
      this.area = Number(sessionStorage.getItem('area')!);
    }

    this.formularioRegistro = this.formBuilder.group({
      distrito_electoral: [''],
      demarcacion_territorial: [''],
      distrito_cabecera: [''],
      denominacion_lugar: [''],
      domicilio_lugar: [''],
      observaciones: [''],
      enlace_ubicacion: [''],
      fubicacion: [''],
      flugar: [{ value: '', disabled: true}]
    });

    if(!this.idRegistro){
      this.idRegistroC = true;
      this.labelTitle = ' Registro - Lugar de mayor afluencia comunitaria';
    } else {
      this.labelTitle = 'Edición - Lugar de mayor afluencia comunitaria';
      this.idRegistroC = false
      this.getDataById(this.idRegistro);
    }
  }

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    this.onClose();
  }

  seccionDemarcacion(){
    this.getCabezera();
  }

  //consulta cabezera
  getCabezera() {
    if (!this.formularioRegistro) {
      return;
    }

    const demarcacion = Number(this.formularioRegistro.get('demarcacion_territorial')?.value) || 0;

    this.Cabezera.getCabezera(this.area, demarcacion, this.tokenSesion).subscribe({
      next: (data) => {
        if (data.getCabezera.length > 0) {
          this.allData = data.getCabezera;
          this.cabecera = data.getCabezera.length > 0 
          ? data.getCabezera[0].distrito_cabecera 
          : null;
        } else {
          Swal.fire("No se encontraron registros");
        }
      },
      error: (err) => {
        if (err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }

        if (err.error.code === 100) {
          Swal.fire("No se encontraron registros");
        }
      }
    });
  }

  getDataById(id: number) {
    try {
      if (!this.idRegistro) return;

      this.registerService.getDataById(id, this.tokenSesion).subscribe({
        
        next: (data) => {

          this.infoUpdate = data.getRegistroAfluencia[0];
          
          if(data.getRegistroAfluencia.length > 0) {

            if(this.moduloRegister === 2){

              this.area = data.getRegistroAfluencia[0].distrito_electoral;

              const datosFormularioCompletos = {
                distrito_electoral: this.area,
                enlace_documento: data.getRegistroAfluencia[0].enlace_documento,
                distrito_cabecera: data.getRegistroAfluencia[0].distrito_cabecera,
                demarcacion_territorial: data.getRegistroAfluencia[0].demarcacion_territorial,
                denominacion_lugar: data.getRegistroAfluencia[0].denominacion_lugar,
                domicilio_lugar: data.getRegistroAfluencia[0].domicilio_lugar,
                enlace_foto: data.getRegistroAfluencia[0].enlace_foto,
                enlace_ubicacion: data.getRegistroAfluencia[0].enlace_ubicacion,
                observaciones: data.getRegistroAfluencia[0].observaciones,
                usuario_registro: this.id_usuario,
                modulo_registro: this.tipo_usuario,
                estado_registro: 1,
                tipo_usuario: this.tipo_usuario
              };

              this.formularioRegistro!.patchValue(datosFormularioCompletos);

              this.catalogo_demarcacion();

            } else {

              this.cabecera = data.getRegistroAfluencia[0].distrito_cabecera ?? null;

              const datosFormularioCompletos = {
                distrito_electoral: this.area,
                enlace_documento: data.getRegistroAfluencia[0].enlace_documento,
                distrito_cabecera: data.getRegistroAfluencia[0].distrito_cabecera,
                demarcacion_territorial: data.getRegistroAfluencia[0].demarcacion_territorial,
                denominacion_lugar: data.getRegistroAfluencia[0].denominacion_lugar,
                domicilio_lugar: data.getRegistroAfluencia[0].domicilio_lugar,
                enlace_foto: data.getRegistroAfluencia[0].enlace_foto,
                enlace_ubicacion: data.getRegistroAfluencia[0].enlace_ubicacion,
                observaciones: data.getRegistroAfluencia[0].observaciones,
                usuario_registro: this.id_usuario,
                modulo_registro: this.tipo_usuario,
                estado_registro: 1,
                tipo_usuario: this.tipo_usuario
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

        this.seccionDemarcacion();
      }, error: (err) => {
        
        Swal.fire("Error al cargar catalogo");

        if(err.error.code === 160) {
          this.service.cerrarSesionByToken();
        }
      }
    });
  };
}
