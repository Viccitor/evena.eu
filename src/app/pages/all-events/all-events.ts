import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../services/evento-service';
import { Evento } from '../../model/evento';
import { CardEvento } from '../../shared/components/card-evento/card-evento';
import { ActivatedRoute, Router  } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-events',
  standalone: true,
  imports: [CommonModule, CardEvento, FormsModule],
  templateUrl: './all-events.html',
  styleUrl: './all-events.css'
})
export class AllEvents implements OnInit {
  listaExibida: Evento[] = [];
  eventosTotais: Evento[] = []; // 1. DECLARAR ESSA VARIÁVEL
  
  categorias: string[] = ['Todos', 'Negócios', 'Música', 'Teatro', 'Educação', 'Infantil', 'Tecnologia', 'Gastrônomia', 'Esportes', 'Festival'];
  
  // Variáveis de Controle de Filtro
  termoBusca: string = ''
  cidadeFiltro: string = '';
  dataFiltro: string = '';
  estadoSelecionado: string = '';
  categoriaSelecionada: string = 'Todos';
  
  cidadesComEventos: string[] = [];

  cidadeDetectadaPeloIP: string = '';

  constructor(
    private eventoService: EventoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Carregamos os dados de forma síncrona
    this.eventosTotais = this.eventoService.getEventos();
    this.listaExibida = [...this.eventosTotais];

    // 2. Chamamos a inicialização de localidade (sem travar o ngOnInit)
    this.inicializarLocalidade();
    
    this.route.queryParams.subscribe(params => {
      this.termoBusca = params['q'] || '';
      this.aplicarFiltrosCombo();
    });
  }

  // Criamos uma função async separada para não dar erro no ngOnInit
  async inicializarLocalidade() {
    const cidadeSalva = localStorage.getItem('evena_cidade');
    
    if (cidadeSalva) {
      this.cidadeFiltro = cidadeSalva;
    } else {
      // Agora o await funciona aqui porque a função é async
      await this.localizacaoPorIP();
    }

    this.atualizarCidadesDisponiveis();
    this.aplicarFiltrosCombo();
  }

