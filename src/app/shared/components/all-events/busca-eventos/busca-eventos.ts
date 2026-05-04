import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltroEventosService } from '../../../../services/filtros/filtro-eventos-service';
import { Localidade } from '../../../../services/lista-cidades/localidade';

@Component({
  selector: 'app-busca-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './busca-eventos.html',
  styleUrl: './busca-eventos.css'
})
export class BuscaEventosComponent implements OnInit {
  cidade: string = '';
  data: string = '';
  cidadesSugestao: string[] = [];

  constructor(
    private filtroService: FiltroEventosService,
    private servicoLocalidade: Localidade
  ) {}


  ngOnInit(): void {
    this.filtroService.filtros$.subscribe(filtros => {
      // 1. Sincroniza a cidade local com o filtro global (importante para resetar)
      this.cidade = filtros.cidade;

      // 2. Gerencia a lista de sugestões do dropdown
      if (filtros.estado) {
        // Carrega as novas cidades baseadas no estado selecionado
        this.cidadesSugestao = this.servicoLocalidade.obterCidades(filtros.estado);
      } else {
        // Se mudar para "Brasil", limpa o dropdown
        this.cidadesSugestao = [];
      }
    });
  }

  aoMudarCidade() {
    this.filtroService.atualizarFiltros({ cidade: this.cidade });
  }

  aoMudarData() {
    this.filtroService.atualizarFiltros({ data: this.data });
  }
}
