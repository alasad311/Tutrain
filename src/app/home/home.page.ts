import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from './../service/Auth/auth-guard.service';
import { StorageService } from './../service/storage/storage.service';
import { FetchService } from './../service/api/fetch.service';
import { UtilService } from './../service/util.service';
import { MenuController, NavController,ModalController, AlertController  } from '@ionic/angular';
import { App as CapacitorApp } from '@capacitor/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  searchInput: any;
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
  banner: any;
  categories: any;
  newCourses: any;
  registeredCourses=[
    {
      id: 1,
      img: 'https://via.placeholder.com/1920x1280',
      name: 'Course Name 1',
      instructor: 'Name of Instructor',
      rating: 3
    },
    {
      id: 2,
      img: 'https://via.placeholder.com/1920x1280',
      name: 'Course Name 2',
      instructor: 'Name of Instructor',
      rating: 4
    },
    {
      id: 3,
      img: 'https://via.placeholder.com/1920x1280',
      name: 'Course Name 3',
      instructor: 'Name of Instructor',
      rating: 4.2
    },
    {
      id: 4,
      img: 'https://via.placeholder.com/1920x1280',
      name: 'Course Name 4',
      instructor: 'Name of Instructor',
      rating: 2.2
    },
  ];
  users: any;
  constructor(private router: Router, private menuCtrl: MenuController,private nav: NavController,
    private fetch: FetchService, private auth: AuthGuardService, private storage: StorageService,
    private modalCtrl: ModalController,private util: UtilService,public alertController: AlertController ) {
      CapacitorApp.addListener('backButton', ({canGoBack}) => {
        if(this.router.url != '/home')
        {
          this.nav.back();
        }

      });
     }

  ionViewDidEnter() {
    this.util.refreshUserData();
  }
  ionViewDidLeave() {
    this.util.refreshUserData();
  }
  searchPage(searchValue: any){
    this.nav.navigateForward('/search',{ state: searchValue });
    this.searchInput = '';
  }
  async doRefresh(event){
    this.banner = '';
    this.categories = '';
    this.newCourses = '';

    //fetch ads
    this.fetch.getHomePage(this.users.email).then((response) => {
      this.banner = JSON.parse(response[0].data).response;
      this.categories = JSON.parse(response[1].data).response;
      this.newCourses = JSON.parse(response[2].data).response;
      event.target.complete();
    }).catch((error) => {
      event.target.complete();
    });
  }
  async ngOnInit() {
    this.users = await this.storage.get('user');
    if(this.users && this.users.type != "student")
    {
      setTimeout( () => {
        if(this.users.tags == null || this.users.picture == null || this.users.hour_price == null)
        {
          this.alertMessageWithBtn('Update Profile','Hey '+this.users.fullname+' We can see that your profile is incomplete, to ensure your account being listed in our search you are requested to update your profile.\n Do you wish to update your profile now?');
        }
        //fetch ads
        this.fetch.getHomePage(this.users.email).then((response) => {
          this.banner = JSON.parse(response[0].data).response;
          this.categories = JSON.parse(response[1].data).response;
          this.newCourses = JSON.parse(response[2].data).response;
        }).catch((error) => {
        });
      }, 2000 );
    }else{
        //fetch ads
        this.fetch.getHomePage(this.users.email).then((response) => {
          this.banner = JSON.parse(response[0].data).response;
          this.categories = JSON.parse(response[1].data).response;
          this.newCourses = JSON.parse(response[2].data).response;
        }).catch((error) => {
        });
    }
  }
  gotToAd(link){
    window.open(link, '_system');
  }
  async openCategory(id){
    // const modal = await this.modalCtrl.create({
    //   component: CategoriesPage,
    //   swipeToClose: true,
    // });
    // await modal.present();
  }
  async alertMessageWithBtn(header,message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header,
      message,
      buttons: [
        {
          text: 'ok',
          id: 'confirm-button',
          handler: () => {
            alert.dismiss();
            this.router.navigate(['setting']);
          }
        },{
          text: 'Cancel',
          id: 'cancel-button',
          handler: () => {
            alert.dismiss();

          }
        }
      ]
    });

    await alert.present();
  }
}
