import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../services/evento-service'; // Caminho corrigido
import { Evento } from '../../model/evento';
import { CardEvento } from '../../shared/components/card-evento/card-evento';
import { ActivatedRoute  } from '@angular/router';

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

  constructor(
    private eventoService: EventoService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.filtrar();

    this.eventosTotais = this.eventoService.getEventos();

    this.route.queryParams.subscribe(params => {
      const busca = params['q'];
      if(busca){
        this.filtrarPorTexto(busca);
      } else {
        this.listaExibida = this.eventosTotais;
      }
    });
  }

  filtrarPorTexto(termo:string){
    const t = termo.toLowerCase();

    this.listaExibida = this.eventosTotais.filter(e => {
      return e.titulo.toLowerCase().includes(t) ||
        e.local.toLowerCase().includes(t) ||
        (e.artista && e.artista.toLowerCase().includes(t)) ||
        e.categoria.toLowerCase().includes(t);
      )
    });
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