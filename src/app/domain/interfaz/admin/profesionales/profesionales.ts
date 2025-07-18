import { Component, inject } from '@angular/core';
import { Profesional,ProfesionalService } from '../../../../servicios/admin/profesionales/profesionales';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, OnInit } from '@angular/core';


@Component({
  selector: 'app-profesionales',
  imports: [FormsModule, CommonModule],
  templateUrl: './profesionales.html',
  standalone:true,
  styleUrl: './profesionales.css'
})
export class Profesionales implements OnInit {
  private profesionalService = inject(ProfesionalService);
  private cdr = inject(ChangeDetectorRef);

  profesionales: Profesional[] = [];
  nuevoProfesional: Partial<Profesional> = {};
  ngOnInit(): void {
    this.obtenerProfesionales()
}



  obtenerProfesionales(aux=false): void {
    this.profesionalService.getProfesionales(aux).subscribe(data => {
        this.profesionales = data.filter(p => p.is_staff == false);
    this.cdr.detectChanges();
});
  }

guardarProfesional(): void {
  if (this.nuevoProfesional.username) {
    this.profesionalService
      .createProfesional(this.nuevoProfesional as Profesional)
      .subscribe((nuevo) => {
        this.profesionales.push(nuevo);

        const cacheActual = this.profesionalService['cache'];
        if (cacheActual) {
          this.profesionalService['cache'] = [...cacheActual, nuevo];
        }

        this.nuevoProfesional = {};
        this.cdr.detectChanges();
      });
  }
}

eliminarProfesional(id: number): void {
  this.profesionalService.deleteProfesional(id).subscribe(() => {
    this.profesionales = this.profesionales.filter(p => p.id !== id);

    const cacheActual = this.profesionalService['cache'];
    if (cacheActual) {
      this.profesionalService['cache'] = cacheActual.filter(p => p.id !== id);
    }

    this.cdr.detectChanges();
  });
}
  totals=0;
  get total(){
    this.totals = this.profesionales.length
    return this.totals;
  }
}
