import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './servicios/interceptor/interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TurnosComponent } from './domain/interfaz/admin/turnos/turnos';
import { Clientes } from './domain/interfaz/admin/clientes/clientes';
import { Profesionales } from './domain/interfaz/admin/profesionales/profesionales';


import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { Admin } from './domain/interfaz/admin/admin';
import { Auth } from './servicios/guards/auth';

export const appConfig: ApplicationConfig = {
  providers: [


  provideHttpClient(withInterceptors([authInterceptor])),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory
      })),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes)
    ]
};
