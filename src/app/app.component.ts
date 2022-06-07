import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './service/storage/storage.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AlertController, MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { FetchService } from "./service/api/fetch.service"
import { EventService } from "./service/event.service"
import { App as CapacitorApp } from '@capacitor/app';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  
})
export class AppComponent {
  user:any;
  email:any;
  pushToken: any;
  subscriptions: any;
  constructor(public alertController: AlertController,private fetch:FetchService, private event:EventService, private platform:Platform,private router: Router,public menuCtrl: MenuController, private screenOrientation: ScreenOrientation, private storage : StorageService,private androidFullScreen: AndroidFullScreen,private statusBar: StatusBar) {
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
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        //let navigate to requested slot
        console.log(JSON.stringify(notification))
        let response = JSON.parse(JSON.stringify(notification)).data;
        this.alertMessage("New Request",response.userFullName +" has requested a session on "+ response.slotDate + " from : "+response.timeFrom+" to: "+ response.timeTo)
        //JSON.parse(JSON.stringify(notification)).notification.data.bookID
        
      }
    );
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    this.event.getObservable().subscribe((data) => {
      this.user = data;
    });

    await this.storage.init();
    const user = await this.storage.get("user");
     
    this.platform.ready().then((readySource) => {
      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
        }
      });
      
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
