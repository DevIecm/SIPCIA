import { 
    ActivatedRouteSnapshot, 
    CanActivate, 
    GuardResult, 
    MaybeAsync, 
    Router, 
    RouterStateSnapshot, 
    UrlTree 
} from "@angular/router";

import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {

    constructor(private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
         state: RouterStateSnapshot
    ): boolean | UrlTree {
        const token = sessionStorage.getItem('key');

        if(token) {
            return true;
        } else {
            return true;
            // return this.router.createUrlTree(['']);
        }
    }
}