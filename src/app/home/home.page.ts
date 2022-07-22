import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
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
  contest: any;
  contestBadge: any;
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
  registeredCourses:any;

  users: any;
  constructor(private router: Router, private menuCtrl: MenuController,private nav: NavController,
    private fetch: FetchService, private auth: AuthGuardService, private storage: StorageService,
    private modalCtrl: ModalController,public util: UtilService,public alertController: AlertController,
    private route: ActivatedRoute ) {

     }

  async ionViewDidEnter() {
    this.util.refreshUserData();
    this.util.checkContest().then((response) => {
      this.contest = response;
      if(this.contest)
      {
        this.contestBadge = 1;
      }
    });
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
    this.registeredCourses = '';
    //fetch ads
    this.fetch.getHomePage(this.users.email).then((response) => {
      this.banner = JSON.parse(response[0].data).response;
      this.categories = JSON.parse(response[1].data).response;
      this.newCourses = JSON.parse(response[2].data).response;
      this.registeredCourses = JSON.parse(response[3].data).response;
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
          this.registeredCourses = JSON.parse(response[3].data).response;
        }).catch((error) => {
        });
      }, 2000 );
    }else{
        //fetch ads
        this.fetch.getHomePage(this.users.email).then((response) => {
          this.banner = JSON.parse(response[0].data).response;
          this.categories = JSON.parse(response[1].data).response;
          this.newCourses = JSON.parse(response[2].data).response;
          this.registeredCourses = JSON.parse(response[3].data).response;
        }).catch((error) => {
        });
    }
  }
  gotToAd(link){
    window.open(link, '_system');
  }
  async openCategory(value){
    this.nav.navigateForward('/search',{ state:value });
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
  goToCourse(selectID)
  {
    const navigationExtras: NavigationExtras = {
      queryParams: {
          page: '/home',
          id: selectID
      }
    };
    this.nav.navigateForward('/details/courses',navigationExtras);
  }
  goToAllPurchases(){
    this.router.navigate(['/payment-history'])
  }
  gotToAllNewCourses(){
    this.router.navigate(['/new-courses'])
  }
  openSearch(type)
  {
    this.nav.navigateForward('/search',{ state: {
      type: type 
    } });
  }
}
