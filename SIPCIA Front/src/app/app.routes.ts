import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AuthGuard } from './guardservice/auth.guard';
import { NgHcaptchaModule } from 'ng-hcaptcha';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./components/home/home').then(m => m.Home) },
    { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login) },
    { path: 'menu', loadComponent: () => import('./components/menu/menu-home/menu-home').then(m => m.MenuHome), canActivate: [AuthGuard] },

    //Modulo 1

    { path: 'nregistro', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-one/nuevo-registro/nuevo-registro').then(m => m.NuevoRegistro), canActivate: [AuthGuard] },
    { path: 'dindigenas', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-one/directorio-indigenas/directorio-indigenas').then(m => m.DirectorioIndigenas), canActivate: [AuthGuard] },
    { path: 'dafroamericanas', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-one/directorio-afroamericanas/directorio-afroamericanas').then(m => m.DirectorioAfroamericanas), canActivate: [AuthGuard] },
    { path: 'representativas', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-one/reporte-representativas/reporte-representativas').then(m => m.ReporteRepresentativas), canActivate: [AuthGuard] },
    { path: 'rcomunitaria', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-one/reporte-comunitaria/reporte-comunitaria').then(m => m.ReporteComunitaria), canActivate: [AuthGuard] },
    { path: 'pcomunitaria', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-one/propuesta-comunitaria/propuesta-comunitaria').then(m => m.PropuestaComunitaria), canActivate: [AuthGuard] },
    { path: 'rconsultas', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-one/reporte-consultas/reporte-consultas').then(m => m.ReporteConsultas), canActivate: [AuthGuard] },
    { path: 'cacompanamiento', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-one/catalogo-acompanamiento/catalogo-acompanamiento').then(m => m.CatalogoAcompanamiento), canActivate: [AuthGuard] },
    { path: 'dnindigenas', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-one/documentos-indigenas/documentos-indigenas').then(m => m.DocumentosIndigenas), canActivate: [AuthGuard] },
    { path: 'dnafroamericanas', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-one/documentos-afroamericanas/documentos-afroamericanas').then(m => m.DocumentosAfroamericanas), canActivate: [AuthGuard] },
    { path: 'bitacora/:id/:tipo', loadComponent: () => import('./components/menu/menu-componentes/bitacora/bitacora').then(m => m.Bitacora), canActivate: [AuthGuard] },

    //Modulo2

    { path: 'nregistro-deoeyg', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/nregistro/nregistro').then(m => m.Nregistro), canActivate: [AuthGuard] },
    { path: 'dirndigenas-deoeyg', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/directorio-indigenas-two/directorio-indigenas-two').then(m => m.DirectorioIndigenasTwo), canActivate: [AuthGuard] },
    { path: 'dafroamericanas-deoeyg', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/directorio-afromexicanas-two/directorio-afromexicanas-two').then(m => m.DirectorioAfromexicanasTwo), canActivate: [AuthGuard] },
    { path: 'ctecnicas-deoeyg', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/consulta-tecnicas/consulta-tecnicas').then(m => m.ConsultaTecnicas), canActivate: [AuthGuard] },
    { path: 'cafro-deoeyg', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/consulta-afromexicana/consulta-afromexicana').then(m => m.ConsultaAfromexicana), canActivate: [AuthGuard] },
    { path: 'rrepresentativas-deoeyg', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/reporte-representativa-two/reporte-representativa-two').then(m => m.ReporteRepresentativaTwo), canActivate: [AuthGuard] },
    { path: 'rcomunitaria-deoeyg', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/registro-comunitaria/registro-comunitaria').then(m => m.RegistroComunitaria), canActivate: [AuthGuard] },
    { path: 'pcomunitarias-deoeyg', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/propuesta-comunitaria/propuesta-comunitaria').then(m => m.PropuestaComunitaria), canActivate: [AuthGuard] },
    { path: 'rconsultas-deoeyg', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/reporte-consultas/reporte-consultas').then(m => m.ReporteConsultas), canActivate: [AuthGuard] },
    { path: 'cacmpa-deoeyg', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/catalogo-acompa/catalogo-acompa').then(m => m.CatalogoAcompa), canActivate: [AuthGuard] },
    { path: 'dindigenas-deoeyg', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/documentos-indigenas-two/documentos-indigenas-two').then(m => m.DocumentosIndigenasTwo), canActivate: [AuthGuard] },
    { path: 'dafro-deoeyg', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/documentos-afro-two/documentos-afro-two').then(m => m.DocumentosAfroTwo), canActivate: [AuthGuard] },
    { path: 'bitacora/:id/:tipo', loadComponent: () => import('./components/menu/menu-componentes/bitacora/bitacora').then(m => m.Bitacora), canActivate: [AuthGuard] },
    { path: 'ccontrol-deoeyg', loadComponent: () => import('./components/menu/centro-control/centro-control').then(m => m.CentroControl), canActivate: [AuthGuard] },

    //Modulo3

    { path: 'moduloRegistro', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-three/modulo-register/modulo-register').then(m => m.ModuloRegister), canActivate: [AuthGuard] },

    //Modulo4

    { path: 'modulo', loadComponent: () => import('./components/menu/menu-home/menu-modulo-four/menu-modulo-four').then(m => m.MenuModuloFour) },
    { path: 'registro', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-three/modulo-register-four/modulo-register-four').then(m => m.ModuloRegisterFour) }
];
@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})

export class AppRoutingModule {}