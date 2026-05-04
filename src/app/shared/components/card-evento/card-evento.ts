import { Component, Input } from '@angular/core';
import { Evento } from '../../../model/evento';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-evento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-evento.html',
  styleUrl: './card-evento.css',
})
export class CardEvento {
  @Input({ required: true }) dadosEvento!: Evento;

  irParaEvento() {
    // Por enquanto, apenas avisamos no console que funcionou
    console.log('Você clicou no evento:', this.dadosEvento.titulo);
    
    // No futuro, aqui usaremos o Router para navegar:
    // this.router.navigate(['/detalhes', this.dadosEvento.id]);
  }
}
