import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()

export class AuthGuard implements CanActivate {
  constructor(private helper: JwtHelperService, private router: Router) {
  }
  canActivate() { 
    var token = localStorage.getItem("jwt");

    if (token && !this.helper.isTokenExpired(token)){
      return true;
    }
    this.router.navigate(["login"]);
    return false;
  }
}