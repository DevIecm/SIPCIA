import { Component, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-documentos-indigenas',
  imports: [
    Navbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormularioDocumentos
  ],
  templateUrl: './documentos-indigenas.html',
  styleUrl: './documentos-indigenas.css'
})
export class DocumentosIndigenas implements OnInit{

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
  idformIdSelected: number | undefined;
  idform: number | undefined;

  dataTable: any = [];
  dataTableDN: any = [];
  dataTableDA: any = [];
  allDatable: any[] = [];

  dataTableD: any = [];
  allDatableD: any[] = [];

  showModal = false;
  
  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  isRegister: boolean = false;
  fileUploaded: boolean = false;

  ngOnInit(): void {
    
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
    this.position = sessionStorage.getItem('dir')!;
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.area_adscripcion = Number(sessionStorage.getItem('area'));

    this.getDocumentosMod2(1);
    this.getRegister();
    this.getdata();
  }

  constructor(
    private router: Router,
    private reporteService: DocumentosServices,
    private service: Auth,
    private docService: Reportes,
    private serviceRegister: Reportes
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
      this.uploadZip();
    }
  }

  uploadZip() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('archivoZip', this.selectedFile);
    formData.append('distrito', this.area_adscripcion.toString());
    formData.append('tipo_comunidad', "1");
    formData.append('estado_documento', "1");
    formData.append('tipo_documento', "3");

    this.docService.subirDocumentoNormativo(formData, this.tokenSesion).subscribe({
      next: (res) => {
        alert('Documento subido correctamente');
        this.getdata();
      },
      error: (err) => {
        console.error('Error al subir documento', err);
        alert('Error al subir documento');
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
    this.router.navigate(['/menu']);
  };

  openModal(id: number | undefined, idRegistro: number | undefined, isRegister: boolean) {
    this.showModal = true;
    this.idformIdSelected = id;
    this.idform = idRegistro;
    this.isRegister = isRegister;
  }

  closeModal() {
    this.showModal = false;
    this.getRegister();
  }

  changeTab(tabName: string): void {
    this.activeTab = tabName;
    this.checkActiveTab();
  }

  checkActiveTab(): void {
    switch (this.activeTab) {
      case 'home':
        this.handleHomeTab();
        break;
      case 'profile':
        this.handleProfileTab();
        break;
    }
  }

  handleHomeTab(): void {
    this.getDocumentosMod2(1);
  }

  handleProfileTab(): void {
    this.getDocumentosMod2(2);
  }

  descargar(){
    this.docService.descargarDocNorma("1758128882717-purebaComunidadIndigena.pdf", this.tokenSesion).subscribe({
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

  descargarOtros(nameArchivo: any){
    this.docService.descargarOtrosNorma(nameArchivo, this.tokenSesion).subscribe({

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

  getDocumentosMod2(id: number) {
    this.reporteService.getRegisterfichaTecnicaTablaTwo(1, id, this.tokenSesion).subscribe({
      next: (data) => {
        if(data.getDocumentos.length > 0) {
          switch(id) {
            case 1:    
              this.dataTableDN = data.getDocumentos;
              break;
            case 2:
              this.dataTableDA = data.getDocumentos;
              break;
          }
        } else {
          switch(id) {
            case 1:
              this.dataTableDN = [];
              break;
            case 2:
              this.dataTableDA = [];
              break;
          }
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
  }

  getRegister() {
    this.reporteService.getRegisterfichaTecnicaTabla(this.area_adscripcion, this.tokenSesion).subscribe({
      next: (data) => {
        if(data.getFichasInd.length > 0) {
          this.dataTable = data.getFichasInd;
          this.allDatable = data.getFichasInd;
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
}