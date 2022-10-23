import { Component,NgZone, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AlertController, MenuController,LoadingController, ModalController, NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { App as CapacitorApp, StateChangeListener, URLOpenListenerEvent } from '@capacitor/app';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { ActionPerformed, PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { PaymentPage } from '../payment/payment.page';
import { FetchService } from '../service/api/fetch.service';
import { EventService } from '../service/event.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  user: any;
  email: any;
  pushToken: any;
  subscriptions: any;
  appV: any;
  hasUrl = false;
  lang: any;
  constructor(public alertController: AlertController,private fetch: FetchService, private event: EventService,
    private platform: Platform,private router: Router,public menuCtrl: MenuController, private screenOrientation: ScreenOrientation,
    private storage: StorageService,private androidFullScreen: AndroidFullScreen,private statusBar: StatusBar,
    public loadingController: LoadingController,public modalController: ModalController, private appVersion: AppVersion,
    private zone: NgZone,public util: UtilService,private nav: NavController,
    public translate: TranslateService,private globalization: Globalization) {
      setTimeout( () => { this.initializeApp(); }, 3500 );
  }

  ngOnInit() {
  }
  getQueryParams(params, url) {
    const reg = new RegExp('[?&]' + params + '=([^&#]*)', 'i');
    const queryString = reg.exec(url);
    return queryString ? queryString[1] : null;
  };

  async initializeApp() {
    await this.globalization.getPreferredLanguage().then(async (res) =>{
      const language = res.value.split('-');
      this.lang = language[0];
    });
    this.platform.ready().then(async (readySource) => {
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
      let user = await this.storage.get('user');
      //lets check if the user isnt deleted or inactive
      if(user)
      {
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
      }
      this.event.publishSomeData(user);
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
          this.alertMessage(this.translate.instant('message.newsessiontitle'),response.userFullName +
          this.translate.instant('message.newsessionbody',{slotDate: response.slotDate ,timeFrom:response.timeFrom})
          + response.timeTo,response.bookID);
        }else if(response.type == 'SESSIONCANCELLED'){
          LocalNotifications.schedule({
            notifications:[
            {
                title : this.translate.instant('message.sessioncancelled'),
                body: this.translate.instant('message.sessioncancelledmessage',{fullname:response.fullname,date:response.date}) ,
                largeBody : this.translate.instant('message.sessioncancelledmessage',{fullname:response.fullname,date:response.date}) ,
                id : this.generateRandomCode(),
                channelId: 'tutrain-default',
                group:'tutrainapp'
            }]
          });
        }else if(response.type == 'SESSIONRESPONSE')
        {
          let status = response.accpeted;
          if(this.lang === 'ar')
          {
            if(response.accpeted === 'Accepted')
            {
              status = 'تم موافقة';
            }else{
              status = 'تم رفض';
            }
          }
          LocalNotifications.schedule({
            notifications:[
            {
                title : this.translate.instant('message.sessionstatus',{statuss: status}) ,
                body: this.translate.instant('message.sessiionstatusbody',
                {fullname: response.userFullName,statuss: status,date:response.slotDate}),
                largeBody : this.translate.instant('message.sessiionstatusbody',
                {fullname: response.userFullName,statuss: status,date:response.slotDate}),
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
              this.alertMessageStudent(this.translate.instant('message.rejected'),response.userFullName+
              this.translate.instant('message.rejectedmessage'));
            }

          });
        }else if(response.type == 'NEWORDER'){
          const slotDate = new Date(new Date(response.slotDate).getTime() - (60000*30));
          LocalNotifications.schedule({
            notifications:[
            {
                title : this.translate.instant('message.neworder'),
                body: this.translate.instant('message.neworder',{fullname : response.userName}),
                largeBody : this.translate.instant('message.neworder',{fullname : response.userName}),
                id : this.generateRandomCode(),
                channelId: 'tutrain-default',
                group:'tutrainapp'
            },
            {
              title : this.translate.instant('message.sessionreminder'),
              body: this.translate.instant('message.sessionremindermessage',{fullname: response.userName}),
              largeBody : this.translate.instant('message.sessionremindermessage',{fullname: response.userName}),
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
                title : this.translate.instant('message.neworder'),
                body: this.translate.instant('message.newordermessage',{course: response.coursename}),
                largeBody : this.translate.instant('message.newordermessage',{course: response.coursename}),
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
              title : this.translate.instant('message.neworder'),
              body: this.translate.instant('message.newordermessage',{course: response.coursename}),
              largeBody : this.translate.instant('message.newordermessage',{course: response.coursename}),
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
          this.alertMessage(this.translate.instant('message.newsessiontitle'),response.userFullName +
          this.translate.instant('message.newsessionbody',{slotDate: response.slotDate ,timeFrom:response.timeFrom})
          + response.timeTo,response.bookID);
        }else if(response.type == 'SESSIONCANCELLED'){
          LocalNotifications.schedule({
            notifications:[
            {
                title : this.translate.instant('message.sessioncancelled'),
                body: this.translate.instant('message.sessioncancelledmessage',{fullname:response.fullname,date:response.date}) ,
                largeBody : this.translate.instant('message.sessioncancelledmessage',{fullname:response.fullname,date:response.date}) ,
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
              this.alertMessageStudent(this.translate.instant('message.rejected'),response.userFullName+this.translate.instant('message.rejected'));
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
                  header: this.translate.instant('messages.updated'),
                  message:  this.translate.instant('messages.bookingupdated'),
                  buttons: [this.translate.instant('messages.ok')]});
                await alertRes.present();
              }else{
                  alert.dismiss();
                  const alertRes = await this.alertController.create({
                    header: this.translate.instant('messages.error'),
                    message:  this.translate.instant('messages.errormessage'),
                    buttons: [this.translate.instant('messages.ok')]});
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
                  header: this.translate.instant('messages.updated'),
                  message:  this.translate.instant('messages.bookingupdated'),
                  buttons: [this.translate.instant('messages.ok')]});
                await alert.present();
              }else{
                  alert.dismiss();
                  const alertRes = await this.alertController.create({
                    header: this.translate.instant('messages.error'),
                    message:  this.translate.instant('messages.errormessage'),
                    buttons: [this.translate.instant('messages.ok')]});
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
