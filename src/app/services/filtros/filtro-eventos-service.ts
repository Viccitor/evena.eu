import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { Evento } from '../../model/evento'; // Ajuste o caminho

export interface Filtros {
  termo: string;
  estado: string;
  cidade: string;
  data: string;
  categoria: string;
}

@Injectable({ providedIn: 'root' })
export class FiltroEventosService {
  private readonly filtrosPadrao: Filtros = {
    termo: '', estado: '', cidade: '', data: '', categoria: 'Todos'
  };

  private filtrosSubject = new BehaviorSubject<Filtros>(this.filtrosPadrao);
  filtros$ = this.filtrosSubject.asObservable();

  private normalizarTexto(texto: string): string {
    if (!texto) return '';
    return texto
      .toLowerCase()
      .normalize('NFD') // Decompõe caracteres acentuados (ex: á -> a + ´)
      .replace(/[\u0300-\u036f]/g, ''); // Remove os acentos (os sinais diacríticos)
  }

  atualizarFiltros(novosFiltros: Partial<Filtros>): void {
    this.filtrosSubject.next({ ...this.filtrosSubject.value, ...novosFiltros });
  }

  resetarFiltros(): void {
    this.filtrosSubject.next(this.filtrosPadrao);
  }

  obterEventosFiltrados(eventosIniciais: Evento[]): Observable<Evento[]> {
    return this.filtros$.pipe(
      map(filtros => {
        // Normalizamos o termo que o usuário digitou
        const termoBusca = this.normalizarTexto(filtros.termo);

        return eventosIniciais.filter(evento => {
          
          // 1. Filtro por Termo (Busca no Header)
          // Normalizamos todos os campos do evento antes de comparar
          const tituloNorm = this.normalizarTexto(evento.titulo);
          const localNorm = this.normalizarTexto(evento.localNome);
          const cidadeNorm = this.normalizarTexto(evento.cidade);

          const matchTermo = !termoBusca || 
            tituloNorm.includes(termoBusca) ||
            localNorm.includes(termoBusca) ||
            cidadeNorm.includes(termoBusca);

          // 2. Filtro por Estado (UF geralmente não tem acento, mas normalizamos por segurança)
          const matchEstado = !filtros.estado || 
            this.normalizarTexto(evento.uf) === this.normalizarTexto(filtros.estado);

          // 3. Filtro por Cidade (Dropdown)
          const matchCidade = !filtros.cidade || 
            cidadeNorm.includes(this.normalizarTexto(filtros.cidade));
          
          // 4. Filtro por Categoria
          const matchCategoria = filtros.categoria === 'Todos' || 
            (evento.categoria && evento.categoria.includes(filtros.categoria));

          // 5. Filtro por Data
          const matchData = !filtros.data || (evento.data && evento.data.includes(filtros.data));

          return matchTermo && matchEstado && matchCidade && matchCategoria && matchData;
        });
      })
    );
  }
}