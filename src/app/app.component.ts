import { Component,NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './service/storage/storage.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AlertController, MenuController,LoadingController, ModalController, NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { FetchService } from './service/api/fetch.service';
import { EventService } from './service/event.service';
import { App as CapacitorApp } from '@capacitor/app';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { UtilService } from './service/util.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],

})
export class AppComponent {
  user: any;
  email: any;
  pushToken: any;
  subscriptions: any;
  appV: any;
  hasUrl = false;
  constructor(public alertController: AlertController,private router: Router,public menuCtrl: MenuController,
    private screenOrientation: ScreenOrientation,private storage: StorageService,private statusBar: StatusBar,
    public loadingController: LoadingController,public modalController: ModalController, public util: UtilService,
    private nav: NavController) {
    //   this.androidFullScreen.isImmersiveModeSupported()
    // .then(() => console.log('Immersive mode supported'))
    // .catch(err => console.log(err));
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
    this.statusBar.overlaysWebView(false);
    this.statusBar.styleDefault();
    this.router.navigate(['splash']);
    // set status bar to white
    this.statusBar.backgroundColorByHexString('#031a70');
    CapacitorApp.addListener('backButton', async () => {
      const modal = await this.modalController.getTop() ? this.modalController.getTop() : null;
        if(this.router.url == '/session-list' || this.router.url == '/details/courses' ||
        this.router.url == '/details/session' || this.router.url == '/details/users' ||
        this.router.url == '/subscription' || this.router.url == '/track-request'  )
        {
          if(modal){
            this.modalController.dismiss()
            return
          }else{
            this.nav.back()
            return
          }
        }else if(this.router.url != '/home')
        {
          this.nav.back();
        }
    });
    this.startApp();
  }

  async startApp(){
    await this.storage.init();
    this.user = await this.storage.get('user');
  }
  async logout(){
    await this.storage.clear();
    this.router.navigate(['/welcome'], { replaceUrl: true });
  }
  goToFAQ(){
    this.router.navigate(['/faq']);
  }
  goToInviteFried(){
    this.router.navigate(['/invite-friend']);
  }
  goToPaymentHistory(){
    this.router.navigate(['/payment-history']);
  }
  goToTrackRequests(){
    this.router.navigate(['/track-request']);
  }
  goToToS(){
    window.open('https://policies.google.com/terms?hl=en-US', '_system');
  }
  goToSettings(){
    this.router.navigate(['/setting']);
    this.menuCtrl.close();
  }
}
