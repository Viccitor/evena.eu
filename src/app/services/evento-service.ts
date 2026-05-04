import { Injectable } from '@angular/core';
import { Evento } from '../model/evento';

@Injectable({
  providedIn: 'root',
})
export class EventoService { 

  private listaEventos: Evento[] = [
    {
      id: 1, 
      titulo: 'Evento de Marketing Digital', 
      data: '24 de fev - 20:00', 
      localNome: 'Hotel Transilvânia',
      cidade: 'São Paulo', 
      uf: 'SP',
      preco: 0, 
      imagem: 'evento4.webp', 
      lat: -23.5611, 
      lng: -46.6559,
      categoria: ['Marketing']
    },
    {
      id: 2, 
      titulo: 'Workshop de Design', 
      data: '10 de mar - sábado às 14:00', 
      localNome: 'Teatro Multiplan',
      cidade: 'Rio de Janeiro', 
      uf: 'RJ',
      preco: 50.00, 
      imagem: 'evento2.jpeg', 
      lat: -22.9068, 
      lng: -43.1229,
      categoria: ['Negócios']
    },
    {
      id: 3, 
      titulo: 'Show Patati & Patatá', 
      data: ' 07 de abr - sábado às 14:00', 
      localNome: 'Espaço Itahy',
      cidade: 'Barueri', 
      uf: 'SP',
      preco: 40.00,
      imagem: 'https://itapeviacontece.com.br/wp-content/uploads/2025/10/IMG_8020.jpeg', 
      lat: -23.4988, 
      lng: -46.8458,
      categoria: ['Infantil', 'Música']
    },
    {
      id: 4, 
      titulo: 'Feira de intercâmbio', 
      data: ' Todas às sexta-feiras', 
      localNome: 'Espaço Mandacaru',
      cidade: 'Betim', 
      uf: 'MG',
      preco: 25.00,
      imagem: 'https://www.tvsorocaba.com.br/wp-content/uploads/2024/05/WhatsApp-Image-2024-05-22-at-11.54.59.jpeg', 
      lat: -23.5874, 
      lng: -46.6576,
      categoria: ['Educação'],
    }, 
    {
      id: 5, 
      titulo: 'Babymetal', 
      data: ' 27 de out - segunda-feira às 20:30', 
      localNome: 'SESC Sorocaba',
      cidade: 'Sorocaba', 
      uf: 'SP',
      preco: 250.00,
      imagem: 'https://rollingstone.com.br/wp-content/uploads/2025/05/conheca-a-banda-japonesa-babymetal-que-lanca-novo-album-em-breve.jpg', 
      lat: -19.9678, 
      lng: -44.1985,
      categoria: ['Música'],
    }, 
    {
      id: 6, 
      titulo: 'Jão - SUPERTURNÊ', 
      data: '15 de jan - 20:45', 
      localNome: 'Allianz Parque',
      cidade: 'São Paulo', 
      uf: 'SP',
      preco: 150.00, 
      imagem: 'https://bhdetalhes.com/wp-content/uploads/2024/02/Jao-superturne.jpg', 
      lat: -23.5273, 
      lng: -46.6785,
      categoria: ['Música'],
      artista: ['Jão'],
    },
    {
      id: 7,
      titulo: 'Lollapalooza',
      data: '30 de jul. – 2 de ago. de 2026',
      localNome: 'Autódromo de Interlagos',
      cidade: 'São Paulo',
      uf: 'SP',
      preco: 627.20,
      imagem: 'https://www.showmetech.com.br/wp-content/uploads//2025/08/Veja-o-Lineup-do-Lollapalooza-Brasil-2026.webp',
      categoria: ['Festival'],
      lat: -25.5273, 
      lng: -49.6785,
    },
    {
      id: 8,
      titulo: 'Show do Bita - Festa dos Bichos',
      data: '11 de abr - 14:30',
      localNome: 'Teatro Bradesco',
      cidade: 'São Paulo',
      uf: 'SP',
      preco: 60.00,
      imagem: 'https://irp.cdn-website.com/2c226423/dms3rep/multi/mundo+bita+em+joinville.jpeg',
      categoria: ['Infantil', 'Música'],
      lat: -23.5270,
      lng: -46.6726,
    }
  ]

  constructor() { }

  // Função para retornar a lista completa
  getEventos(): Evento[] {
    return this.listaEventos;
  }
}
