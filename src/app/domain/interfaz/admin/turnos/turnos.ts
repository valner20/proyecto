import { Component, OnInit, signal } from '@angular/core';
import { Turnos, turno, CrearCita } from '../../../../servicios/admin/turnos/turnos';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profesional, ProfesionalService } from '../../../../servicios/admin/profesionales/profesionales';
import { Cliente, ClienteService } from '../../../../servicios/admin/clientes/clientes';
import { ChangeDetectorRef } from '@angular/core';
import { computed } from '@angular/core';


@Component({
  selector: 'app-turnos',
  imports: [CommonModule, FormsModule],
  standalone:true,
  templateUrl: './turnos.html',
  styleUrl: './turnos.css'
})
export class TurnosComponent implements OnInit {
  citas = signal<turno[]>([]);
  filtros = signal({
  fecha: '',
  cliente: 0,
  profesional: 0,
  mes: '',
});
  total =computed(() => this.citas().length);
  citasFiltradas = computed(() => {
  return this.citas().filter(cita => {
    const f = this.filtros();
    const mesCita = cita.fecha.slice(5, 7);

    return (
      (f.fecha ? cita.fecha.slice(0, 10) === f.fecha : true) &&
      (f.cliente ? cita.cliente.id === f.cliente : true) &&
      (f.profesional ? cita.profesional.id === f.profesional : true) &&
      (f.mes ? mesCita === f.mes : true)
    );
  });
});


  nuevaCita: CrearCita = {
    fecha: '',
    hora: '',
    cliente: 0,
    profesional: 0,
    valor:0
  };

  clientes: Cliente[] = [];
  profesionales: Profesional[] = [];

  constructor(
    private turnosService: Turnos,
    private clientesService: ClienteService,
    private profesionalesService: ProfesionalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.inicializarDatos();
  }

  inicializarDatos(aux=false): void {
    this.turnosService.getCitas(aux).subscribe(data => {
      this.citas.set(data);
      this.cdr.detectChanges();
    });

    this.clientesService.getClientes(aux).subscribe(data => {
      this.clientes = data;
      this.cdr.detectChanges();

    });

    this.profesionalesService.getProfesionales(aux).subscribe(data => {
      this.profesionales = data;
      this.cdr.detectChanges();
    });
  }

  cargar(): void {
    this.inicializarDatos(true);
  }

  guardarCita(): void {
  this.turnosService.createCita(this.nuevaCita).subscribe((nuevaCitaCompleta) => {
  this.citas.update(citas => [...citas, nuevaCitaCompleta]);

  const cacheActual = this.turnosService['cache'];
  if (cacheActual) {
    this.turnosService['cache'] = [...cacheActual, nuevaCitaCompleta];
  }

  this.nuevaCita = {
    fecha: '',
    hora: '',
    cliente: 0,
    profesional: 0,
    valor:0
  };
  this.valorFormateado=""
});
}



  eliminarCita(id: number): void {
  this.turnosService.deleteCita(id).subscribe(() => {
    this.citas.update(citas => citas.filter(c => c.id !== id));
    const cacheActual = this.turnosService['cache'];
    if (cacheActual) {
      this.turnosService['cache'] = cacheActual.filter(c => c.id !== id);
    }
  });
}
  editandoId: number | null = null;
  backupCita: turno | null = null;

  iniciarEdicion(cita: turno): void {
    this.editandoId = cita.id;
    this.backupCita = JSON.parse(JSON.stringify(cita));
  }


  guardarEdicion(cita: turno): void {
    this.nuevaCita = {
      fecha: cita.fecha,
      hora: cita.hora,
      cliente: cita.cliente.id,
      profesional: cita.profesional.id,
      valor: cita.valor
    };
    this.turnosService.updateCita(cita.id, this.nuevaCita).subscribe((actualizada) => {
    const clienteCompleto = this.clientes.find(c => c.id === this.nuevaCita.cliente);
    const profesionalCompleto = this.profesionales.find(p => p.id === this.nuevaCita.profesional);

    const nuevaCitaCompleta = {
      ...actualizada,
      cliente: clienteCompleto!,
      profesional: profesionalCompleto!
    };

    this.citas.update(citas =>
      citas.map(c => c.id === cita.id ? nuevaCitaCompleta : c)
    );

    const cacheActual = this.turnosService['cache'];
    if (cacheActual) {
      this.turnosService['cache'] = cacheActual.map(c =>
        c.id === cita.id ? nuevaCitaCompleta : c
      );
    }

    this.editandoId = null;
    this.backupCita = null;
  });
}

cancelarEdicion(): void {
  if (this.backupCita) {
    const citasActuales = this.citas();
    const index = citasActuales.findIndex(c => c.id === this.backupCita!.id);

    if (index !== -1) {
      const nuevasCitas = [...citasActuales];
      nuevasCitas[index] = this.backupCita;
      this.citas.set(nuevasCitas);
    }
  }

  this.editandoId = null;
  this.backupCita = null;
}
resetFiltros(): void {
  this.filtros.set({
    fecha: '',
    cliente: 0,
    profesional: 0,
    mes: ''
  });
}

actualizarFiltroFecha(valor: string): void {
  const f = this.filtros();
  this.filtros.set({
    ...f,
    fecha: valor
  });
}

actualizarFiltroCliente(valor: number): void {
  const f = this.filtros();
  this.filtros.set({
    ...f,
    cliente: valor
  });
}

actualizarFiltroProfesional(valor: number): void {
  const f = this.filtros();
  this.filtros.set({
    ...f,
    profesional: valor
  });
}

actualizarFiltroMes(valor: string): void {
  const f = this.filtros();
  this.filtros.set({
    ...f,
    mes: valor
  });
}
totalVentas = computed(() =>
  this.citasFiltradas().reduce((sum, cita) => sum + (cita.valor || 0), 0)
);
valor = 0;

get valorGet(): string {
  return this.valor.toLocaleString('es-CO');
}
valorFormateado = '';
valorFormateadoEdicion: Record<number, string> = {};


actualizarValor(valor: string): void {
  const limpio = valor.replace(/[^\d]/g, '');
  this.nuevaCita.valor = parseInt(limpio || '0', 10);
  this.valorFormateado = new Intl.NumberFormat('es-CO').format(this.nuevaCita.valor);
}

actualizarValorEdicion(id: number, valor: string): void {
  const limpio = valor.replace(/[^\d]/g, '');
  const citasActuales = this.citas();
  const cita = citasActuales.find(c => c.id === id);
  if (cita) {
    cita.valor = parseInt(limpio || '0', 10);
    this.valorFormateadoEdicion[id] = new Intl.NumberFormat('es-CO').format(cita.valor);
  }
}


}
