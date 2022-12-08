import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PaymentPage } from '../payment/payment.page';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {
  subs: any;
  lang: any;
  constructor(private navCtrl: NavController,public util: UtilService,private storage: StorageService,
    private fetch: FetchService,public modalController: ModalController,public loadingController: LoadingController,
    private globalization: Globalization,public translate: TranslateService
    ) { }

  async ngOnInit() {
   this.fetch.getSubscriptions().then((response) => {
    this.subs = JSON.parse(response.data).response;
  });
  await this.globalization.getPreferredLanguage().then(async (res) =>{
    const language = res.value.split('-');
    this.lang = language[0];
  });
  }
  ionViewDidEnter() {
    this.util.refreshUserData();
  }
  ionViewDidLeave() {
    this.util.refreshUserData();
  }
  goBackHome(){
    this.navCtrl.back();
  }
  async makePayment(item:any)
  {
    const modal = await this.modalController.create({
      component: PaymentPage,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      componentProps: {
        subscription: item
      }
    });
    await modal.present();
    modal.onDidDismiss()
    .then(async (data) => {
      if(data)
      {
        const loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: this.translate.instant('messages.pleasewait')
        });
        await loading.present();
        let user = await this.storage.get('user');
        await this.fetch.getUserDetailByID(user.user_id).then(async (response) => {
          const checkUser = JSON.parse(response.data).response[0];
          this.storage.clear();
          await this.storage.set('user',checkUser);
          await loading.dismiss();

          this.navCtrl.navigateForward('/contest',{replaceUrl: true});
        }).catch((error) => {
        });
        
      }
    });
  }
}
