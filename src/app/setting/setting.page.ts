import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';
import { NativeSettings,AndroidSettings,IOSSettings } from 'capacitor-native-settings';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  contest: any;
  contestBadge: any;
  user: any;
  wallet: any;
  tutor = false;
  isDisablied = false;
  popOutNotification;
  notSystem = 0;
  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService,
    public alertController: AlertController,public loadingController: LoadingController,public util: UtilService,
    private router: Router,public translate: TranslateService) { }

  async ngOnInit() {
    this.user = await this.storage.get('user');
    let permStatus = await LocalNotifications.checkPermissions();

    if(await permStatus.display !== 'granted')
    {
      this.popOutNotification = false;
    }else{
      this.popOutNotification = true;
    }
    this.fetch.getTotalUnPaid(this.user.user_id).then(async (response) => {
      const json = JSON.parse(response.data);
      this.wallet = json.response[0].TotalW;
    }).catch((error) => {
    });
    if(this.user.type == "student")
    {
      this.tutor = false;
    }else{
      this.tutor = true;
    }
  }

  goBackHome(){
    this.navCtrl.back();
  }
  payoutRequest(){
    this.isDisablied = true;
    if(this.wallet > 0)
    {
      this.alertMessageWithBtn(this.translate.instant('message.payout'),this.translate.instant('message.payoutareyoursure'));
    }else
    {
      this.alertMessageWithoutBtn(this.translate.instant('message.payout'),this.translate.instant('message.payouterror'));
      this.isDisablied = false;
    }

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
    this.user = await this.storage.get('user');
    
    if(this.user.type == "student")
    {
      this.tutor = false;
    }else{
      this.tutor = true;
    }
   
  }
  ionViewDidLeave() {
    this.util.refreshUserData();
  }
  goToContactUs(){
    this.router.navigate(['/contact-us']);
  }
  goToTutorProfile(){
    this.router.navigate(['/tutor-profle']);
  }
  goToSession(){
    this.router.navigate(['/session-list']);
  }
  goToCourses(){
    this.router.navigate(['/course-list']);
  }
  editProfile(){
    this.router.navigate(['/edit-profile']);
  }
  changePassword(){
    this.router.navigate(['/change-password']);
  }
  onNotificationOptionChange(event){
    if(this.popOutNotification !== event.detail.checked)
    {
      NativeSettings.open({
        optionAndroid: AndroidSettings.AppNotification, 
        optionIOS: IOSSettings.Notifications
      })
    }
  }
  async deleteAccount(){
    this.alertMessageWithBtnDelete(this.translate.instant('message.deleteaccount'),this.translate.instant('message.areyousure'))
  }
  async alertMessageWithoutBtn(header,message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: [this.translate.instant('message.ok')]
    });

    await alert.present();
  }
  async addRequestofPayout(){
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: this.translate.instant('message.pleasewait')
    });
    await loading.present();
    this.fetch.requestPayout({user_id: this.user.user_id,amount : this.wallet}).then(async (response) => {
      const json = JSON.parse(response.data).response;
      if(json.id)
      {
        this.fetch.getTotalUnPaid(this.user.user_id).then(async (response) => {
          const json = JSON.parse(response.data);
          this.wallet = json.response[0].TotalW;
          await loading.dismiss();
          const alertRes = await this.alertController.create({
            header: this.translate.instant('message.requested'),
            message:  this.translate.instant('message.requestedmessage'),
            buttons: [this.translate.instant('message.ok')]});
          await alertRes.present();
          this.isDisablied = false;
        }).catch((error) => {
        });
       
      }
    });
  }
  async alertMessageWithBtn(header,message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: [
        {
          text: this.translate.instant('message.ok'),
          id: 'confirm-button',
          handler: () => {
            alert.dismiss();
            this.addRequestofPayout();
          }
        },{
          text: this.translate.instant('message.cancel'),
          id: 'cancel-button',
          handler: () => {
            alert.dismiss();
            this.isDisablied = false;
          }
        }
      ]
    });

    await alert.present();
  }
  async removeAccount(){
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: this.translate.instant('message.pleasewait')
    });
    await loading.present();
    this.fetch.deleteUser(this.user.user_id).then(async (response) => {
      const json = JSON.parse(response.data);
      await loading.dismiss();
      
      if(json.response.results == "success")
      {
        this.storage.clear();
        const alertRes = await this.alertController.create({
          header: this.translate.instant('message.deletion'),
          message:  this.translate.instant('message.deletionsuccess'),
          buttons: [
            {
              text: this.translate.instant('message.ok'),
              cssClass:'test',
              handler: () => {
                this.router.navigate(['/login']);
              }
            }
          ]
        });
        await alertRes.present();
       
      }
    }).catch((error) => {
    });
  }
  async alertMessageWithBtnDelete(header,message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: [
        {
          text: this.translate.instant('message.ok'),
          id: 'confirm-button',
          handler: () => {
            alert.dismiss();
            this.removeAccount();
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
}

