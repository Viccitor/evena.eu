import { Component } from '@angular/core';
import { BannerEventos } from "../../shared/components/banner-eventos/banner-eventos";
import { EventosPerto } from "../../shared/components/eventos-perto/eventos-perto";
import { Categorias } from "../../shared/components/categorias/categorias";

@Component({
  selector: 'app-home',
  imports: [BannerEventos, EventosPerto, Categorias],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
