import { Component, OnInit,Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  @Input() course: any;
  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }
  dismissModal(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
