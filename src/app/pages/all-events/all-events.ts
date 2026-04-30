import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../services/evento-service'; // Caminho corrigido
import { Evento } from '../../model/evento';
import { CardEvento } from '../../shared/components/card-evento/card-evento';
import { ActivatedRoute, Router  } from '@angular/router';

@Component({
  selector: 'app-all-events',
  standalone: true,
  imports: [CommonModule, CardEvento],
  templateUrl: './all-events.html',
  styleUrl: './all-events.css'
})
export class AllEvents implements OnInit {
  listaExibida: Evento[] = [];
  eventosTotais: Evento[] = []; // 1. DECLARAR ESSA VARIÁVEL
  
  categorias: string[] = ['Todos', 'Negócios', 'Música', 'Teatro', 'Educação', 'Infantil', 'Tecnologia', 'Gastrônomia', 'Esportes', 'Festival'];
  categoriaSelecionada: string = 'Todos';

  constructor(
    private eventoService: EventoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 2. Primeiro carregamos os dados
    this.eventosTotais = this.eventoService.getEventos();
    
    // 3. Depois ouvimos as mudanças na URL
    this.route.queryParams.subscribe(params => {
      const busca = params['q'];
      if (busca) {
        this.filtrarPorTexto(busca);
      } else {
        this.filtrar(); 
      }
    });
  }

  // Essa função remove acentos e deixa tudo em minúsculo
private normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')               // Decompõe os caracteres acentuados (ex: 'ã' vira 'a' + '~')
    .replace(/[\u0300-\u036f]/g, "") // Remove os acentos (o '~')
    .toLowerCase();                 // Deixa minúsculo
}

filtrarPorTexto(termo: string) {
  // 1. Transformamos o termo da busca em minúsculo
  const t = termo.toLowerCase().trim();

  // 2. Quando pesquisamos por texto, "resetamos" a aba visual para 'Todos'
  // Isso resolve a confusão do usuário estar na aba "Teatro" vendo o "Jão"
  this.categoriaSelecionada = 'Todos';

  this.listaExibida = this.eventosTotais.filter(e => {
    // 3. Criamos uma string única com tudo que pode ser pesquisado
    // Normalizamos os campos do evento antes de comparar
    const titulo = this.normalizarTexto(e.titulo);
    const artista = this.normalizarTexto((e.artista || []).join(' '));
    const categoria = this.normalizarTexto((e.categoria || []).join(' '));
    const local = this.normalizarTexto(e.local);

    return titulo.includes(t) || artista.includes(t) || categoria.includes(t) || local.includes(t);
    });
  }

  selecionarCategoria(nome: string): void {
    this.categoriaSelecionada = nome;
    this.filtrar();
  }

  private filtrar(): void {
    // Usamos a lista original para filtrar
    this.listaExibida = this.categoriaSelecionada === 'Todos' 
      ? this.eventosTotais 
      : this.eventosTotais.filter(e => e.categoria.includes(this.categoriaSelecionada));
  }

  limparBusca(): void {
    // 1. Navega para a mesma rota, mas removendo o parâmetro 'q' da URL
    this.router.navigate([], {
      queryParams: { q: null },
      queryParamsHandling: 'merge'
    }); 

    // 2. Garante que a categoria volte para 'Todos'
    this.categoriaSelecionada = 'Todos';

    // 3. Restaura a lista completa
    this.listaExibida = this.eventosTotais;
  }
}