  async localizacaoPorIP() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    if (data.city) {
      this.cidadeFiltro = data.city;
      this.cidadeDetectadaPeloIP = data.city; // Para a lógica do botão limpar
      this.estadoSelecionado = data.region_code; // Sigla: SP, RJ...
      
      localStorage.setItem('evena_cidade', data.city);
      
      // IMPORTANTE: Após receber o IP, atualizamos a lista e as cidades do datalist
      this.atualizarCidadesDisponiveis();
      this.aplicarFiltrosCombo();
    }
  } catch (error) {
    console.error("Erro ao detectar IP, mantendo padrão Brasil.");
  }
}

  trocarEstadoManual() {
    this.cidadeFiltro = ''; // Limpa a cidade se mudar o estado
    this.atualizarCidadesDisponiveis();
    this.aplicarFiltrosCombo();
  }

  // Gera a lista de cidades baseada no estado para o datalist
  atualizarCidadesDisponiveis() {
    this.cidadesComEventos = [...new Set(
      this.eventosTotais
        .filter(e => !this.estadoSelecionado || e.local.includes(this.estadoSelecionado))
        .map(e => e.local.split('-')[1]?.trim() || e.local)
    )].sort();
  }

  abrirDatalist() {
      // Se o campo estiver vazio, limpamos e resetamos o valor para forçar 
      // o navegador a mostrar a lista de sugestões completa
      if (!this.cidadeFiltro) {
        this.cidadeFiltro = ''; 
      }
  }

  // Adicione esta função para ser usada no (click) da sua seta
  focarNoInput() {
    const input = document.getElementById('campo-cidade') as HTMLInputElement;
    if (input) {
      input.focus();
      // Em alguns navegadores, isso já expande o datalist se o campo estiver vazio
      if('showPicker' in HTMLInputElement.prototype) {
        try{
          input.showPicker();
        } catch (error) {
          input.click();
        }
      }
    }
  }

  // Essa função remove acentos e deixa tudo em minúsculo
  private normalizarTexto(texto: string): string {
    if (!texto) return '';
    return texto
      .normalize('NFD')               // Decompõe os caracteres acentuados (ex: 'ã' vira 'a' + '~')
      .replace(/[\u0300-\u036f]/g, "") // Remove os acentos (o '~')
      .toLowerCase() 
      .trim();              
  }

  filtrarPorTexto(termo: string) {
   // 1. Transformamos o termo da busca em minúsculo
   const termoNormalizado = this.normalizarTexto(termo);

   // 2. Quando pesquisamos por texto, "resetamos" a aba visual para 'Todos'
   // Isso resolve a confusão do usuário estar na aba "Teatro" vendo o "Jão"
   this.categoriaSelecionada = 'Todos';

   this.listaExibida = this.eventosTotais.filter(e => {
     // 3. Criamos uma string única com tudo que pode ser pesquisado
     // Normalizamos os campos do evento antes de comparar
     const tituloNormalizado = this.normalizarTexto(e.titulo);
     const artistaNormalizado = this.normalizarTexto((e.artista || []).join(' '));
     const categoriaNormalizada = this.normalizarTexto((e.categoria || []).join(' '));
     const localNormalizado = this.normalizarTexto(e.local);

     return tituloNormalizado.includes(termoNormalizado) || 
            artistaNormalizado.includes(termoNormalizado) || 
            categoriaNormalizada.includes(termoNormalizado) || 
            localNormalizado.includes(termoNormalizado);
     });
  }

  selecionarCategoria(nome: string): void {
    this.categoriaSelecionada = nome;
    this.aplicarFiltrosCombo();
  }

  private filtrar(): void {
    // Usamos a lista original para filtrar
    this.listaExibida = this.categoriaSelecionada === 'Todos' 
      ? this.eventosTotais 
      : this.eventosTotais.filter(e => e.categoria.includes(this.categoriaSelecionada));
  }

  // Verificação real se existe algum filtro aplicado
  get temFiltroAtivo(): boolean {
    const temBuscaTexto = !!this.route.snapshot.queryParams['q'];
    const temCategoria = this.categoriaSelecionada !== 'Todos';
    const temData = !!this.dataFiltro;

    const cidadeFoiAlteradaManualmente = this.cidadeFiltro !== this.cidadeDetectadaPeloIP && this.cidadeFiltro !== '';

    return temBuscaTexto || temCategoria || temData || cidadeFoiAlteradaManualmente;
  }

  limparBusca(): void {
    // 1. Remove o parâmetro 'q' da URL
    this.router.navigate([], {
      queryParams: { q: null },
      queryParamsHandling: 'merge'
    });

    // 2. Reseta as variáveis locais de filtro
    this.termoBusca = '';
    this.cidadeFiltro = ''; 
    this.dataFiltro = '';
    this.estadoSelecionado = '';
    this.categoriaSelecionada = 'Todos';
   
    // 3. Restaura a lista original
    this.listaExibida = [...this.eventosTotais];
     this.atualizarCidadesDisponiveis();
  }

  aplicarFiltrosCombo() {
    // 1. Sempre partimos da lista completa
    this.listaExibida = this.eventosTotais.filter(e => {
      
      // Filtro de Texto (Busca do Header)
      const termoURL = this.normalizarTexto(this.termoBusca);
      const matchesTexto = !termoURL || 
        this.normalizarTexto(`${e.titulo} ${e.artista?.join(' ')} ${e.local}`).includes(termoURL);
    
      // Filtro de Categoria (Chips)
      const matchesCategoria = this.categoriaSelecionada === 'Todos' || 
        e.categoria.includes(this.categoriaSelecionada);
    
      // Filtro de Estado (O Select do título)
      // Verifica se a sigla do estado (ex: SP) está contida na string de local do evento
      const matchesEstado = !this.estadoSelecionado || e.local.includes(this.estadoSelecionado);
    
      // Filtro de Cidade (O Input com datalist)
      const cidadeNormalizada = this.normalizarTexto(this.cidadeFiltro);
      const matchesCidade = !cidadeNormalizada || 
        this.normalizarTexto(e.local).includes(cidadeNormalizada);
    
      // Filtro de Data
      const matchesData = !this.dataFiltro || e.data === this.dataFiltro;
    
      // O evento só aparece se passar em TODOS os filtros ativos (Lógica AND)
      return matchesTexto && matchesCategoria && matchesEstado && matchesCidade && matchesData;
    });
  }
}