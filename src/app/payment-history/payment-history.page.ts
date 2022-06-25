import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { OrderRatingPage } from '../order-rating/order-rating.page';
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
    ,private util: UtilService,public loadingController: LoadingController, public modalController: ModalController) { }
  
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
  async rate(id,ordernumber)
  {
     //lets add the order to the DB
     const modal = await this.modalController.create({
      component: OrderRatingPage,
      initialBreakpoint: 0.7,
      breakpoints: [0, 0.7, 1],
      presentingElement: await this.modalController.getTop(),
      componentProps: {
        orderNumber: ordernumber,
      }
    });
    modal.onDidDismiss()
    .then(async (data) => {
      if(data.data.value)
      {
        const loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Please wait...'
        });
        await loading.present();
        const datas = {
          user_id: this.user.user_id,
          order_id : id,
          value: data.data.value
        };
        alert(this.user.user_id+ " "+ id + " "+ data.data.value);
        // this.fetch.addRating(datas).then(async (response) => {
        //   const json = JSON.parse(response.data).response;
        //   if(json.id){
        //     await loading.dismiss();
        //     this.alertMessage("Booking","Your request is under review by "+ this.user.fullname);
        //   }else if(json.results === "duplicate"){
        //     await loading.dismiss();
        //     this.alertMessage("Duplicate","You have already requested and its under review.");
        //   }else{
        //     await loading.dismiss();
        //     this.alertMessage("Error","Couldn't fullfill your request at the moment please try again later");
        //   }
        // });
      }
    });
    await modal.present();
  }
}
