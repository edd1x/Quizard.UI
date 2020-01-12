import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NgForm } from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { LoginService } from '../../services/loginService/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  invalidLogin: boolean = false;
  
  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit() {
  }

  login(form: NgForm) {
    let credentials = JSON.stringify(form.value);
    this.loginService.checkAuth(credentials).subscribe(response => {
      let token = (<any>response).token;
      let email = (<any>response).email;
      localStorage.setItem("jwt", token);
      localStorage.setItem("email", email);
      this.invalidLogin = false;
      this.router.navigate(["/"]);
    }, err => {
      this.invalidLogin = true;
    });
  }

}
