import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Cliente } from '../clientes/clientes';
import { Profesional } from '../profesionales/profesionales';
export interface turno {
  id: number;
  fecha: string;
  hora: string;
  cliente: Cliente;
  profesional: Profesional;
  valor: number;
}

export interface CrearCita {
  fecha: string;
  hora: string;
  cliente: number;
  profesional: number;
  valor: number;
}
@Injectable({
  providedIn: 'root'
})
export class Turnos {

  private baseUrl = 'http://127.0.0.1:8000/cita/';
  private cache: turno[] | null = null;

  constructor(private http: HttpClient) {}

  getCitas(forceRefresh = false): Observable<turno[]> {
    if (this.cache && !forceRefresh) {
      return of(this.cache);
    }
    return this.http.get<turno[]>(this.baseUrl).pipe(
      tap(data => this.cache = data)
    );
  }

  refreshCitas(): void {
    this.cache = null;
  }

  getCitaById(id: number): Observable<turno> {
    return this.http.get<turno>(`${this.baseUrl}${id}/`);
  }

  createCita(cita: CrearCita): Observable<turno> {
    return this.http.post<turno>(this.baseUrl, cita);
  }

  updateCita(id: number, cita: CrearCita): Observable<turno> {
    return this.http.put<turno>(`${this.baseUrl}${id}/`, cita);
  }

  deleteCita(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}
