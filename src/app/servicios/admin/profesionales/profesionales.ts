// profesional.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

export interface Profesional {
  id: number;
  username: string;
  cedula: string;
  is_staff: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProfesionalService {
  private http = inject(HttpClient);

  private baseUrl = 'https://lunalimpia.fly.dev/profesional/';
  private cache: Profesional[] | null = null;

  getProfesionales(forceRefresh = false): Observable<Profesional[]> {
    if (this.cache && !forceRefresh) {
      return of(this.cache);
    }
    return this.http.get<Profesional[]>(this.baseUrl).pipe(
      tap(data => this.cache = data)
    );
  }

  refreshProfesionales(): void {
    this.cache = null;
  }

  getProfesionalById(id: number): Observable<Profesional> {
    return this.http.get<Profesional>(`${this.baseUrl}${id}/`);
  }

  createProfesional(profesional: Profesional): Observable<Profesional> {
    return this.http.post<Profesional>("https://lunalimpia.fly.dev/registrar/", profesional);
  }

  deleteProfesional(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}
