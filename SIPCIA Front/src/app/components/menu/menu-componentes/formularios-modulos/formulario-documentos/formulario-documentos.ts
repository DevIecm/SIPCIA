import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, input, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Catalogos } from '../../../../../services/catService/catalogos';
import { Auth } from '../../../../../services/authService/auth';
import { Reportes } from '../../../../../services/reporteService/reportes';
import Swal from 'sweetalert2';
import { DocumentosServices } from '../../../../../services/documentosService/documentos-services';
import { CdkColumnDef } from "@angular/cdk/table";

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

  inputs: any[] = [{ value: '' }];

  addInput(): void {
    this.direccionesDistritales.push(this.formBuilder.control(''));
  }

  removeInput(index: number): void {
    if (this.direccionesDistritales.length > 1) {
      this.direccionesDistritales.removeAt(index);
    }
  }

  addInputD(): void {
    this.direccionesDistritale.push(this.formBuilder.control(''));
  }

  removeInputD(index: number): void {
    if (this.direccionesDistritale.length > 1) {
      this.direccionesDistritale.removeAt(index);
    }
  }

  @Input() isOpen = false;
  @Input() idRegistroC: any;
  @Input() formId : number | undefined;
  @Input() idSelected : number | undefined;
  @Output() close = new EventEmitter<void>();

  formularioRegistro: FormGroup | undefined;

  catalogoDemarcacion: any = [];
  infoUpdate: any = [];

  opcionDemarcacion: any = null;
  cabecera: number | null = null;
  
  tokenSesion: string = '';
  today: string = '';
  labelTitle: string = '';
  
  area: number = 0;
  id_usuario: number = 0;
  tipo_usuario: number = 0;
  cammbiosOrdenDia: number = 0;
  modulo: number = 0;

  checksDisabled: boolean = false;

  constructor(
    private catalogos: Catalogos,
    private Cabecera: Reportes,
    private service: Auth,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private registerService: DocumentosServices,
    private cdRef: ChangeDetectorRef
  ) {

     this.formularioRegistro = this.formBuilder.group({
      direccionesDistritales: this.formBuilder.array([
        this.formBuilder.group({
          distrital: ['', Validators.required]
        })
      ]),

      direccionesDistritale: this.formBuilder.array([
        this.formBuilder.group({
          distritale: ['', Validators.required]
        })
      ])
    });
  }

  get direccionesDistritales(): FormArray {
    return this.formularioRegistro?.get('direccionesDistritales') as FormArray;
  }

  get direccionesDistritale(): FormArray {
    return this.formularioRegistro?.get('direccionesDistritale') as FormArray;
  }

  saveForm(){
    try {
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

            if(this.formId === 1){
              const datosForm = {
                fecha_ficha: this.formularioRegistro.get('fecha')?.value || "",
                demarcacion_territorial: Number(this.formularioRegistro.get('demarcacion_territorial')?.value) || null,
                distrito_electoral: this.area,
                distrito_cabecera: this.cabecera,
                fecha_reunion: this.formularioRegistro.get('fechar')?.value || null,
                hora_reunion: this.formularioRegistro.get('horarior')?.value || null,
                numero_asistentes_reunion: Number(this.formularioRegistro.get('nasambler')?.value) || 0,
                lugar_reunion: this.formularioRegistro.get('lugarr')?.value || null,

                fecha_asamblea_informativa: this.formularioRegistro.get('fechaa')?.value || null,
                hora_asamblea_informativa: this.formularioRegistro.get('horarioa')?.value || null,
                numero_asistentes_informativa: Number(this.formularioRegistro.get('nasambleaa')?.value) || 0,
                lugar_asamblea_informativa: this.formularioRegistro.get('lugara')?.value || null,

                fecha_asamblea_consultiva: this.formularioRegistro.get('fechaaa')?.value || null,
                hora_asamblea_consultiva: this.formularioRegistro.get('horarioaa')?.value || null,
                numero_asistentes_consultiva: Number(this.formularioRegistro.get('nasambleaaa')?.value) || 0,
                lugar_asamblea_consultiva: this.formularioRegistro.get('lugaraa')?.value || null,

                periodo_del: this.formularioRegistro.get('defecha')?.value || null,
                periodo_al: this.formularioRegistro.get('afecha')?.value || null,
                numero_lugares_publicos: Number(this.formularioRegistro.get('nlugares')?.value) || 0,

                otro_plan_trabajo: this.formularioRegistro.get('otroPlanTrabajo')?.value || null,
                otro_resumen_acta: this.formularioRegistro.get('otroResumenActa')?.value || null,

                lengua_tecnica_indigena: this.formularioRegistro.get('lengua_tecnica_indigena')?.value || [],
                traduccion_resumen_acta: this.formularioRegistro.get('traduccion_resumen_acta')?.value || [],

                persona_responsable_fti: this.direccionesDistritales.controls.map((ctrl, index) => ({
                  dd_cabecera_demarcacion: ctrl.value,
                  direccion_distrital: this.direccionesDistritale.at(index)?.value
                })),

                solicitud_cambios: Number(this.formularioRegistro.get('cammbiosOrdenDia')?.value) || 0,
                cambios_solicitados: this.formularioRegistro.get('cuales')?.value || '',
                observaciones: this.formularioRegistro.get('observaciones')?.value || null,
                racta_nombre: this.formularioRegistro.get('racta_nombre')?.value || null,
                ptrabajo_nombre: this.formularioRegistro.get('ptrabajo_nombre')?.value || null,
                usuario_registro: this.id_usuario,
                modulo_registro: this.tipo_usuario,
                estado_registro: 1,
              }

              this.registerService.insertaFichaTecnica(datosForm, this.tokenSesion).subscribe({
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
                  
                  console.log(err);
                }
              });

            } else {

              const datosForm = {
                fecha_ficha: this.formularioRegistro.get('fecha')?.value || "",
                demarcacion_territorial: Number(this.formularioRegistro.get('demarcacion_territorial')?.value) || null,
                distrito_electoral: this.area,
                distrito_cabecera: this.cabecera,
                fecha_reunion: this.formularioRegistro.get('fechar')?.value || null,
                hora_reunion: this.formularioRegistro.get('horarior')?.value || null,
                numero_asistentes_reunion: Number(this.formularioRegistro.get('nasambler')?.value) || 0,
                lugar_reunion: this.formularioRegistro.get('lugarr')?.value || null,

                fecha_asamblea_informativa: this.formularioRegistro.get('fechaa')?.value || null,
                hora_asamblea_informativa: this.formularioRegistro.get('horarioa')?.value || null,
                numero_asistentes_informativa: Number(this.formularioRegistro.get('nasambleaa')?.value) || 0,
                lugar_asamblea_informativa: this.formularioRegistro.get('lugara')?.value || null,

                fecha_asamblea_consultiva: this.formularioRegistro.get('fechaaa')?.value || null,
                hora_asamblea_consultiva: this.formularioRegistro.get('horarioaa')?.value || null,
                numero_asistentes_consultiva: Number(this.formularioRegistro.get('nasambleaaa')?.value) || 0,
                lugar_asamblea_consultiva: this.formularioRegistro.get('lugaraa')?.value || null,

                periodo_del: this.formularioRegistro.get('defecha')?.value || null,
                periodo_al: this.formularioRegistro.get('afecha')?.value || null,
                numero_lugares_publicos: Number(this.formularioRegistro.get('nlugares')?.value) || 0,

                plan_trabajo: this.formularioRegistro.get('pafromexicana')?.value || '',
                resumen_acta: this.formularioRegistro.get('rrepresentativas')?.value || '',

                persona_responsable_fta: this.direccionesDistritales.controls.map((ctrl, index) => ({
                  dd_cabecera_demarcacion: ctrl.value,
                  direccion_distrital: this.direccionesDistritale.at(index)?.value
                })),

                solicitud_cambios: Number(this.formularioRegistro.get('cammbiosOrdenDia')?.value) || 0,
                cambios_solicitados: this.formularioRegistro.get('cuales')?.value || '',
                observaciones: this.formularioRegistro.get('observaciones')?.value || null,
                racta_nombre: this.formularioRegistro.get('racta_nombre')?.value || null,
                ptrabajo_nombre: this.formularioRegistro.get('ptrabajo_nombre')?.value || null,
                usuario_registro: this.id_usuario,
                modulo_registro: this.tipo_usuario,
                estado_registro: 2,
              }

              this.registerService.insertaFichaTecnicaAfro(datosForm, this.tokenSesion).subscribe({
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
                  
                  console.log(err);
                }
              });
            }
          }
        });
    } catch(e) {
      console.error(e);
    }
  }

  resetData(): void {
    this.onClose();
    while (this.direccionesDistritales.length > 1) {
      this.direccionesDistritales.removeAt(0);
    }
  }

  ngOnInit() {

    this.tokenSesion = sessionStorage.getItem('key')!;
    this.today = this.datePipe.transform(new Date(), 'dd/MM/yyyy')!;
    this.area = Number(sessionStorage.getItem('area')!);
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.id_usuario = Number(sessionStorage.getItem('id_usuario'));
    this.modulo = Number(localStorage.getItem('modulo'));

    this.formularioRegistro = this.formBuilder.group({
      demarcacion_territorial: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      ddemarcacion: [{ value: '', disabled: true }],
      
      fechar: ['', [Validators.required]],
      horarior: ['', [Validators.required]],
      nasambler: [''],
      lugarr: [''],

      fechaa: ['', [Validators.required]],
      horarioa: ['', [Validators.required]],
      nasambleaa: [''],
      lugara: [''],

      fechaaa: ['', [Validators.required]],
      horarioaa: ['', [Validators.required]],
      nasambleaaa: [''],
      lugaraa: [''],

      defecha: ['', [Validators.required]],
      afecha: ['', [Validators.required]],

      nlugares: [''],

      pafromexicana: [''],
      rrepresentativas: [''],

      lengua_tecnica_indigena: this.formBuilder.array([]),
      otroPlanTrabajo: [''],

      traduccion_resumen_acta: this.formBuilder.array([]),
      otroResumenActa: [''],

      direccionesDistritales: this.formBuilder.array([
        this.formBuilder.control('')
      ]),

      direccionesDistritale: this.formBuilder.array([
        this.formBuilder.control('')
      ]),

      cammbiosOrdenDia: [''],
      observaciones: [''],
      ptrabajo_nombre: [''],
      racta_nombre: [''],
      cuales: ['']
    });
    
    setTimeout(() => {
      this.cdRef.detectChanges();
    });

    this.labelTitle = 'Ficha técnica de la reunión de trabajo con instancias representativas y autoridades tradicionales de forma previa a la realización de las asambleas comunitarias.';

    if(this.idSelected && this.idSelected > 0) {
      this.formularioRegistro.disable();
      this.getDataById();
      this.checksDisabled = true;
    } 

    if(this.modulo === 2){
      this.formularioRegistro?.disable();
    }

    if(this.modulo === 1) {
      this.catalogo_demarcacion();
    }
  }

  onClose() {
    this.close.emit();
    this.cdRef.detectChanges();
  }

  seccionDemarcacion(){
    this.getCabezera();
  }

  getCabezera() {
    if (!this.formularioRegistro) {
      return;
    }
  
    const demarcacion = Number(this.formularioRegistro.get('demarcacion_territorial')?.value) || 0;
  
    this.Cabecera.getCabezera(this.area, demarcacion, this.tokenSesion).subscribe({
      next: (data) => {
        if (data.getCabezera.length > 0) {
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
  
  onCheckboxChange(event: any, controlName: string) {
    const formArray: FormArray = this.formularioRegistro?.get(controlName) as FormArray;
    
    if (event.target.checked) {
      formArray.push(this.formBuilder.control(event.target.value));
    } else {
      const index = formArray.controls.findIndex(x => x.value === event.target.value);
      if (index !== -1) {
        formArray.removeAt(index);
      }
    }
  }

  private isoToDDMMYYYY(iso?: string): string {
    if (!iso) return '';
    const datePart = iso.split('T')[0];            
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;              
  }

  getDataById() {
    try {

      if(this.formId === 1) {

      this.registerService.getDataFichaTecnicaById(this.idSelected ?? 0, this.tokenSesion).subscribe({
        
        next: (data) => {
          this.infoUpdate = data.getRegistroFichaInd[0];

          if(data.getRegistroFichaInd.length > 0) {

            if(this.modulo === 2) {
              this.area = this.infoUpdate.distrito_electoral;
            }

            const datosCargados = {
              fecha: this.infoUpdate.fecha_asamblea_informativa ? new Date(this.infoUpdate.fecha_ficha).toISOString().split('T')[0] : '',
              demarcacion_territorial: this.infoUpdate.id_demarcacion,
              ddemarcacion: this.infoUpdate.distrito_cabecera ? this.infoUpdate.distrito_cabecera : '',
              
              fechar: this.infoUpdate.fecha_reunion ? new Date(this.infoUpdate.fecha_reunion).toISOString().split('T')[0] : '',
              horarior: this.infoUpdate.hora_reunion ? new Date(this.infoUpdate.hora_reunion).toISOString().substr(11, 5) : '',
              nasambler: this.infoUpdate.numero_asistentes_reunion ? this.infoUpdate.numero_asistentes_reunion : '',
              lugarr: this.infoUpdate.lugar_reunion ? this.infoUpdate.lugar_reunion : '',

              fechaa: this.infoUpdate.fecha_asamblea_informativa ? new Date(this.infoUpdate.fecha_asamblea_informativa).toISOString().split('T')[0] : '',
              horarioa: this.infoUpdate.hora_asamblea_informativa ? new Date(this.infoUpdate.hora_asamblea_informativa).toISOString().substr(11, 5) : '',
              nasambleaa: this.infoUpdate.numero_asistentes_informativa ? this.infoUpdate.numero_asistentes_informativa : '',
              lugara: this.infoUpdate.lugar_asamblea_informativa ? this.infoUpdate.lugar_asamblea_informativa : '',

              fechaaa: this.infoUpdate.fecha_asamblea_consultiva ? new Date(this.infoUpdate.fecha_asamblea_consultiva).toISOString().split('T')[0] : '',
              horarioaa: new Date(this.infoUpdate.hora_asamblea_consultiva).toISOString().substr(11, 5),
              nasambleaaa: this.infoUpdate.numero_asistentes_consultiva,
              lugaraa: this.infoUpdate.lugar_asamblea_consultiva,

              defecha: this.infoUpdate.periodo_del ? new Date(this.infoUpdate.periodo_del).toISOString().split('T')[0] : '',
              afecha: this.infoUpdate.periodo_al ? new Date(this.infoUpdate.periodo_al).toISOString().split('T')[0] : '',

              nlugares: this.infoUpdate.numero_lugares_publicos ? this.infoUpdate.numero_lugares_publicos : '',

              otroPlanTrabajo: this.infoUpdate.otro_plan_trabajo ? this.infoUpdate.otro_plan_trabajo : '',

              otroResumenActa: this.infoUpdate.otro_resumen_acta ? this.infoUpdate.otro_resumen_acta : '',

              cammbiosOrdenDia: this.infoUpdate.solicitud_cambios === false ? "0" : "1",
              observaciones: this.infoUpdate.observaciones ? this.infoUpdate.observaciones : '',
              ptrabajo_nombre: this.infoUpdate.ptrabajo_nombre ? this.infoUpdate.ptrabajo_nombre : '',
              racta_nombre: this.infoUpdate.racta_nombre ? this.infoUpdate.racta_nombre : '',
              cuales: this.infoUpdate.cambios_solicitados ? this.infoUpdate.cambios_solicitados : '',
            }

            this.formularioRegistro!.patchValue(datosCargados);
            this.catalogo_demarcacion();

            const lenguasSeleccionadas = this.infoUpdate.lenguas?.map((l: { id_lengua: { toString: () => any; }; }) => l.id_lengua.toString()) ?? [];

            setTimeout(() => {
              lenguasSeleccionadas.forEach((id: string) => {
                const checkbox = document.querySelector(
                  `input[type="checkbox"][value="${id}"][data-group="lengua_tecnica_indigena"]`
                ) as HTMLInputElement;

                if (checkbox) {
                  checkbox.checked = true;
                  this.onCheckboxChange({ target: checkbox } as any, 'lengua_tecnica_indigena');
                }
              });
            }, 0);

            const resumenSeleccionadas = this.infoUpdate.resumen?.map((l: { id_lengua: { toString: () => any; }; }) => l.id_lengua.toString()) ?? [];

            setTimeout(() => {
              resumenSeleccionadas.forEach((id: string) => {
                const checkbox = document.querySelector(
                  `input[type="checkbox"][value="${id}"][data-group="traduccion_resumen_acta"]`
                ) as HTMLInputElement;

                if (checkbox) {
                  checkbox.checked = true;
                  this.onCheckboxChange({ target: checkbox } as any, 'traduccion_resumen_acta');
                }
              });
            }, 0);

                // solo carga lo capturado

          const personaResponsables = this.infoUpdate.personaRes ?? [];

          const direcciones = this.formularioRegistro?.get('direccionesDistritales') as FormArray;
          const distritales = this.formularioRegistro?.get('direccionesDistritale') as FormArray;

          direcciones.clear();
          distritales.clear();

          personaResponsables.forEach((persona: any) => {

            const cab = persona.dd_cabecera_demarcacion;
            const dir = persona.direccion_distrital;

            if (
              cab && cab.toString().trim() !== "" &&
              dir && dir.toString().trim() !== ""
            ) {
              direcciones.push(this.formBuilder.control(cab));
              distritales.push(this.formBuilder.control(dir));
            }
          });
          
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

    } else {

      this.registerService.getDataFichaTecnicaByIdAfro(this.idSelected ?? 0, this.tokenSesion).subscribe({
        
        next: (data) => {
          this.infoUpdate = data.getRegistroFichaAfro[0];
          
          if(data.getRegistroFichaAfro.length > 0) {

            if(this.modulo === 2) {
              this.area = this.infoUpdate.distrito_electoral;
            }

            const datosFormularioCompletos = {
              demarcacion_territorial: this.infoUpdate.id_demarcacion,
              fecha: this.infoUpdate.fecha_asamblea_informativa ? new Date(this.infoUpdate.fecha_ficha).toISOString().split('T')[0] : '',
              ddemarcacion: this.infoUpdate.distrito_cabecera ? this.infoUpdate.distrito_cabecera : '',
              
              fechar: this.infoUpdate.fecha_reunion ? new Date(this.infoUpdate.fecha_reunion).toISOString().split('T')[0] : '',
              horarior: this.infoUpdate.hora_reunion ? new Date(this.infoUpdate.hora_reunion).toISOString().substr(11, 5) : '',
              nasambler: this.infoUpdate.numero_asistentes_reunion ? this.infoUpdate.numero_asistentes_reunion : '',
              lugarr: this.infoUpdate.lugar_reunion ? this.infoUpdate.lugar_reunion : '',

              fechaa: this.infoUpdate.fecha_asamblea_informativa ? new Date(this.infoUpdate.fecha_asamblea_informativa).toISOString().split('T')[0] : '',
              horarioa: this.infoUpdate.hora_asamblea_informativa ? new Date(this.infoUpdate.hora_asamblea_informativa).toISOString().substr(11, 5) : '',
              nasambleaa: this.infoUpdate.numero_asistentes_informativa ? this.infoUpdate.numero_asistentes_informativa : '',
              lugara: this.infoUpdate.lugar_asamblea_informativa ? this.infoUpdate.lugar_asamblea_informativa : '',

              fechaaa: this.infoUpdate.fecha_asamblea_consultiva ? new Date(this.infoUpdate.fecha_asamblea_consultiva).toISOString().split('T')[0] : '',
              horarioaa: new Date(this.infoUpdate.hora_asamblea_consultiva).toISOString().substr(11, 5),
              nasambleaaa: this.infoUpdate.numero_asistentes_consultiva,
              lugaraa: this.infoUpdate.lugar_asamblea_consultiva,

              defecha: this.infoUpdate.periodo_del ? new Date(this.infoUpdate.periodo_del).toISOString().split('T')[0] : '',
              afecha: this.infoUpdate.periodo_al ? new Date(this.infoUpdate.periodo_al).toISOString().split('T')[0] : '',

              nlugares: this.infoUpdate.numero_lugares_publicos ? this.infoUpdate.numero_lugares_publicos : '',

              pafromexicana: this.infoUpdate.plan_trabajo ? this.infoUpdate.plan_trabajo : '',
              rrepresentativas: this.infoUpdate.resumen_acta ? this.infoUpdate.resumen_acta : '',
              
              cammbiosOrdenDia: this.infoUpdate.solicitud_cambios === false ? "0" : "1",
              observaciones: this.infoUpdate.observaciones ? this.infoUpdate.observaciones : '',
              ptrabajo_nombre: this.infoUpdate.ptrabajo_nombre ? this.infoUpdate.ptrabajo_nombre : '',
              racta_nombre: this.infoUpdate.racta_nombre ? this.infoUpdate.racta_nombre : '',
              cuales: this.infoUpdate.cambios_solicitados ? this.infoUpdate.cambios_solicitados : '',
            };

            this.formularioRegistro!.patchValue(datosFormularioCompletos);
            this.catalogo_demarcacion();

          // solo carga lo capturado

          const personaResponsables = this.infoUpdate.personaRes ?? [];

          const direcciones = this.formularioRegistro?.get('direccionesDistritales') as FormArray;
          const distritales = this.formularioRegistro?.get('direccionesDistritale') as FormArray;

          direcciones.clear();
          distritales.clear();

          personaResponsables.forEach((persona: any) => {

            const cab = persona.dd_cabecera_demarcacion;
            const dir = persona.direccion_distrital;

            if (
              cab && cab.toString().trim() !== "" &&
              dir && dir.toString().trim() !== ""
            ) {
              direcciones.push(this.formBuilder.control(cab));
              distritales.push(this.formBuilder.control(dir));
            }
          });
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
    }

    } catch(error) {
      console.error(error);
    }
  }

  catalogo_demarcacion() {
    this.catalogos.getCatalogos(this.area, "cat_demarcacion_territorial", this.tokenSesion).subscribe({
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
  
