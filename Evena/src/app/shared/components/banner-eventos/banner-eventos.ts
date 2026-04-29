import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { Evento } from '../../../model/evento';

@Component({
  selector: 'app-banner-eventos',
  standalone: true,
  templateUrl: './banner-eventos.html',
  styleUrl: './banner-eventos.css',
})
export class BannerEventos implements OnInit, OnDestroy {
  listaBanner: Evento[] = [
    { id: 6, titulo: 'Jão - SUPERTURNÊ', data: '15 de Jan', local: 'Allianz Parque', imagem: 'https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/01/jao-superturne.jpg?w=849&h=477&crop=0' },
    { id: 10, titulo: 'Festival de Verão', data: '20 de Fev', local: 'Salvador - BA', imagem: 'evento1.jpg' },
    { id: 11, titulo: 'Show do Bita - Festa dos Animais', data: '25 de Mar', local: 'Rio de Janeiro - RJ', imagem: 'https://irp.cdn-website.com/2c226423/dms3rep/multi/mundo+bita+em+joinville.jpeg' },
    { id: 12, titulo: 'Guns N’ Roses', data: '25 de Out', local: 'São Paulo - SP', imagem: 'https://legatos.com.br/uploads/2025/06/guns-n-roses-anuncia-cinco-shows-no-brasil-em-2025-datas-e-cidades-confirmadas.webp' },
    { id: 3, imagem: 'banners/1.png'}
  ];

  index = 0;
  timer: any;
  private touchStartX = 0;
  private touchEndX = 0;
  private isMoving = false; // Proteção para não clicar enquanto desliza
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.iniciarTimer();
  }

  ngOnDestroy() {
    this.pararTimer();
  }

  iniciarTimer() {
    this.pararTimer();
    this.timer = setInterval(() => {
      this.proximo(false);
     }, 4000);
  }

  pararTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

   proximo(manual: boolean = true) {
    this.index = (this.index + 1) % this.listaBanner.length;
    this.cdr.detectChanges();
    if (manual) {
      this.iniciarTimer();

    }
  }

  anterior() {
    this.index = (this.index - 1 + this.listaBanner.length) % this.listaBanner.length;
    this.cdr.detectChanges();
    this.iniciarTimer();
  }

  irPara(i: number) {
  this.index = i;
  this.iniciarTimer(); // Reinicia o contador de 4 segundos
  this.cdr.detectChanges(); // Garante que a bolinha mude de cor na hora
  }


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

    if (event.key === 'ArrowRight') this.proximo();
    else if (event.key === 'ArrowLeft') this.anterior();
  }

  touchStart(e: TouchEvent) {
    this.touchStartX = e.changedTouches[0].screenX;
    this.isMoving = false;
    this.pararTimer();
  }

  touchEnd(e: TouchEvent) {
    this.touchEndX = e.changedTouches[0].screenX;
    const diff = Math.abs(this.touchStartX - this.touchEndX);
    
    if (diff > 10) this.isMoving = true; // Se moveu mais de 10px, é swipe
    
    this.handleSwipe();
  }

  handleSwipe() {
    const threshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) this.proximo();
      else this.anterior();
    }
    this.iniciarTimer();
  }

  abrirEvento(id: number) {
    if (this.isMoving) return;
    console.log('Navegando para o evento:', id);
  }
}