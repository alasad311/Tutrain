import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';

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
  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService) { }
  goBackHome(){
    this.navCtrl.back();
  }
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
  getActualDate(date)
  {
    const newdate = new Date(date);
      return newdate.getDate().toString().padStart(2, '0') + '/' +
      (1 + newdate.getMonth()).toString().padStart(2, '0') + '/' + newdate.getFullYear();
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

}
