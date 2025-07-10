// cliente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

export interface Cliente {
  id: number;
  nombre: string;
  direccion: string;
  video: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseUrl = 'https://lunalimpia.fly.dev/cliente/';
  private cache: Cliente[] | null = null;

  constructor(private http: HttpClient) {}

  getClientes(forceRefresh = false): Observable<Cliente[]> {
    if (this.cache && !forceRefresh) {
      return of(this.cache);
    }
    return this.http.get<Cliente[]>(this.baseUrl).pipe(
      tap(data => this.cache = data)
    );
  }

  refreshClientes(): void {
    this.cache = null;
  }

  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}${id}/`);
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.baseUrl, cliente);
  }

  updateCliente(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.baseUrl}${id}/`, cliente);
  }

  deleteCliente(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}
