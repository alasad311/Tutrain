import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from './../service/Auth/auth-guard.service';
import { StorageService } from './../service/storage/storage.service';
import { FetchService } from './../service/api/fetch.service';
import { UtilService } from './../service/util.service';
import { MenuController, NavController,ModalController, AlertController  } from '@ionic/angular';
import { ActionPerformed, PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';

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

  constructor(private router: Router, private menuCtrl: MenuController,private nav: NavController,
    private fetch: FetchService, private auth: AuthGuardService, private storage: StorageService,
    private modalCtrl: ModalController,private util: UtilService,public alertController: AlertController ) {
     
     }

  async ionViewWillEnter() {
      const user = await this.storage.get('user');
      //fetch ads
      this.fetch.getHomePage(user.email).then((response) => {
        this.banner = JSON.parse(response[0].data).response;
        this.categories = JSON.parse(response[1].data).response;
        this.newCourses = JSON.parse(response[2].data).response;
      }).catch((error) => {
      });
  }
  searchPage(searchValue: any){
    this.nav.navigateForward('/search',{ state: searchValue });
    this.searchInput = '';
  }
  async doRefresh(event){
    this.banner = '';
    this.categories = '';
    this.newCourses = '';
    const email = await this.auth.isAuthenicated();
    //fetch ads
    this.fetch.getHomePage(email).then((response) => {
      this.banner = JSON.parse(response[0].data).response;
      this.categories = JSON.parse(response[1].data).response;
      this.newCourses = JSON.parse(response[2].data).response;
      event.target.complete();
    }).catch((error) => {
      event.target.complete();
    });
  }
  async ngOnInit() {
    this.menuCtrl.enable(true);
    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        //let navigate to requested slot
        let response = JSON.parse(JSON.stringify(notification)).notification.data;
        this.alertMessage("New Request",response.userFullName +" has requested a session on "+ response.slotDate + " from : "+response.timeFrom+" to: "+ response.timeTo)
        //JSON.parse(JSON.stringify(notification)).notification.data.bookID
        
      }
    );
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
  async alertMessage(header,message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header,
      message,
      buttons: [
        {
          text: 'Accept',
          handler: () => {
            console.log("Accepted");
          }
        },
        {
          text: 'Reject',
          handler: () => {
            console.log("Rejected");
          }
        },
        {
          text: 'Later',
          handler: () => {
            console.log("Later");
          }
        }
      ]
    });

    await alert.present();
  }
}
