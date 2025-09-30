import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../../../navbar/navbar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as data from '../../../../labels/label.json';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Reportes } from '../../../../../services/reporteService/reportes';
import { Auth } from '../../../../../services/authService/auth';
import Swal from 'sweetalert2';
import { FormularioDocumentos } from "../../formularios-modulos/formulario-documentos/formulario-documentos";
import { DocumentosServices } from '../../../../../services/documentosService/documentos-services';

@Component({
  selector: 'app-documentos-afroamericanas',
  imports: [
    Navbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormularioDocumentos
  ],
  templateUrl: './documentos-afroamericanas.html',
  styleUrl: './documentos-afroamericanas.css'
})

export class DocumentosAfroamericanas implements OnInit{

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
  allDatable: any[] = [];
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  fileUploaded: boolean = false;

  dataTableD: any = [];
  allDatableD: any[] = [];

  showModal = false;

  ngOnInit(): void {
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
    this.position = sessionStorage.getItem('dir')!;
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.area_adscripcion = Number(sessionStorage.getItem('area'));

    this.getRegister();
    this.getdata();
  }
  
  constructor(
    private router: Router,
    private reporteService: DocumentosServices,
    private service: Auth,
    private miServicio: Reportes,
    private docService: Reportes,
    private serviceRegister: Reportes
  ) {}
  
  logout() {
    this.router.navigate(['']);
  };

  getdata(){
    this.serviceRegister.getOtrosDocumentos(this.area_adscripcion, 2, this.tokenSesion).subscribe({
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

  openModal(id: number | undefined, idRegistro: number | undefined) {
    this.showModal = true;
    this.idformIdSelected = id;
    this.idform = idRegistro;
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
    formData.append('tipo_comunidad', "2");

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

  descargarOtros(nameArchivo: any){
    this.miServicio.descargarOtrosNorma(nameArchivo, this.tokenSesion).subscribe({

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

  descargar(){
    this.miServicio.descargarDocNorma("1757703550661-purebaComunidadAfro.pdf", this.tokenSesion).subscribe({
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
  
  closeModal() {
    this.showModal = false;
    this.getRegister();
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
  
  getRegister() {
  this.reporteService.getRegisterfichaTecnicaTablaAfro(this.area_adscripcion, this.tokenSesion).subscribe({
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
}