import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { StorageService } from './../service/storage/storage.service';
import { FetchService } from './../service/api/fetch.service';
import { UtilService } from './../service/util.service';
import { NavController,AlertController  } from '@ionic/angular';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';

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
  newTutor: any;
  users: any;
  constructor(private router: Router, private nav: NavController,
    private fetch: FetchService, private storage: StorageService,
    public util: UtilService,public alertController: AlertController,
    private statusBar: StatusBar,public translate: TranslateService ) {
     }

  async ionViewDidEnter() {
    this.statusBar.backgroundColorByHexString('#ffffff');
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
    this.newTutor = '';
    //fetch ads
    this.fetch.getHomePage(this.users.email).then((response) => {
      this.banner = JSON.parse(response[0].data).response;
      this.categories = JSON.parse(response[1].data).response;
      this.newCourses = JSON.parse(response[2].data).response;
      this.registeredCourses = JSON.parse(response[3].data).response;
      this.newTutor = JSON.parse(response[4].data).response;

      event.target.complete();
    }).catch(() => {
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
          this.alertMessageWithBtn(this.translate.instant('message.missingprofile'),
          this.translate.instant('message.missingprofilemessage',{fullname: this.users.fullname}));
        }
        //fetch ads
        this.fetch.getHomePage(this.users.email).then((response) => {
          this.banner = JSON.parse(response[0].data).response;
          this.categories = JSON.parse(response[1].data).response;
          this.newCourses = JSON.parse(response[2].data).response;
          this.registeredCourses = JSON.parse(response[3].data).response;
          this.newTutor = JSON.parse(response[4].data).response;
        }).catch(() => {
        });
      }, 2000 );
    }else{
        //fetch ads
        this.fetch.getHomePage(this.users.email).then((response) => {
          this.banner = JSON.parse(response[0].data).response;
          this.categories = JSON.parse(response[1].data).response;
          this.newCourses = JSON.parse(response[2].data).response;
          this.registeredCourses = JSON.parse(response[3].data).response;
          this.newTutor = JSON.parse(response[4].data).response;

        }).catch(() => {
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
          text: this.translate.instant('message.ok'),
          id: 'confirm-button',
          handler: () => {
            alert.dismiss();
            this.router.navigate(['setting']);
          }
        },{
          text: this.translate.instant('message.cancel'),
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
  goToTutor(id){
    const navigationExtras: NavigationExtras = {
      queryParams: {
          page: '/home',
          id: id
      }
    };
    this.nav.navigateForward('/details/users',navigationExtras);
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
