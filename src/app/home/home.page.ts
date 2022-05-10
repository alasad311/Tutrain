import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from "./../service/Auth/auth-guard.service"
import { StorageService } from "./../service/storage/storage.service"
import { FetchService } from "./../service/api/fetch.service"
import { UtilService } from "./../service/util.service"
import { MenuController } from '@ionic/angular';
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
  banner:any;
  categories:any;
  newCourses:any;
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
  
  constructor(private router: Router, private menuCtrl: MenuController,
    private fetch: FetchService, private auth:AuthGuardService, private storage:StorageService,
    private util:UtilService ) { }
  ionViewWillEnter() {
    setTimeout(async () => {
      const user = await this.storage.get("user")
      //fetch ads
      this.fetch.getAds().then((response) => {
        var json = JSON.parse(response.data);
        this.banner = json.response
      }).catch((error) => {
      });
      //fetch catgories
      this.fetch.getCategory().then((response) => {
        var json = JSON.parse(response.data);
        this.categories = json.response
      }).catch((error) => {
      });
      //fetch courses
      this.fetch.getNewCourses(user.email).then((response) => {
        var json = JSON.parse(response.data);
        this.newCourses = json.response
      }).catch((error) => {
      });
     
    }, 3000);
    
  }
  async doRefresh(event){
    this.banner = "";
    this.categories = "";
    this.newCourses = "";
    const email = await this.auth.isAuthenicated()
    setTimeout(() => {
      //fetch ads
      this.fetch.getAds().then((response) => {
        var json = JSON.parse(response.data);
        this.banner = json.response
      }).catch((error) => {
        
      });
      //fetch catgories
      this.fetch.getCategory().then((response) => {
        var json = JSON.parse(response.data);
        this.categories = json.response
      }).catch((error) => {
        
      });
      //fetch courses
      this.fetch.getNewCourses(email).then((response) => {
        var json = JSON.parse(response.data);
        this.newCourses = json.response
      }).catch((error) => {
        
      });
      event.target.complete();
    }, 3000);
  }
  ngOnInit() {
    this.menuCtrl.enable(true);
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
