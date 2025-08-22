import { Component, OnInit } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{

  ngOnInit(): void {
      localStorage.removeItem('modulo');
      sessionStorage.removeItem('key');
  }

  constructor(private router: Router) {}

  onSubmitModulo1(){
    this.router.navigate(['/login']);
    localStorage.setItem('modulo', "1");
  };

  onSubmitModulo2(){
    this.router.navigate(['/login']);
    localStorage.setItem('modulo', "2");
  };

  onSubmitModulo3(){
    this.router.navigate(['/login']);
    localStorage.setItem('modulo', "3");
  };
  
  onSubmitModulo4(){
    this.router.navigate(['/login']);
    localStorage.setItem('modulo', "4");
  }; 
}
