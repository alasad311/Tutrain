import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './service/storage/storage.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AlertController, MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { FetchService } from './service/api/fetch.service';
import { EventService } from './service/event.service';
import { App as CapacitorApp } from '@capacitor/app';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { ActionPerformed, PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { LocalNotifications, LocalNotificationActionPerformed } from '@capacitor/local-notifications';

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
  constructor(public alertController: AlertController,private fetch: FetchService, private event: EventService,
    private platform: Platform,private router: Router,public menuCtrl: MenuController, private screenOrientation: ScreenOrientation,
    private storage: StorageService,private androidFullScreen: AndroidFullScreen,private statusBar: StatusBar,) {
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
        console.log(JSON.stringify(notification));
        const response = JSON.parse(JSON.stringify(notification)).data;
        if(response.type == 'NEWSESSION')
        {
          this.alertMessage('New Request',response.userFullName +' has requested a session on '
          + response.slotDate + ' from : '+response.timeFrom+' to: '+ response.timeTo,response.bookID);
        }else if(response.type == 'SESSIONRESPONSE')
        {
          const randomId = Math.floor(Math.random() * 10000) + 1;
          LocalNotifications.schedule({
            notifications:[
            {
                title : 'Session '+response.accpeted,
                body : JSON.parse(JSON.stringify(notification)).body,
                id : randomId,
                attachments: null,
                extra:{
                  bookID: response.bookID
                },
                actionTypeId:'STD_RES'
            }]
          });
          LocalNotifications.registerActionTypes({
            types:[
              {
                id: 'STD_RES',
                actions:[
                  {
                    id: 'payment',
                    title: 'Make Payment',
                  },
                  {
                    id:'cancel',
                    title:'Cancel Request',
                  }
                ]
              }
            ]
          });
          LocalNotifications.addListener('localNotificationActionPerformed', (notifications) => {
            alert(`Performed: ${notifications.actionId} Input value:${notifications.notification.extra.bookID}`);
            console.log(notification.id);
          });
        }
        //JSON.parse(JSON.stringify(notification)).notification.data.bookID

      }
    );
    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        //let navigate to requested slot
        const response = JSON.parse(JSON.stringify(notification)).notification.data;
        if(response.type == 'NEWSESSION')
        {
          this.alertMessage('New Request',response.userFullName +' has requested a session on '
          + response.slotDate + ' from : '+response.timeFrom+' to: '+ response.timeTo,response.bookID);
        }else if(response.type == 'SESSIONRESPONSE')
        {
          this.router.navigate(['payment']);
        }
        //JSON.parse(JSON.stringify(notification)).notification.data.bookID
      }
    );
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    this.event.getObservable().subscribe((data) => {
      this.user = data;
    });

    await this.storage.init();
    const user = await this.storage.get('user');
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
  // set userDetails(user){
  //   this.user = user;
  // }
  // get userEmail(){
  //   return this.email
  // }
  async logout(){
    await this.storage.clear();
    this.router.navigate(['/welcome']);
  }
  async alertMessage(header,message,id) {
    const alert = await this.alertController.create({
      header,
      message,
      backdropDismiss:false,
      buttons: [
        {
          text: 'Accept',
          cssClass:'test',
          handler: () => {
            //Update DB and Send notification
            this.fetch.updateBooking({is_accpeted: true,bookid : id}).then(async (response) => {
              const json = JSON.parse(response.data).response;
              if(json.status === 'updated')
              {
                alert.dismiss();
                const alertRes = await this.alertController.create({
                  header: 'Updated',
                  message:  'Booking has been updated',
                  buttons: ['OK']});
                await alert.present();
              }else{
                if(json.status === 'updated')
                {
                  alert.dismiss();
                  const alertRes = await this.alertController.create({
                    header: 'Error',
                    message:  'An Error happened while updated try again later.',
                    buttons: ['OK']});
                  await alert.present();
                }
              }
            }).catch((error) => {
            });
          }
        },
        {
          text: 'Reject',
          cssClass:'test',
          handler: () => {
            //Update DB and Send notification
            this.fetch.updateBooking({is_accpeted: false,bookid : id}).then(async (response) => {
              const json = JSON.parse(response.data).response;
              if(json.status === 'updated')
              {
                alert.dismiss();
                const alertRes = await this.alertController.create({
                  header: 'Updated',
                  message:  'Booking has been updated',
                  buttons: ['OK']});
                await alert.present();
              }else{
                if(json.status === 'updated')
                {
                  alert.dismiss();
                  const alertRes = await this.alertController.create({
                    header: 'Error',
                    message:  'An Error happened while updated try again later.',
                    buttons: ['OK']});
                  await alert.present();
                }
              }
            }).catch((error) => {
            });

          }
        },
        {
          text: 'Later',
          cssClass:'test',
          handler: () => {
           alert.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }
}
