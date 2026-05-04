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

  atualizarFiltros(novosFiltros: Partial<Filtros>): void {
    this.filtrosSubject.next({ ...this.filtrosSubject.value, ...novosFiltros });
  }

  resetarFiltros(): void {
    this.filtrosSubject.next(this.filtrosPadrao);
  }

  obterEventosFiltrados(eventosIniciais: Evento[]): Observable<Evento[]> {
    return this.filtros$.pipe(
      map(filtros => {
        const termoBusca = filtros.termo.toLowerCase().trim();

        return eventosIniciais.filter(evento => {
          // 1. Filtro por Termo (Busca no Header)
          // Agora busca no Título, LocalNome (ex: Teatro Bradesco) e Cidade
          const matchTermo = !termoBusca || 
            (evento.titulo && evento.titulo.toLowerCase().includes(termoBusca)) ||
            (evento.localNome && evento.localNome.toLowerCase().includes(termoBusca)) ||
            (evento.cidade && evento.cidade.toLowerCase().includes(termoBusca));

          // 2. Filtro por Estado (Sigla UF)
          const matchEstado = !filtros.estado || 
            (evento.uf && evento.uf.toUpperCase() === filtros.estado.toUpperCase());

          // 3. Filtro por Cidade (Dropdown de busca)
          const matchCidade = !filtros.cidade || 
            (evento.cidade && evento.cidade.toLowerCase().includes(filtros.cidade.toLowerCase()));
          
          // 4. Filtro por Categoria (Nav de Categorias)
          const matchCategoria = filtros.categoria === 'Todos' || 
            (evento.categoria && evento.categoria.includes(filtros.categoria));

          // 5. Filtro por Data
          // Nota: Ajuste a comparação se o formato da data no seu service mudar
          const matchData = !filtros.data || (evento.data && evento.data.includes(filtros.data));

          // O evento só é exibido se atender a TODOS os critérios ativos
          return matchTermo && matchEstado && matchCidade && matchCategoria && matchData;
        });
      })
    );
  }
}