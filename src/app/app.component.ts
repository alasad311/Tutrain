import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './service/storage/storage.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AlertController, MenuController,LoadingController, ModalController, NavController } from '@ionic/angular';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { UtilService } from './service/util.service';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from './service/event.service';
import { Platform } from '@ionic/angular';
import { DOCUMENT } from '@angular/common';

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
  lang: any;
  constructor(public alertController: AlertController,private router: Router,public menuCtrl: MenuController,
    private screenOrientation: ScreenOrientation,private storage: StorageService,private statusBar: StatusBar,
    public loadingController: LoadingController,public modalController: ModalController, public util: UtilService,
    private nav: NavController,private appVersion: AppVersion,private globalization: Globalization,private event: EventService,
    private translate: TranslateService,private platform: Platform, @Inject(DOCUMENT) private document: Document) {
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
    this.event.getObservable().subscribe((data) => {
      this.user = data;
    });
    await this.globalization.getPreferredLanguage().then(async (res) =>{
      const language = res.value.split('-');
      this.translate.setDefaultLang(language[0]);
      this.translate.use(language[0]);
      this.lang = language[0];
      const htmlTag = this.document.getElementsByTagName('html')[0] as HTMLHtmlElement;
      htmlTag.dir = language[0] === 'ar' ? 'rtl' : 'ltr';
    });

    this.user = await this.storage.get('user');
    this.appV = await this.appVersion.getAppName()  + ' ' + await this.appVersion.getVersionNumber();

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
    window.open('https://tutrainapp.com/privacy.html', '_system');
  }
  goToSettings(){
    this.router.navigate(['/setting']);
    this.menuCtrl.close();
  }
}
