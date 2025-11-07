import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AuthGuard } from './guardservice/auth.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./components/home/home').then(m => m.Home) },
    { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login) },
    { path: 'menu', loadComponent: () => import('./components/menu/menu-home/menu-home').then(m => m.MenuHome), canActivate: [AuthGuard] },
    { path: 'menutwo', loadComponent: () => import('./components/menu/menu-home/menu-modulo-two/menu-modulo-two').then(m => m.MenuModuloTwo), canActivate: [AuthGuard] },

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

    { path: 'nregistrotwo', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/nregistro/nregistro').then(m => m.Nregistro), canActivate: [AuthGuard] },
    { path: 'dirndigenastwo', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/directorio-indigenas-two/directorio-indigenas-two').then(m => m.DirectorioIndigenasTwo), canActivate: [AuthGuard] },
    { path: 'dafroamericanastwo', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/directorio-afromexicanas-two/directorio-afromexicanas-two').then(m => m.DirectorioAfromexicanasTwo), canActivate: [AuthGuard] },
    { path: 'ctecnicas', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/consulta-tecnicas/consulta-tecnicas').then(m => m.ConsultaTecnicas), canActivate: [AuthGuard] },
    { path: 'cafro', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/consulta-afromexicana/consulta-afromexicana').then(m => m.ConsultaAfromexicana), canActivate: [AuthGuard] },
    { path: 'rrepresentativastwo', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/reporte-representativa-two/reporte-representativa-two').then(m => m.ReporteRepresentativaTwo), canActivate: [AuthGuard] },
    { path: 'rcomunitariatwo', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/registro-comunitaria/registro-comunitaria').then(m => m.RegistroComunitaria), canActivate: [AuthGuard] },
    { path: 'pcomunitariastwo', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/propuesta-comunitaria/propuesta-comunitaria').then(m => m.PropuestaComunitaria), canActivate: [AuthGuard] },
    { path: 'rconsultastwo', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/reporte-consultas/reporte-consultas').then(m => m.ReporteConsultas), canActivate: [AuthGuard] },
    { path: 'cacmpatwo', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/catalogo-acompa/catalogo-acompa').then(m => m.CatalogoAcompa), canActivate: [AuthGuard] },
    { path: 'dindigenastwo', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/documentos-indigenas-two/documentos-indigenas-two').then(m => m.DocumentosIndigenasTwo), canActivate: [AuthGuard] },
    { path: 'dafrotwo', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-two/documentos-afro-two/documentos-afro-two').then(m => m.DocumentosAfroTwo), canActivate: [AuthGuard] },
    { path: 'bitacora/:id/:tipo', loadComponent: () => import('./components/menu/menu-componentes/bitacora/bitacora').then(m => m.Bitacora), canActivate: [AuthGuard] },
    { path: 'ccontrol', loadComponent: () => import('./components/menu/centro-control/centro-control').then(m => m.CentroControl), canActivate: [AuthGuard] },

    //Modulo3

    { path: 'menuthree', loadComponent: () => import('./components/menu/menu-home/menu-modulo-three/menu-modulo-three').then(m => m.MenuModuloThree), canActivate: [AuthGuard] },
    { path: 'moduloRegister', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-three/modulo-register/modulo-register').then(m => m.ModuloRegister), canActivate: [AuthGuard] },

    //Modulo4

    { path: 'menufour', loadComponent: () => import('./components/menu/menu-home/menu-modulo-four/menu-modulo-four').then(m => m.MenuModuloFour) },
    { path: 'moduloRegisterFour', loadComponent: () => import('./components/menu/menu-componentes/menu-modulo-three/modulo-register-four/modulo-register-four').then(m => m.ModuloRegisterFour) }
];
@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})

export class AppRoutingModule {}