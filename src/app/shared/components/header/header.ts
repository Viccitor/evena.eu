import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true, // Garante que é standalone
  imports: [RouterLink, RouterLinkActive], // Adicione CommonModule aqui
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  menuAberto = false;
  pesquisaAtiva = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  togglePesquisa() {
    // Se for desktop, apenas foca. Se for mobile, expande.
    if (window.innerWidth > 1024) {
      document.getElementById('campo-busca')?.focus();
      return;
    }

    this.pesquisaAtiva = !this.pesquisaAtiva;

    if (this.pesquisaAtiva) {
      setTimeout(() => document.getElementById('campo-busca')?.focus(), 100);
    }
  }

  pesquisar(event: any) {
    const valor = event.target.value;
    if (valor.trim()) {
      this.router.navigate(['/eventos'], { queryParams: { q: valor } });
      
      // Opcional: fechar a barra após pesquisar no mobile
      if (window.innerWidth <= 768) {
        this.pesquisaAtiva = false;
      }
    }
  }
}
