import { Component, OnInit,Input } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AlertController, ModalController,LoadingController  } from '@ionic/angular';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  @Input() course: any;
  @Input() tutor: any;
  @Input() durationSelect: any;
  @Input() dateSelected: any;
  @Input() timeFromSelected: any;
  @Input() timeToSelected: any;
  @Input() bookID: any;


  paymentMethod = 'online';
  dateFormatted: any;
  serviceFees = 2;
  isDisablied = false;
  tuturHourCost;
  paymentType = true;
  constructor(private iab: InAppBrowser,public alertController: AlertController,public modalController: ModalController,
    private storage: StorageService, public fetchServices: FetchService,public loadingController: LoadingController) { }

  ngOnInit() {
    if(this.dateSelected)
    {
      this.tuturHourCost  = this.tutor.hour_price;
      const date = new Date(this.dateSelected);
      this.dateFormatted = date.getDate().toString().padStart(2, '0') + '/' +
      (1 + date.getMonth()).toString().padStart(2, '0') + '/' + date.getFullYear();
    }
  }

  dismissModal(data){
    this.modalController.dismiss(data);
  }
  onCheckout(){
    this.isDisablied = true;
    const browser = this.iab.create(
      'https://payments.eduwinapp.com/nbo/index.php?orderid=1&amount=0.1&merchant_reference=100&remark=test&language=en&email=test@test.om',
      '_blank',{ location: 'no',zoom: 'no'});
    browser.on('exit').subscribe(event => { this.checkPayment(true); });
  }
  onTutorCheckout(){
    this.isDisablied = true;
    const browser = this.iab.create(
    'https://payments.eduwinapp.com/nbo/index.php?orderid=1&amount=0.1&merchant_reference=100&remark=test&language=en&email=test@test.om',
    '_blank',{ location: 'no',zoom: 'no'});
    browser.on('exit').subscribe(event => { this.checkTutorPayment(true); });
  }
  async checkTutorPayment(event)
  {
    if(event)
    {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Please wait...'
      });
      await loading.present();
      const user = await this.storage.get('user');
      const data = {
        paid_amount: (this.tuturHourCost * this.durationSelect )+this.serviceFees,
        course_id : null,
        user_id : user.user_id,
        tutor_id: this.tutor.user_id,
        is_online:this.paymentType,
        book_id: this.bookID
      };
      this.fetchServices.updateOrder(data).then(async (response) => {
        const json = JSON.parse(response.data).response;
        await loading.dismiss();
        if(json.id){
          this.alertMessage('Payment','You have paid '+ ((this.tuturHourCost * this.durationSelect )+this.serviceFees).toFixed(3));
        }

      }).catch((error) => {
        this.isDisablied = false;
        alert(error);
      });
    }else{
      this.isDisablied = false;
    }
  }
  async checkPayment(event)
  {

    if(event)
    {
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Please wait...'
      });
      await loading.present();
      const user = await this.storage.get('user');
      const data = {
        paid_amount: this.course.price+2,
        course_id : this.course.id,
        user_id : user.user_id,
        tutor_id: null,
        is_online:this.paymentType,
        book_id: null
      };
      this.fetchServices.updateOrder(data).then(async (response) => {
        const json = JSON.parse(response.data).response;
        await loading.dismiss();
        if(json.id){
          this.alertMessage('Payment','You have paid '+ (this.course.price+2).toFixed(3) );
        }

      }).catch((error) => {
        this.isDisablied = false;
        alert(error);
      });
    }else{
      this.isDisablied = false;
    }

    //Preparing ahead



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
  setServiceFees(event){
    if(event.target.value !== 'online')
    {
      this.serviceFees = 0;
      this.tuturHourCost = 0;
      this.paymentType = false;
    }else{
      this.serviceFees = 2;
      this.tuturHourCost = this.tutor.hour_price;
      this.paymentType = true;
    }
  }
  async directFeesPayment(){
    this.isDisablied = true;
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...'
    });
    await loading.present();
    const user = await this.storage.get('user');
    const data = {
      paid_amount: (this.tuturHourCost * this.durationSelect )+this.serviceFees,
      course_id : null,
      user_id : user.user_id,
      tutor_id: this.tutor.user_id,
      is_online:this.paymentType,
      book_id: this.bookID
    };
    this.fetchServices.updateOrder(data).then(async (response) => {
      const json = JSON.parse(response.data).response;
      await loading.dismiss();
      if(json.id){
        this.alertMessage('Payment','Your order has been placed make sure to pay the tutor directly on completetion of the session');
      }

    }).catch((error) => {
      this.isDisablied = false;
      alert(error);
    });
  }
  onCheckOutTutor(){
    if(this.paymentMethod == 'online')
    {
      this.onTutorCheckout();
    }else{
      this.directFeesPayment();
    }
  }
  async alertMessage(header,message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header,
      message,
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