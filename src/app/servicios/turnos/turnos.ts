import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { turno } from '../admin/turnos/turnos';

@Injectable({
  providedIn: 'root'
})
export class Turnos {
private apiUrl = 'https://lunalimpia.onrender.com/cita/';

  constructor(private http: HttpClient) {}

  getEventos(): Observable<turno[]> {
    const token = localStorage.getItem('access');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<turno[]>(this.apiUrl, { headers });
  }
}
