import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { turno } from '../admin/turnos/turnos';

@Injectable({
  providedIn: 'root'
})
export class Turnos {
private http = inject(HttpClient);

private apiUrl = 'https://lunalimpia.fly.dev/cita/';

  getEventos(): Observable<turno[]> {
    const token = localStorage.getItem('access');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<turno[]>(this.apiUrl, { headers });
  }
}
