import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-order-rating',
  templateUrl: './order-rating.page.html',
  styleUrls: ['./order-rating.page.scss'],
})
export class OrderRatingPage implements OnInit {
  @Input() orderNumber: any;
  value = false;
  constructor(public modalController: ModalController,private util: UtilService) { }

  ngOnInit() {
  }
  goBackHome(){
    this.modalController.dismiss({value: this.value});
  }
  ionViewDidEnter() {
    this.util.refreshUserData();
  }
  ionViewDidLeave() {
    this.util.refreshUserData();
  }
}
