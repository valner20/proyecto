import { Component, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule, CalendarEvent, CalendarView,CalendarMonthViewDay } from 'angular-calendar';
import { format, addMonths, subMonths,startOfDay } from 'date-fns';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { es } from 'date-fns/locale';
import { Turnos } from '../../../../servicios/turnos/turnos';
import { turno } from '../../../../servicios/admin/turnos/turnos';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-info',
  standalone:true,
  imports: [CommonModule, CalendarModule,HttpClientModule],
  templateUrl: './info.html',
  styleUrl: './info.css',
  encapsulation: ViewEncapsulation.None

})
export class Info {
  private sanitizer = inject(DomSanitizer);
  private eventoService = inject(Turnos);
  private cdr = inject(ChangeDetectorRef);


  constructor() {
    this.cargarTurnos();
  }
  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  diasSemana = ["D","L","M","M","J","V","S"]
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  modalVisible = false;
  selectedDayEvents: CalendarEvent[] = [];
  selectedDate: Date | null = null;

  events: CalendarEvent[] = [];

  cargarTurnos() {
    this.eventoService.getEventos().subscribe((datos: turno[]) => {
      this.events = datos.map((e: turno) => ({
          start: startOfDay(this.convertirFechaLocal(e.fecha)),
        title: e.cliente.nombre,
        color: { primary: '#ad2121', secondary: '#FAE3E3' },
        meta: {
          direccion: e.cliente.direccion,
          Hora: e.hora,
          videoUrl: e.cliente.video
        }
      }));
          this.cdr.detectChanges();
  }
);
}
handleDayClick(day: CalendarMonthViewDay): void {
    this.selectedDate = day.date;
    this.selectedDayEvents = day.events;
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
    this.selectedDayEvents = [];
    this.selectedDate = null;
  }
  previousMonth() {
    this.viewDate = subMonths(this.viewDate, 1);
  }

  nextMonth() {
    this.viewDate = addMonths(this.viewDate, 1);
  }


  get currentMonth(): string {
    return format(this.viewDate, 'MMMM yyyy', { locale: es });
  }


convertirFechaLocal(fecha: string): Date {
  const [year, month, day] = fecha.split('-').map(Number);
  return new Date(year, month - 1, day);
}

}
