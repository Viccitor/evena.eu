import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../services/evento-service'; // Caminho corrigido
import { Evento } from '../../model/evento';
import { CardEvento } from '../../shared/components/card-evento/card-evento';

@Component({
  selector: 'app-all-events',
  standalone: true,
  imports: [CommonModule, CardEvento],
  templateUrl: './all-events.html',
  styleUrl: './all-events.css'
})
export class AllEvents implements OnInit {
  listaExibida: Evento[] = [];
  categorias: string[] = ['Todos', 'Negócios', 'Música', 'Teatro', 'Educação', 'Infantil', 'Tecnologia', 'Gastrônomia', 'Esportes', 'Festival'];
  categoriaSelecionada: string = 'Todos';

  constructor(private eventoService: EventoService) {}

  ngOnInit(): void {
    this.filtrar();
  }

  selecionarCategoria(nome: string): void {
    this.categoriaSelecionada = nome;
    this.filtrar();
  }

  private filtrar(): void {
    const todos = this.eventoService.getEventos();
    this.listaExibida = this.categoriaSelecionada === 'Todos' 
      ? todos 
      : todos.filter(e => e.categoria === this.categoriaSelecionada);
  }
}