import { Component,NgZone } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { StorageService } from './service/storage/storage.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AlertController, MenuController,LoadingController, ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { FetchService } from './service/api/fetch.service';
import { EventService } from './service/event.service';
import { App as CapacitorApp, StateChangeListener, URLOpenListenerEvent } from '@capacitor/app';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { ActionPerformed, PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PaymentPage } from './payment/payment.page';
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
  constructor(public alertController: AlertController,private fetch: FetchService, private event: EventService,
    private platform: Platform,private router: Router,public menuCtrl: MenuController, private screenOrientation: ScreenOrientation,
    private storage: StorageService,private androidFullScreen: AndroidFullScreen,private statusBar: StatusBar,
    public loadingController: LoadingController,public modalController: ModalController, private appVersion: AppVersion,
    private zone: NgZone,public util: UtilService) {
  //   this.androidFullScreen.isImmersiveModeSupported()
  // .then(() => console.log('Immersive mode supported'))
  // .catch(err => console.log(err));
  this.statusBar.overlaysWebView(false);
  this.statusBar.styleDefault();
  // set status bar to white
  this.statusBar.backgroundColorByHexString('#ffffff');



    this.initializeApp();

   }

  getQueryParams(params, url) {
    const reg = new RegExp('[?&]' + params + '=([^&#]*)', 'i');
    const queryString = reg.exec(url);
    return queryString ? queryString[1] : null;
  };

  async initializeApp() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
    PushNotifications.createChannel({
      id: 'tutrain-default',
      name: 'tutrain-default',
      description:'tutrain-default',
      importance: 5,
      visibility: 1,
      lights:true,
      vibration: true
    });
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    this.event.getObservable().subscribe((data) => {
      this.user = data;
    });

    await this.storage.init();
    let user = await this.storage.get('user');
    //lets check if the user isnt deleted or inactive

    await this.fetch.getUserDetailByID(user.user_id).then(async (response) => {
      const checkUser = JSON.parse(response.data).response[0];
      this.storage.clear();
      await this.storage.set('user',checkUser);
      if(checkUser.is_active == 0)
      {
        user = null;
        this.storage.clear();
      }
    }).catch((error) => {
    });
    this.platform.ready().then(async (readySource) => {
      CapacitorApp.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        this.zone.run(() => {
          this.hasUrl = true;
          // Example url: https://beerswift.app/tabs/tab2
          // slug = /tabs/tab2
          const slug = event.url.split('?')[0];
          if (slug == 'https://tapp.scd.edu.om/referral/') {
            if (user) {
              this.router.navigate(['home']);
              this.user = user;
              this.menuCtrl.enable(true);

            } else {
              const param = this.getQueryParams('ref',event.url);
              const navigationExtras: NavigationExtras = {
                state: {
                  refCode: param
                }
              };
              this.menuCtrl.enable(false);
              this.router.navigate(['register'],navigationExtras);
            }
          }else if(slug == 'https://tapp.scd.edu.om/openlogin/')
          {
            if (user) {
              this.router.navigate(['home']);
              this.user = user;
              this.menuCtrl.enable(true);

            } else {
              this.menuCtrl.enable(false);
              this.router.navigate(['login']);
            }

          }else{
            if (user) {
              this.router.navigate(['home']);
              this.user = user;
              this.menuCtrl.enable(true);
            } else {
              this.menuCtrl.enable(false);
              this.router.navigate(['welcome']);
            }
          }
          // If no match, do nothing - let regular routing
          // logic take over
        });
      });

      this.appV = await this.appVersion.getAppName()  + ' ' + await this.appVersion.getVersionNumber();
      PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        //let navigate to requested slot
        const response = JSON.parse(JSON.stringify(notification)).data;
        LocalNotifications.createChannel({
          id: 'tutrain-default',
          name: 'tutrain-default',
          description:'tutrain-default',
          importance: 5,
          visibility: 1,
          lights:true,
          vibration: true
        });
        if(response.type == 'NEWSESSION')
        {
          this.alertMessage('New Request',response.userFullName +' has requested a session on '
          + response.slotDate + ' from : '+response.timeFrom+' to: '+ response.timeTo,response.bookID);
        }else if(response.type == 'SESSIONCANCELLED'){
          LocalNotifications.schedule({
            notifications:[
            {
                title : 'Session Cancelled',
                body: JSON.parse(JSON.stringify(notification)).body,
                largeBody : JSON.parse(JSON.stringify(notification)).body,
                id : this.generateRandomCode(),
                channelId: 'tutrain-default',
                group:'tutrainapp'
            }]
          });
        }else if(response.type == 'SESSIONRESPONSE')
        {
          LocalNotifications.schedule({
            notifications:[
            {
                title : 'Session '+response.accpeted,
                body: JSON.parse(JSON.stringify(notification)).body,
                largeBody : JSON.parse(JSON.stringify(notification)).body,
                id : this.generateRandomCode(),
                channelId: 'tutrain-default',
                group:'tutrainapp'
            }]
          });
          LocalNotifications.addListener('localNotificationActionPerformed', async (notifications) => {
            if(response.accpeted == 'Accepted')
            {
              let tutorD;
              await this.fetch.getUserDetailByID(response.tutorDetails).then(async (response) => {
                tutorD = JSON.parse(response.data).response[0];
              }).catch((error) => {
              });
              const modal = await this.modalController.create({
                component: PaymentPage,
                cssClass: 'my-custom-class',
                swipeToClose: true,
                componentProps: {
                  tutor:tutorD,
                  durationSelect:response.duration,
                  dateSelected:response.slotDate,
                  timeFromSelected:response.timeFrom,
                  timeToSelected:response.timeTo,
                  bookID: response.bookID
                }
              });
              await modal.present();
            }else if(response.type == 'NEWORDER'){
              this.router.navigate(['/track-request']);
            }else{
              this.alertMessageStudent('Rejected',response.userFullName+' has rejected your request');
            }

          });
        }else if(response.type == 'NEWORDER'){
          const slotDate = new Date(new Date(response.slotDate).getTime() - (60000*30));
          LocalNotifications.schedule({
            notifications:[
            {
                title : 'New Order',
                body: JSON.parse(JSON.stringify(notification)).body,
                largeBody : JSON.parse(JSON.stringify(notification)).body,
                id : this.generateRandomCode(),
                channelId: 'tutrain-default',
                group:'tutrainapp'
            },
            {
              title : 'Session Reminder',
              body: 'You have a session with '+response.userName+' in 30 min',
              largeBody : 'You have a session with '+response.userName+' in 30 min',
              id : this.generateRandomCode(),
              schedule: {
                  at: slotDate,
                  allowWhileIdle: true,
                  repeats: false,
              },
              channelId: 'tutrain-default',
              group:'tutrainapp'
          }]
          });
        }else if(response.type == 'NEWORDERSESSION'){
          const slotDate = new Date(new Date(response.slotDate).getTime() - (60000*30));
          LocalNotifications.schedule({
            notifications:[
            {
                title : 'New Order',
                body: JSON.parse(JSON.stringify(notification)).body,
                largeBody : JSON.parse(JSON.stringify(notification)).body,
                id : this.generateRandomCode(),
                channelId: 'tutrain-default',
                group:'tutrainapp'
            }]
          });
        }else if(response.type == 'COURSEBOUGHT')
        {
          LocalNotifications.schedule({
            notifications:[
            {
              title : 'New Order',
              body: JSON.parse(JSON.stringify(notification)).body,
              largeBody : JSON.parse(JSON.stringify(notification)).body,
              id : this.generateRandomCode(),
              channelId: 'tutrain-default',
              group:'tutrainapp'
            }]
          });
        }
        //JSON.parse(JSON.stringify(notification)).notification.data.bookID

      }
    );
    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        //let navigate to requested slot
        const response = JSON.parse(JSON.stringify(notification)).notification.data;
        if(response.type == 'NEWSESSION')
        {
          this.alertMessage('New Request',response.userFullName +' has requested a session on '
          + response.slotDate + ' from : '+response.timeFrom+' to: '+ response.timeTo,response.bookID);
        }else if(response.type == 'SESSIONCANCELLED'){
          LocalNotifications.schedule({
            notifications:[
            {
                title : 'Session Cancelled',
                body: JSON.parse(JSON.stringify(notification)).body,
                largeBody : JSON.parse(JSON.stringify(notification)).body,
                id : this.generateRandomCode(),
                channelId: 'tutrain-default',
                group:'tutrainapp'
            }]
          });
        }else if(response.type == 'SESSIONRESPONSE')
        {
          if(response.accpeted == 'Accepted')
            {
              let tutorD;
              await this.fetch.getUserDetailByID(response.tutorDetails).then(async (responsee) => {
                tutorD = JSON.parse(responsee.data).response[0];
              }).catch((error) => {
              });
              const modal = await this.modalController.create({
                component: PaymentPage,
                cssClass: 'my-custom-class',
                swipeToClose: true,
                componentProps: {
                  tutor:tutorD,
                  durationSelect:response.duration,
                  dateSelected:response.slotDate,
                  timeFromSelected:response.timeFrom,
                  timeToSelected:response.timeTo,
                  bookID: response.bookID
                }
              });
              await modal.present();
            }else{
              this.alertMessageStudent('Rejected',response.userFullName+' has rejected your request');
            }
        }else if(response.type == 'NEWORDER'){
          this.router.navigate(['/track-request']);
        }
        //JSON.parse(JSON.stringify(notification)).notification.data.bookID
      }
    );
      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
        }
      });

      if(this.hasUrl === false)
      {
        if (user) {
          this.router.navigate(['home']);
          this.user = user;
          this.menuCtrl.enable(true);

        } else {
          this.menuCtrl.enable(false);
          this.router.navigate(['welcome']);
        }
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
  async alertMessageStudent(header,message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']});
      await alert.present();
  }
  generateRandomCode(){
    return Math.floor(Math.random() * 10000) + 1;
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
              if(json.status == 'updated')
              {
                alert.dismiss();
                const alertRes = await this.alertController.create({
                  header: 'Updated',
                  message:  'Booking has been updated',
                  buttons: ['OK']});
                await alertRes.present();
              }else{
                  alert.dismiss();
                  const alertRes = await this.alertController.create({
                    header: 'Error',
                    message:  'An Error happened while updated try again later.',
                    buttons: ['OK']});
                  await alertRes.present();
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
              if(json.status == 'updated')
              {
                alert.dismiss();
                const alertRes = await this.alertController.create({
                  header: 'Updated',
                  message:  'Booking has been updated',
                  buttons: ['OK']});
                await alert.present();
              }else{
                  alert.dismiss();
                  const alertRes = await this.alertController.create({
                    header: 'Error',
                    message:  'An Error happened while updated try again later.',
                    buttons: ['OK']});
                  await alertRes.present();
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
