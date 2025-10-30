import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Navbar } from '../../../../navbar/navbar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as data from '../../../../labels/label.json';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Reportes } from '../../../../../services/reporteService/reportes';
import { Auth } from '../../../../../services/authService/auth';
import { FormularioDocumentos } from "../../formularios-modulos/formulario-documentos/formulario-documentos";
import { DocumentosServices } from '../../../../../services/documentosService/documentos-services';
import { DeleteService } from '../../../../../services/deleteServices/delete-service';
@Component({
  selector: 'app-documentos-afro-two',
  imports: [
    Navbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormularioDocumentos
  ],
  templateUrl: './documentos-afro-two.html',
  styleUrl: './documentos-afro-two.css'
})
export class DocumentosAfroTwo implements OnInit{
  @Output() close = new EventEmitter<void>();

  activeTab: string = 'home';
  data: any = data;

  nombreUser: string = '';
  cargoUser: string = '';
  position: string = '';
  ombreUser: string = '';
  tokenSesion: string = '';
  searchTerm: string = '';
  nombreOtrosDocumentos: string= '';
  sortColumn: string = '';

  sortDirection: 'asc' | 'desc' = 'asc';

  area_adscripcion: number = 0;
  tipo_usuario: number = 0;
  tipo_documentos: number = 0;
  idformIdSelected: number | undefined;
  idform: number | undefined;
  estado_documento: number = 1;
  tipo_documento: number = 1;

  dataTable: any = [];
  allDatable: any[] = [];
  dataTableTwo: any = [];
  allDatableTwo: any[] = [];
  dataTableInd: any = [];

  dataTableD: any = [];
  allDatableD: any[] = [];

  showModal = false;
  
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  fileUploaded: boolean = false;

  ngOnInit(): void {
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
    this.position = sessionStorage.getItem('dir')!;
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.area_adscripcion = Number(sessionStorage.getItem('area'));

    this.getRegister(1);
  }

  constructor(
    private router: Router,
    private reporteService: DocumentosServices,
    private service: Auth,
    private miServicio: Reportes,
    private docService: Reportes,
    private serviceRegister: Reportes,
    private delDoc: DeleteService,
    private delFicha: DeleteService
  ) {}
  
  logout() {
    this.router.navigate(['']);
  };

