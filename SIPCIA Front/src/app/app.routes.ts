import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AuthGuard } from './guardservice/auth.guard';

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
    { path: 'bitacora/:id/:tipo', loadComponent: () => import('./components/menu/menu-componentes/bitacora/bitacora').then(m => m.Bitacora), canActivate: [AuthGuard] }

    //Modulo2

    //Modulo3
];
@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})

export class AppRoutingModule {}