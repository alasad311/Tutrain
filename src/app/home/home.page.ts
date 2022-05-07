import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from './../service/util.service';
import { StorageService } from "./../service/storage/storage.service"
import { FetchService } from "./../service/api/fetch.service"
import {  MenuController } from '@ionic/angular';

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
  slideOptss = {
    slidesPerView: 1.5,
    slidesToScroll: 1,
    swipeToSlide: true,
  };
  banner = [
    { 
      breif: "AD",
      img: 'https://via.placeholder.com/1000x1000',
      link: "http://www.google.com"
    },
    { 
      breif: "AD",
      img: 'https://via.placeholder.com/1000x1000',
      link: "http://www.google.com"
    },
  ];
  categories = [
    {
      name: "test 1",
      img : "https://via.placeholder.com/512x512"
    },
    {
      name: "test 2",
      img : "https://via.placeholder.com/512x512"
    },
    {
      name: "test 3",
      img : "https://via.placeholder.com/512x512"
    },
    {
      name: "test 4",
      img : "https://via.placeholder.com/512x512"
    },
    {
      name: "test 5",
      img : "https://via.placeholder.com/512x512"
    },
    {
      name: "test 6",
      img : "https://via.placeholder.com/512x512"
    },
    {
      name: "test 7",
      img : "https://via.placeholder.com/512x512"
    },
    {
      name: "test 8",
      img : "https://via.placeholder.com/512x512"
    },
    {
      name: "test 9",
      img : "https://via.placeholder.com/512x512"
    },
  ]
  registeredCourses=[
    {
      id: 1,
      img: "https://via.placeholder.com/1920x1280",
      name: "Course Name 1",
      instructor: "Name of Instructor",
      rating: 3
    },
    {
      id: 2,
      img: "https://via.placeholder.com/1920x1280",
      name: "Course Name 2",
      instructor: "Name of Instructor",
      rating: 4
    },
    {
      id: 3,
      img: "https://via.placeholder.com/1920x1280",
      name: "Course Name 3",
      instructor: "Name of Instructor",
      rating: 4.2
    },
    {
      id: 4,
      img: "https://via.placeholder.com/1920x1280",
      name: "Course Name 4",
      instructor: "Name of Instructor",
      rating: 2.2
    },
  ]
  newCourses=[
    {
      id: 1,
      img: "https://via.placeholder.com/1920x1280",
      name: "Course Name 1",
      instructor: "Name of Instructor",
      rating: 3,
      price: '3.400'
    },
    {
      id: 2,
      img: "https://via.placeholder.com/1920x1280",
      name: "Course Name 2",
      instructor: "Name of Instructor",
      rating: 4,
      price: '3.400'
    },
    {
      id: 3,
      img: "https://via.placeholder.com/1920x1280",
      name: "Course Name 3",
      instructor: "Name of Instructor",
      rating: 4.2,
      price: '3.400'
    },
    {
      id: 4,
      img: "https://via.placeholder.com/1920x1280",
      name: "Course Name 4",
      instructor: "Name of Instructor",
      rating: 2.2,
      price: '3.400'
    },
  ]
  constructor(private router: Router,private util: UtilService, 
    private storage: StorageService,private menuCtrl: MenuController,
    private fetch: FetchService ) { }

  ngOnInit() {
    this.menuCtrl.enable(true);

    //fetch ads


  }
  goToAddress(){
    this.router.navigate(['/address']);
  }
  goToRestaurant(){
    this.router.navigate(['/restaurant']);
  }
  gotToAd(link){
    window.open(link, '_system');
  }
}
