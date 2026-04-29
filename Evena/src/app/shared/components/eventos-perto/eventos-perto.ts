import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CardEvento } from "../card-evento/card-evento";
import { Evento } from '../../../model/evento';

@Component({
  selector: 'app-eventos-perto',
  standalone: true,
  imports: [CardEvento],
  templateUrl: './eventos-perto.html',
  styleUrl: './eventos-perto.css',
})
export class EventosPerto implements OnInit {
  @ViewChild('carousel') carousel!: ElementRef;
  
  // LISTA DE EVENTOS
  listaEventos: Evento[] = [
    {id: 1, titulo: 'Evento de Marketing', data: '24 de fev - sexta-feira às 20:00', local: 'São Paulo - SP', preco: 0, imagem: 'evento4.webp', lat: -23.5611, lng: -46.6559},
    {id: 2, titulo: 'Workshop de Design', data: '10 de mar - sábado às 14:00', local: 'Rio de Janeiro - RJ', preco: 50.00, imagem: 'evento2.jpeg', lat: -22.9068, lng: -43.1229},
    {id: 3, titulo: 'Show Patati & Patatá', data: ' 07 de abr - sábado às 14:00', local: 'Barueri-SP', imagem: 'https://itapeviacontece.com.br/wp-content/uploads/2025/10/IMG_8020.jpeg', lat: -23.4988, lng: -46.8458},
    {id: 4, titulo: 'Feira de intercâmbio', data: ' Todas às sexta-feiras', local: 'Betim - MG', imagem: 'https://www.tvsorocaba.com.br/wp-content/uploads/2024/05/WhatsApp-Image-2024-05-22-at-11.54.59.jpeg', lat: -23.5874, lng: -46.6576},
    {id: 5, titulo: 'Babymetal', data: ' 27 de out - segunda-feira às 20:30', local: 'Sorocaba - MG', imagem: 'https://rollingstone.com.br/wp-content/uploads/2025/05/conheca-a-banda-japonesa-babymetal-que-lanca-novo-album-em-breve.jpg', lat: -19.9678, lng: -44.1985}, 
    {id: 6, titulo: 'Superturnê', data: ' 15 de jan - sábado às 20:45', local: 'São Paulo - SP', imagem: 'https://bhdetalhes.com/wp-content/uploads/2024/02/Jao-superturne.jpg', lat: -23.5273, lng: -46.6559}   
  ]

  eventosProximosGps: Evento[] = [];

  // CONTROLES DE LOCALIZAÇÃO E ESTADO
  localizacaoAtiva = false;
  cidadeDetectada = '';

  async ngOnInit() {
    
    // 1. Tenta pegar a cidade que ficou salva da última vez que funcionou
    const cidadeSalva = localStorage.getItem('evena_cidade');
    if (cidadeSalva) {
      this.cidadeDetectada = cidadeSalva;
    }

  // 2. Tenta atualizar a cidade via IP (sem travar o código se der erro)
  this.localizacaoPorIP();

    // 2. Checa se o navegador já tem permissão de GPS de visitas anteriores
    if (navigator.permissions) {
      const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      
      // Se o estado for 'granted', o card pode sumir porque o GPS já está autorizado
      if (result.state === 'granted') {
        this.solicitarLocalizacao();
      }
      
      result.onchange = () => {
        if (result.state === 'granted') this.solicitarLocalizacao();
        else this.localizacaoAtiva = false;
      };
    }
  }
  
  async localizacaoPorIP() {
    try {
      // Usando a ip-api.com que é mais estável para testes locais
      const response = await fetch('http://ip-api.com/json');
      const data = await response.json();
      
      if (data.city) {
        this.cidadeDetectada = data.city;
        // Salva para a próxima vez que der F5
        localStorage.setItem('evena_cidade', data.city); 
      }
    } catch (error) {
      console.warn('IP-API bloqueada ou falhou. Mantendo fallback.');
      if (!this.cidadeDetectada) {
        this.cidadeDetectada = 'sua região';
      }
    }
  }

  solicitarLocalizacao() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latUser = position.coords.latitude;
          const lngUser = position.coords.longitude;
          this.localizacaoAtiva = true;

          // FILTRO: Pega a lista original e calcula a distância
          this.eventosProximosGps = this.listaEventos
            .filter(e => e.lat && e.lng) // Garante que tem coordenada
            .map(e => ({
              ...e,
              distancia: this.calcularDistancia(latUser, lngUser, e.lat!, e.lng!)
            }))
            .filter(e => e.distancia! <= 15) // Raio de 15km
            .sort((a, b) => a.distancia! - b.distancia!);
        },
        (error) => { console.error(error); }
      );
    }
  }

  // 2. Adicione a função de cálculo (Haversine)
  calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return parseFloat((R * c).toFixed(1)); 
  }

  private tratarErroLocalizacao(error: any) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.warn("Usuário negou GPS.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.error("Localização indisponível.");
        break;
      case error.TIMEOUT:
        console.error("A requisição de GPS expirou.");
        break;
    }
  }

  // CONTROLES DO CARROSSEL
  scrollDireita() {
    const cardWidth = this.carousel.nativeElement.firstElementChild?.offsetWidth || 333;
    this.carousel.nativeElement.scrollLeft += (cardWidth + 29);
  }

  scrollEsquerda() {
    const cardWidth = this.carousel.nativeElement.firstElementChild?.offsetWidth || 333;
    this.carousel.nativeElement.scrollLeft -= (cardWidth + 29);
  }

  abrirDetalhes(id: number) {
    console.log("Navegando para o evento ID:", id);
  }
}