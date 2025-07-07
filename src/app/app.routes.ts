import { Info } from './domain/interfaz/component/info/info';
import { Base } from './domain/interfaz/pages/base/base';
import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: "home",
    component: Info
  },
  {
    path: "login",
    component: Base

  }

];
