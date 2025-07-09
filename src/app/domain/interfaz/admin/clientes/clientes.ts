import { Component} from '@angular/core';
import { Cliente,ClienteService } from '../../../../servicios/admin/clientes/clientes';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-clientes',
  imports: [FormsModule, CommonModule],
  templateUrl: './clientes.html',
  standalone:true,
  styleUrl: './clientes.css'

})
export class Clientes {
  editandoId: number | null = null;
  backupCliente: Cliente | null = null;
  total:number=0
  clientes: Cliente[] = [];
  nuevoCliente: Partial<Cliente> = {};

  constructor(private clienteService: ClienteService,private cdr: ChangeDetectorRef) {}

  ngOnInit(){
    this.obtenerClientes();
  }

  obtenerClientes(aux=false): void {
    this.clienteService.getClientes(aux).subscribe(data => {this.clientes = data; this.cdr.detectChanges()});
  }

  guardarCliente(): void {
  if (this.nuevoCliente.nombre) {
    this.clienteService.createCliente(this.nuevoCliente as Cliente).subscribe((nuevoCliente) => {
      this.clientes.push(nuevoCliente);
      this.nuevoCliente = {};
      this.cdr.detectChanges();
    });
  }
}

  eliminarCliente(id: number): void {
    this.clienteService.deleteCliente(id).subscribe(() => {
    this.obtenerClientes(true);
  });
  }

  iniciarEdicion(cliente: Cliente): void {
    this.editandoId = cliente.id;
    this.backupCliente = JSON.parse(JSON.stringify(cliente));
  }

  guardarEdicion(cliente: Cliente): void {
    this.clienteService.updateCliente(cliente.id, cliente).subscribe(() => {
      this.editandoId = null;
      this.backupCliente = null;
      this.obtenerClientes();
    });
  }

  cancelarEdicion(): void {
    if (this.backupCliente) {
      const idx = this.clientes.findIndex(c => c.id === this.backupCliente!.id);
      if (idx > -1) {
        this.clientes[idx] = this.backupCliente;
      }
    }
    this.editandoId = null;
    this.backupCliente = null;
  }
  get totals(){
    this.total = this.clientes.length
    return this.total;
  }
}
