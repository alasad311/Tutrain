import { Component, OnInit,Input } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  @Input() course: any;
  constructor(private iab: InAppBrowser,public alertController: AlertController,public modalController: ModalController) { }

  ngOnInit() {
  }
  dismissModal(data){
    this.modalController.dismiss(data);
  }
  onCheckout(){
    const browser = this.iab.create('https://payments.eduwinapp.com/nbo/index.php?orderid=1&amount=0.1&merchant_reference=100&remark=test&language=en&email=test@test.om','_blank',{ location: 'no',zoom: 'no'});
    browser.on('exit').subscribe(event => { this.checkPayment("closed!"); })
  }
  checkPayment(event)
  {
    this.alertMessage("Payment","You have paid "+ (this.course.price+2).toFixed(3))
    
    // browser.executeScript({
    //   code: "document.getElementById('customBackbtn').onclick = function() {\
    //   var message = 'close';\
    //   var messageObj = {message: message};\
    //   var stringifiedMessageObj = JSON.stringify(messageObj);\
    //   webkit.messageHandlers.cordova_iab.postMessage('stringifiedMessageObj');\
    //   }"});
    // browser.on('message').subscribe((val)=>{
    //   const postObject:any = val;
      
    //   //Do whatever you want to with postObject response from inappbrowser
      
    //   });
  }
  async alertMessage(header,message) {
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
            this.dismissModal({
              dismissed : true
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
