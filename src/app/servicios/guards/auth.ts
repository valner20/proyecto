import { Injectable, inject } from '@angular/core';
import { CanActivate, Router,UrlTree } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class Auth implements CanActivate{
  private router = inject(Router);


  canActivate(): boolean | UrlTree {
    const token = localStorage.getItem('access');
    const staff = localStorage.getItem('staff');
    if (token && staff === "true") {
      return true;
    }
    return this.router.createUrlTree(['/login']);
  }
}
