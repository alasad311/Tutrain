import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  slideOpts = {
    speed: 300,
    loop: true,
    slidesPerView: 1.1,
    slidesToScroll: 1,
    swipeToSlide: true,
    // autoplay: true,
  };
  banner = [
    { img: 'assets/banner1.jpg' },
    { img: 'assets/banner2.jpg' },
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goToAddress(){
    this.router.navigate(['/address']);
  }
  goToRestaurant(){
    this.router.navigate(['/restaurant']);
  }

}
