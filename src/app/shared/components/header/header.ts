import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  menuAberto = false;

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  constructor(private router: Router){}

  OnSearch(event: any){
    const termo = event.target.value;
    this.router.navigate(['/eventos'], {queryParams: {q: termo} });
  }
}
