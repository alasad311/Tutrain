import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.page.html',
  styleUrls: ['./payment-history.page.scss'],
})
export class PaymentHistoryPage implements OnInit {
  orders: any;
  showNull = false;
  page = 0;
  user: any;
  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService
    ,private util: UtilService,public loadingController: LoadingController, public modalController: ModalController
    ,public alertController: AlertController) { }
  
  async ngOnInit() {
    this.user = await this.storage.get('user');
    this.fetch.getUserOrders(this.user.user_id,this.page).then(async (response) => {
      this.orders = JSON.parse(response.data).response;
      if(this.orders.length == 0)
      {
        this.showNull = true;
      }
    });
  }
  ionViewDidEnter() {
    this.util.refreshUserData();
  }
  ionViewDidLeave() {
    this.util.refreshUserData();
  }
  getActualDate(date)
  {
    const newdate = new Date(date);
      return newdate.getDate().toString().padStart(2, '0') + '/' +
      (1 + newdate.getMonth()).toString().padStart(2, '0') + '/' + newdate.getFullYear();
  }
  goBackHome(){
    this.navCtrl.back();
  }
  doInfinite(event) {
    setTimeout(() => {
      this.page = this.page + 1;
      this.fetch.getUserOrders(this.user.user_id,this.page).then((response) => {
        var json = JSON.parse(response.data);
        for (let i = 0; i < json.response.length; i++) {
          this.orders.push(json.response[i])
        }
        if(json.response.length == 0)
          event.target.disabled = true;
        event.target.complete();
      }).catch((error) => {
        
      });
    }, 2000);
  }
  async resolveRec(value,id, ordernumber)
  {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...'
    });
    await loading.present();
    const datas = {
      user_id: this.user.user_id,
      order_id : id,
      value: value
    };
    this.fetch.addRating(datas).then(async (response) => {
      const json = JSON.parse(response.data).response;
      if(json.id){
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: "Rated",
          message: "you rated has been added to "+ordernumber+" successfully",
          buttons: ["OK"]
        });
        this.orders = null;
        this.fetch.getUserOrders(this.user.user_id,this.page).then(async (response) => {
          this.orders = JSON.parse(response.data).response;
          if(this.orders.length == 0)
          {
            this.showNull = true;
          }
        });
        await alert.present();
      }
    });
  }
  async rate(id,ordernumber)
  {
    const alert = await this.alertController.create({
      cssClass: 'alertstar',
      header: "Rate order "+ordernumber,
      buttons: [
        { text: '1',  cssClass:'letstest', handler: data => { this.resolveRec(1,id,ordernumber);}},
        { text: '2',  cssClass:'letstest', handler: data => { this.resolveRec(2,id,ordernumber);}},
        { text: '3',  cssClass:'letstest', handler: data => { this.resolveRec(3,id,ordernumber);}},
        { text: '4',  cssClass:'letstest', handler: data => { this.resolveRec(4,id,ordernumber);}},
        { text: '5',  cssClass:'letstest', handler: data => { this.resolveRec(5,id,ordernumber);}}
      ]
    });

    await alert.present();

  }
}
