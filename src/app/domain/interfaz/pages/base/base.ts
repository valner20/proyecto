import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-base',
  imports: [ CommonModule, FormsModule],
  templateUrl: './base.html',
  styleUrl: './base.css'
})
export class Base {
  cedula:string = "";
  pass:string ="";
  error:string="";
  constructor(private http: HttpClient, private router:Router ){}

  login() {
  const data = {
    username: this.cedula,
    password: this.pass
  };

  this.http.post<any>('https://lunalimpia.onrender.com/api/token/', data).subscribe({
    next: (res) => {
      localStorage.setItem('access', res.access);
      localStorage.setItem('refresh', res.refresh)
      const decoded: any = jwtDecode(res.access);
      localStorage.setItem('staff', decoded.is_staff);
      if (decoded.is_staff===true){
        this.router.navigate(["/admin"]);
      }
      else{
      this.router.navigate(["/home"]);}
    },
    error: () => {
      this.error = 'Cédula o contraseña incorrecta.';
    }
  });
}
}
