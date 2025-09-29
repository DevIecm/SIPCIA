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

  area_adscripcion: number = 0;
  tipo_usuario: number = 0;
  idformIdSelected: number | undefined;
  idform: number | undefined;

  dataTable: any = [];
  allDatable: any[] = [];

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

  this.docService.subirDocumentoNormativo(formData, this.tokenSesion).subscribe({
    next: (res) => {
      alert('Documento subido correctamente');
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

  openModal(id: number | undefined, idRegistro: number | undefined) {
    this.showModal = true;
    this.idformIdSelected = id;
    this.idform = idRegistro;
  }

  closeModal() {
    this.showModal = false;
    this.getRegister();
  }

  descargar(){
    this.miServicio.descargarDocNorma("1758128882717-purebaComunidadIndigena.pdf", this.tokenSesion).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

///        a.download =item.nombre_archivo;
          a.download = 'Documentos Normativos';


        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error al descargar archivo:', err)
    });
  }

  descargarOtros(nameArchivo: any){
    this.miServicio.descargarOtrosNorma(nameArchivo, this.tokenSesion).subscribe({

      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

///        a.download =item.nombre_archivo;
          a.download = 'Documentos Normativos';


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
}