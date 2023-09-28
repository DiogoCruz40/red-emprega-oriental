import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenStorageService } from './token-storage.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private tokenStorageService: TokenStorageService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.tokenStorageService.isLoggedIn()) {
            return true;
        } else {
            this.router.navigate(['/admin/iniciar-sessao'], {
                queryParams: {
                    return: state.url
                }
            });
            return false;
        }
    }
}