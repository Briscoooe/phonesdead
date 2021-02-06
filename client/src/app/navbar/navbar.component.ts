import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  hamburgerMenuIsOpen = false;
  constructor() { }

  ngOnInit(): void {
  }

  toggleMenu(): void {
    this.hamburgerMenuIsOpen = !this.hamburgerMenuIsOpen;
  }
  login(): void {

  }

  logout(): void {

  }

  signup(): void {

  }
}
