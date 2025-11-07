import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuModuloFour } from './components/menu/menu-home/menu-modulo-four/menu-modulo-four';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'SIPCIA-Front';
}
