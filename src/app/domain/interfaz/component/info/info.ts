import { Component,ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, CalendarEvent, CalendarView,CalendarMonthViewDay } from 'angular-calendar';
import { format, addMonths, subMonths,startOfDay } from 'date-fns';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { es } from 'date-fns/locale';
@Component({
  selector: 'app-info',
  standalone:true,
  imports: [CommonModule, CalendarModule],
  templateUrl: './info.html',
  styleUrl: './info.css',
  encapsulation: ViewEncapsulation.None

})
export class Info {
  constructor(private sanitizer: DomSanitizer) {}

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  modalVisible: boolean = false;
  selectedDayEvents: CalendarEvent[] = [];
  selectedDate: Date | null = null;

  events: CalendarEvent[] = [
  {
    start: startOfDay(new Date(2025, 6, 9)),
    title: 'Turno',
    color: { primary: '#ad2121', secondary: '#FAE3E3' },
    meta: {
      direccion: 'Calle 123, medellin',
      Hora: "9 am-1 pm",
      videoUrl: 'https://drive.google.com/file/d/1NmVdgysijeiC3tEh18yH4tqOR_fKO72B/view?usp=sharing'
    }
  },
  {
    start: startOfDay(new Date(2025, 6, 11)),
    title: 'Reunión importante',
    color: { primary: '#ad2121', secondary: '#FAE3E3' },
    meta: {
      direccion: 'Calle 123, medellin',
      Hora: "9 am-1 pm",
      videoUrl: 'https://drive.google.com/file/d/1NmVdgysijeiC3tEh18yH4tqOR_fKO72B/view?usp=sharing'
    }
  },
  {
    start: startOfDay(new Date(2025, 6, 9)),
    title: 'Turno',
    color: { primary: '#ad2121', secondary: '#FAE3E3' },
    meta: {
      direccion: 'Calle 123, medellin',
      Hora: "1 pm - 5 pm",
      videoUrl: 'https://drive.google.com/file/d/1NmVdgysijeiC3tEh18yH4tqOR_fKO72B/view?usp=sharing'
    }
  },

];

  handleDayClick(day: CalendarMonthViewDay): void {
    console.log('Eventos del día:', day.events);
    if(day.date > new Date() ){
    this.selectedDate = day.date;
    this.selectedDayEvents = day.events;}
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

diasSemana = ["D","L","M","M","J","V","S"]

}
