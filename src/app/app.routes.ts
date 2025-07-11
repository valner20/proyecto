
import { Routes } from '@angular/router';
import { Admin } from './domain/interfaz/admin/admin';
import { Auth } from './servicios/guards/auth';




export const routes: Routes = [


  {
    path: 'home',
    loadComponent: () =>
      import('./domain/interfaz/component/info/info').then(m => m.Info),
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./domain/interfaz/pages/base/base').then(m => m.Base),
  },

    {
    path: 'admin',
    component: Admin,
    canActivate: [Auth],
    children: [

      {
        path: 'turnos',
        loadComponent: () =>
          import('./domain/interfaz/admin/turnos/turnos').then(m => m.TurnosComponent)
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./domain/interfaz/admin/clientes/clientes').then(m => m.Clientes)
      },
      {
        path: 'profesionales',
        loadComponent: () =>
          import('./domain/interfaz/admin/profesionales/profesionales').then(m => m.Profesionales)
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];
