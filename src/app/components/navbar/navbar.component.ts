import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private jwtHelper: JwtHelperService, private router: Router) { }

  isUserAuthenticated() {
    let token: string = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    else {
      return false;
    }
  }

  get username(): string {
    return localStorage.getItem("email");
  }

  public logOut = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("email");
  }

  ngOnInit() {
  }

}