  triggerFileInput() {
    const input = document.getElementById('fileInputZip') as HTMLInputElement;
    input.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadZip(this.estado_documento, this.tipo_documento);
    }
  }

  uploadZip(estado_documento: number, tipo_documento: number) {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('archivoZip', this.selectedFile);
    formData.append('distrito', this.area_adscripcion.toString());
    formData.append('tipo_comunidad', "2");
    formData.append('estado_documento', estado_documento.toString());
    formData.append('tipo_documento', tipo_documento.toString());

    this.docService.subirDocumentoNormativo(formData, this.tokenSesion).subscribe({
      next: (res) => {
        alert('Documento subido correctamente');
        let tabActual: number;

        switch (this.activeTab) {
          case 'home': tabActual = 1; break;
          case 'profile': tabActual = 2; break;
          case 'contact': tabActual = 3; break;
          case 'other': tabActual = 4; break;
          default: tabActual = 1;
        }

        this.getRegister(tabActual);

      },
      error: (err) => {
        console.error('Error al subir documento', err);
        alert('Error al subir documento');
      }
    });
  }


    delete_ficha(id: number) {
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
              this.delFicha.eliminaFichAfro(id, this.tokenSesion).subscribe({
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
                      this.getRegisterFichaTecnica();
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

  getdata(){
    this.serviceRegister.getOtrosDocumentos(this.area_adscripcion, 1, this.tokenSesion).subscribe({
      next: (data) => {
        if(data.getOtrosDocumentos.length > 0) {
          this.dataTableD = data.getOtrosDocumentos;
          this.allDatableD = data.getOtrosDocumentos;           
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

  onValidateInfo() {
    this.router.navigate(['/menutwo']);
  };

  openModal(id: number | undefined, idRegistro: number | undefined) {
    this.showModal = true;
    this.idformIdSelected = id;
    this.idform = idRegistro;
  }

  closeModal() {
    this.showModal = false;
  }

  descargar(){
    this.miServicio.descargarDocNorma("1758128882717-purebaComunidadIndigena.pdf", this.tokenSesion).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Documentos Normativos';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error al descargar archivo:', err)
    });
  }

  onClose() {
    this.close.emit();
  }

delete_item(id: number) {
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
      this.delDoc.eliminaDocs(id, this.tokenSesion).subscribe({
        next: (data) => {
          if (data.code === 200) {
            Swal.fire({
              title: "Se han aplicado correctamente los cambios.",
              icon: "success",
              confirmButtonText: "Aceptar",
              confirmButtonColor: "#FBB03B",
            });

            let tabActual: number;
            switch (this.activeTab) {
              case 'home': tabActual = 1; break;
              case 'profile': tabActual = 2; break;
              case 'other': tabActual = 3; break; 
              default: tabActual = 1;
            }

          console.log('Tab actual:', this.activeTab, '->', tabActual);
          this.getRegister(tabActual);

          }
        },
        error: (err) => {
          if (err.error.code === 160) {
            this.service.cerrarSesionByToken();
          }
        }
      });
    }
  });
}


  descargarOtros(nameArchivo: any){
    this.miServicio.descargarOtrosNorma(nameArchivo, this.tokenSesion).subscribe({

      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nameArchivo;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error al descargar archivo:', err)
    });
  }

  formatFecha(data: any) {
    const isoDate = data;
    const date = new Date(isoDate);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

getRegister(id: number) {
  this.reporteService.getRegisterfichaTecnicaTablaTwo(2, id, this.tokenSesion).subscribe({
    next: (data) => {
      switch(id) {
        case 1:
          this.dataTableTwo = data.getDocumentos || [];
          break;
        case 2:
          this.allDatableTwo = data.getDocumentos || [];
          break;
        case 3:
          this.dataTableInd = data.getDocumentos || [];
          break;
        default:
          break;
      }
      if(!data.getDocumentos || data.getDocumentos.length === 0){
        Swal.fire("No se encontraron registros");
      }
    },
    error: (err) => {
      if (err.error.code === 160) this.service.cerrarSesionByToken();
      if(err.error.code === 100) Swal.fire("No se encontraron registros");
    }
  });
}



  getRegisterFichaTecnica() {
    this.reporteService.getRegisterfichaTecnicaTablaAfroTwo(this.tokenSesion).subscribe({
      next: (data) => {
        if(data.getFichasAfro.length > 0) {
          this.dataTable = data.getFichasAfro;
          this.allDatable = data.getFichasAfro;
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

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'bi bi-arrow-down-up';
    return this.sortDirection === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.dataTable.sort((a: any, b: any) => {
      const valueA = a[column] ?? '';
      const valueB = b[column] ?? '';

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return this.sortDirection === 'asc'
          ? (valueA > valueB ? 1 : -1)
          : (valueA < valueB ? 1 : -1);
      }
    });
  }

  sortDataD(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.dataTableD.sort((a: any, b: any) => {
      const valueA = a[column] ?? '';
      const valueB = b[column] ?? '';

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return this.sortDirection === 'asc'
          ? (valueA > valueB ? 1 : -1)
          : (valueA < valueB ? 1 : -1);
      }
    });
  }

  checkActiveTab(): void {
    switch (this.activeTab) {
      case 'home':
        this.handleHomeTab();
        break;
      case 'profile':
        this.handleProfileTab();
        break;
      case 'contact':
        this.handleContactTab();
        break;
      case 'other':
        this.handleOtherTab();
        break;
    }
  }

  handleHomeTab(): void {
    this.tipo_documentos = 1;
    this.getRegister(1);
    this.estado_documento = 1;
    this.tipo_documento = 1;
  }

  handleProfileTab(): void {
    this.getRegister(2);
    this.estado_documento = 1;
    this.tipo_documento = 2;
  }

  handleContactTab(): void {
    this.getRegisterFichaTecnica();
  }

  handleOtherTab(): void {
    this.getRegister(3);
    this.estado_documento = 1;
    this.tipo_documento = 3;
  }

  changeTab(tabName: string): void {
    this.activeTab = tabName;
    this.checkActiveTab();
  }
}