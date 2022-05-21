import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './service/storage/storage.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { FetchService } from "./service/api/fetch.service"
import { EventService } from "./service/event.service"
import { App as CapacitorApp } from '@capacitor/app';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  
})
export class AppComponent {
  user:any;
  email:any;
  subscriptions: any;

  constructor( private fetch:FetchService, private event:EventService, private platform:Platform,private router: Router,public menuCtrl: MenuController, private screenOrientation: ScreenOrientation, private storage : StorageService,private androidFullScreen: AndroidFullScreen,private statusBar: StatusBar) {
  //   this.androidFullScreen.isImmersiveModeSupported()
  // .then(() => console.log('Immersive mode supported'))
  // .catch(err => console.log(err));
  this.statusBar.overlaysWebView(false);
  this.statusBar.styleDefault();
  // set status bar to white
  this.statusBar.backgroundColorByHexString('#ffffff');


    this.initializeApp();
    this.test2();
   }
   async test2(): Promise<void> {
    await this.platform.ready();
    CapacitorApp.addListener('backButton', ({canGoBack}) => {
     
    });
  }

  async initializeApp() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    this.event.getObservable().subscribe((data) => {
      this.user = data;
    });

    await this.storage.init();
    const user = await this.storage.get("user");
     
    this.platform.ready().then((readySource) => {
      
      if (user) {
        this.router.navigate(['home']);
        this.user = user;
        this.menuCtrl.enable(true);

      } else {
        this.menuCtrl.enable(false);
        this.router.navigate(['welcome']);
      }
    });
  }
  set userDetails(user){
    this.user = user;
  }
  get userEmail(){
    return this.email
  }
  async logout(){
    await this.storage.clear()
    this.router.navigate(['/welcome']);
  }
}
