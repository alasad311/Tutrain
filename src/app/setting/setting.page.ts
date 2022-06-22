import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  user: any;
  wallet: any;
  tutor = false;
  isDisablied = false;
  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService,
    public alertController: AlertController,public loadingController: LoadingController,private util: UtilService) { }

  async ngOnInit() {
    this.user = await this.storage.get('user');
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
      this.alertMessageWithBtn("Payout Request","Are you sure?, bare in mind this process could take upto 7 working days")
    }else
    {
      this.alertMessageWithoutBtn("Payout Request","Your balance does fulfill the minimum requirement")
      this.isDisablied = false;
    }

  }
  ionViewDidEnter() {
    this.util.refreshUserData();
  }
  ionViewDidLeave() {
    this.util.refreshUserData();
  }
  async alertMessageWithoutBtn(header,message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
  async addRequestofPayout(){
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...'
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
            header: 'Requested',
            message:  'Requested has been place and under review by our financial department',
            buttons: ['OK']});
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
          text: 'ok',
          id: 'confirm-button',
          handler: () => {
            alert.dismiss();
            this.addRequestofPayout();
          }
        },{
          text: 'Cancel',
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
}

