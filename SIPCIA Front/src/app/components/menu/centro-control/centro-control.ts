import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Navbar } from '../../navbar/navbar';
import * as data from '../../../..//app/components/labels/label.json';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Control } from '../../../services/modulo-two-services/controlServices/control';
@Component({
  selector: 'app-centro-control',
  imports: [
    Navbar,
    MatCardModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  
  standalone: true,
  templateUrl: './centro-control.html',
  styleUrl: './centro-control.css'
})
export class CentroControl {

  formularioRegistro: FormGroup | undefined;

  data: any = data;

  nombreUser: string = '';
  cargoUser: string = '';
  currentTime: string= '';
  today: string = '';
  position: string = '';
  tokenSesion: string = '';
  prueba = '';

  demarcacion: number = 0;
  distrito: number = 0;
  tipo_usuario: number = 0;
  area: string = '';
  id_usuario: number = 0; 

  distritos: any = [];
  modulos: any = [];

  isClosed: boolean = true;
  bDocumento: boolean = false;

  bDocumento1: boolean = false;
  bDocumento2: boolean = false;
  bDocumento3: boolean = false;
  bDocumento4: boolean = false;
  bDocumento5: boolean = false;
  bDocumento6: boolean = false;
  bDocumento7: boolean = false;
 
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private serviceControl: Control
  ) {}  

  ngOnInit(): void {
    this.cargoUser = sessionStorage.getItem('cargo_usuario')!;
    this.nombreUser = sessionStorage.getItem('nameUsuario')!;
    this.tokenSesion = sessionStorage.getItem('key')!;
    this.position = sessionStorage.getItem('dir')!;
    this.tipo_usuario =  Number(sessionStorage.getItem('tipoUsuario')!);
    this.area = sessionStorage.getItem('area')!;
    this.id_usuario = Number(sessionStorage.getItem('id_usuario')!);

    this.cargaDistritos();
    this.cargaModulo();
  }

  cargaDistritos() {
    this.serviceControl.getAllDistritos(this.tokenSesion)
      .subscribe({
        next: (data) => {

          this.distritos = data.getAllDistritos;

          this.bDocumento1 = data.documentosValidos.documento_1;
          this.bDocumento2 = data.documentosValidos.documento_2;
          this.bDocumento3 = data.documentosValidos.documento_3;
          this.bDocumento4 = data.documentosValidos.documento_4;
          this.bDocumento5 = data.documentosValidos.documento_5;
          this.bDocumento6 = data.documentosValidos.documento_6;
          this.bDocumento7 = data.documentosValidos.documento_7;

        }, error: (error) => {
          Swal.fire("No se encontraron registros!")
        }
      });
  }

  cargaModulo() {
    this.serviceControl.getModulos(this.tokenSesion)
      .subscribe({
        next: (data) => {
          this.modulos = data.getAllDistritos;
        }, error: (error) => {
          Swal.fire("No se encontraron Registros");
        } 
      })
  }

  clickDistrito(idDistrito: number, estado_sistema: number){
    this.serviceControl.updateRegistroDistrito(idDistrito, estado_sistema ,this.tokenSesion)
      .subscribe({
        next: (data) => {
          this.cargaDistritos();
        }, error: (error) => {
          Swal.fire("Error al actualizar registros!")
        }
      });
  }

  clickModulo(idDistrito: number, estado_sistema: number){
    this.serviceControl.updateEstadoModulo(idDistrito, estado_sistema ,this.tokenSesion)
      .subscribe({
        next: (data) => {
          this.cargaModulo();
        }, error: (error) => {
          Swal.fire("Error al actualizar registros!")
        }
      });
  }

  clickGeneral(estado_sistema: number){
    this.serviceControl.updateDistritos(estado_sistema, this.tokenSesion)
      .subscribe({
        next: (data) => {
          this.cargaDistritos();
        }, error: (error) => {
          Swal.fire("No se encontraron registros!")
        }
      });
  }

  clickUpdate(idDistrito: number, nombre: string, estado_sistema: number){
    this.serviceControl.updateClick(idDistrito, nombre, estado_sistema, this.tokenSesion)
      .subscribe({
        next: (data) => {
          this.cargaDistritos();
        }, error: (error) => {
          Swal.fire("No se encontraron registros!")
        }
      });
  }

  clickUpdateModulo(idDistrito: number, estado_sistema: number){
    this.serviceControl.updateClickModulo(idDistrito, estado_sistema, this.tokenSesion)
      .subscribe({
        next: (data) => {
          this.cargaDistritos();
        }, error: (error) => {
          Swal.fire("No se encontraron registros!")
        }
      });
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

  logout() {
    this.router.navigate(['']);
  };

  eventoDocumento1(id: number) {
    const item = this.distritos.find((d: any) => d.distrito === id);
    this.clickUpdate(id, "documento_1", item?.documento_1 === true ? 1 : 0 )
  }

  eventoDocumento2(id: number) {
    const item = this.distritos.find((d: any) => d.distrito === id);
    this.clickUpdate(id, "documento_2", item?.documento_2 === true ? 1 : 0 )
  }

  eventoDocumento3(id: number) {
    const item = this.distritos.find((d: any) => d.distrito === id);
    this.clickUpdate(id, "documento_3", item?.documento_3 === true ? 1 : 0 )
  }

  eventoDocumento4(id: number) {
    const item = this.distritos.find((d: any) => d.distrito === id);
    this.clickUpdate(id, "documento_4", item?.documento_4 === true ? 1 : 0 )
  }

  eventoDocumento5(id: number) {
    const item = this.distritos.find((d: any) => d.distrito === id);
    this.clickUpdate(id, "documento_5", item?.documento_5 === true ? 1 : 0 )
  }

  eventoDocumento6(id: number) {
    const item = this.distritos.find((d: any) => d.distrito === id);
    this.clickUpdate(id, "documento_6", item?.documento_6 === true ? 1 : 0 )
  }

  eventoDocumento7(id: number) {
    const item = this.distritos.find((d: any) => d.distrito === id);
    this.clickUpdate(id, "documento_7", item?.documento_7 === true ? 1 : 0 )
  }

  eventoDocumento9(id: number) {
    const item = this.modulos.find((d: any) => d.id === id);
    this.clickUpdateModulo(id, item?.documento_1 === true ? 1 : 0 )
  }

  eventMaster1(distrito: string) {
    this.serviceControl.updateCheckAllDistritos(distrito, this.bDocumento1 === true ? 1 : 0, this.tokenSesion)
      .subscribe({
        next: (data) => {
          this.cargaDistritos();
        }, error: (error) => {
          Swal.fire("Error al actualizar!")
        }
      });
  }

  eventMaster2(distrito: string) {
    this.serviceControl.updateCheckAllDistritos(distrito, this.bDocumento2 === true ? 1 : 0, this.tokenSesion)
      .subscribe({
        next: (data) => {
          this.cargaDistritos();
        }, error: (error) => {
          Swal.fire("Error al actualizar!")
        }
      });
  }

  eventMaster3(distrito: string) {
    this.serviceControl.updateCheckAllDistritos(distrito, this.bDocumento3 === true ? 1 : 0, this.tokenSesion)
      .subscribe({
        next: (data) => {
          this.cargaDistritos();
        }, error: (error) => {
          Swal.fire("Error al actualizar!")
        }
      });
  }

  eventMaster4(distrito: string) {
    this.serviceControl.updateCheckAllDistritos(distrito, this.bDocumento4 === true ? 1 : 0, this.tokenSesion)
      .subscribe({
        next: (data) => {
          this.cargaDistritos();
        }, error: (error) => {
          Swal.fire("Error al actualizar!")
        }
      });
  }

  eventMaster5(distrito: string) {
    this.serviceControl.updateCheckAllDistritos(distrito, this.bDocumento5 === true ? 1 : 0, this.tokenSesion)
      .subscribe({
        next: (data) => {
          this.cargaDistritos();
        }, error: (error) => {
          Swal.fire("Error al actualizar!")
        }
      });
  }

  eventMaster6(distrito: string) {
    this.serviceControl.updateCheckAllDistritos(distrito, this.bDocumento6 === true ? 1 : 0, this.tokenSesion)
      .subscribe({
        next: (data) => {
          this.cargaDistritos();
        }, error: (error) => {
          Swal.fire("Error al actualizar!")
        }
      });
  }

  eventMaster7(distrito: string) {
    this.serviceControl.updateCheckAllDistritos(distrito, this.bDocumento7 === true ? 1 : 0, this.tokenSesion)
      .subscribe({
        next: (data) => {
          this.cargaDistritos();
        }, error: (error) => {
          Swal.fire("Error al actualizar!")
        }
      });
  }

  cleanData(){
    this.serviceControl.cleanChecksData(this.tokenSesion)
      .subscribe({
        next: (data) => {
          this.cargaDistritos();
        }, error: (error) => {
          Swal.fire("Error al actualizar!")
        }
      });
  }

  limpiarSeleccion() {
    this.distritos.forEach((item: any) => {
      item.documento_1 = false;
      item.documento_2 = false;
      item.documento_3 = false;
      item.documento_4 = false;
      item.documento_5 = false;
      item.documento_6 = false;
      item.documento_7 = false;
    });

    this.cleanData();
  }
}
