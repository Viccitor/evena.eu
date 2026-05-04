import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltroEventosService } from '../../../../services/filtros/filtro-eventos-service'; // Ajuste o caminho se necessário

@Component({
  selector: 'app-header-filtro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./header-filtro.html",
  styleUrl: "./header-filtro.css",
})
export class HeaderFiltroComponent implements OnInit {
  estadoSelecionado: string = '';

  constructor(private filtroService: FiltroEventosService) {}

  ngOnInit(): void {
    // Subscrevemos para garantir que se o IP detectar o estado, o select atualize
    this.filtroService.filtros$.subscribe(filtros => {
      this.estadoSelecionado = filtros.estado;
    });
  }

  onEstadoChange(): void {
    // Quando o usuário muda o estado, avisamos o serviço global
    this.filtroService.atualizarFiltros({ 
      estado: this.estadoSelecionado,
      cidade: '' // Boa prática: resetar cidade ao mudar estado
    });
  }
}