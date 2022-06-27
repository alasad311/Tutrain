import { Component, OnInit,Input } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AlertController, ModalController,LoadingController  } from '@ionic/angular';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  @Input() course: any;
  @Input() tutor: any;
  @Input() session: any;
  @Input() durationSelect: any;
  @Input() dateSelected: any;
  @Input() timeFromSelected: any;
  @Input() timeToSelected: any;
  @Input() bookID: any;
  contest: any;
  contestBadge: any;
  serviceFees: any;
  paymentMethod = 'online';
  dateFormatted: any;
  isDisablied = false;
  tuturHourCost;
  service = 0;
  paymentType = true;
  constructor(private iab: InAppBrowser,public alertController: AlertController,public modalController: ModalController,
    private storage: StorageService, public fetchServices: FetchService,public loadingController: LoadingController
    ,public util: UtilService) { }

  ngOnInit() {
    if(this.dateSelected)
    {
      this.tuturHourCost  = this.tutor.hour_price;
      const date = new Date(this.dateSelected);
      this.dateFormatted = date.getDate().toString().padStart(2, '0') + '/' +
      (1 + date.getMonth()).toString().padStart(2, '0') + '/' + date.getFullYear();
    }
  }

  async ionViewWillEnter(){
    await this.fetchServices.getAppSetting().then(async (response) => {
      const json = JSON.parse(response.data);
      this.serviceFees = json.response[0];
      if(this.course)
      {
        if(this.serviceFees.is_precentage)
        {
          this.service = (this.serviceFees.service_fees/100)*this.course.price;
        }else{
          this.service = this.serviceFees.service_fees;
        }
      }else if(this.tutor){
        if(this.serviceFees.is_precentage)
        {
          this.service = (this.serviceFees.service_fees/100)*this.tutor.hour_price;
        }else{
          this.service = this.serviceFees.service_fees;
        }
      }else if(this.session)
      {
        if(this.serviceFees.is_precentage)
        {
          this.service = (this.serviceFees.service_fees/100)*this.session.price;
        }else{
          this.service = this.serviceFees.service_fees;
        }
      }
    }).catch((error) => {
      
    });
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
  onCheckoutSession(){
    // check if session is still exisist before purchasing
    this.isDisablied = true;
    this.fetchServices.getSessionDetails(this.session.id).then(async (response) => {
      const json = JSON.parse(response[0].data).response[0];
      if(json && (this.session.seats - JSON.parse(response[1].data).response[0].totalSeatsTaken - 1) >= 0)
      {
        const browser = this.iab.create(
          'https://payments.eduwinapp.com/nbo/index.php?orderid=1&amount=0.1&merchant_reference=100&remark=test&language=en&email=test@test.om',
          '_blank',{ location: 'no',zoom: 'no'});
        browser.on('exit').subscribe(event => { this.checkPaymentSession(true); });
      }else{
        this.isDisablied = false;
        this.alertMessage("Error","The session you have selected is either full or has been removed")
      }

    }).catch((error) => {
      this.isDisablied = false;
    });
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
        paid_amount: (this.tuturHourCost * this.durationSelect ),
        course_id : null,
        session_id : null,
        service_fees:this.service,
        user_id : user.user_id,
        tutor_id: this.tutor.user_id,
        is_online:this.paymentType,
        book_id: this.bookID
      };
      this.fetchServices.updateOrder(data).then(async (response) => {
        const json = JSON.parse(response.data).response;
        await loading.dismiss();
        if(json.id){
          this.alertMessage('Payment','You have paid '+ ((this.tuturHourCost * this.durationSelect )+this.service).toFixed(3));
          const randomId = Math.floor(Math.random() * 10000) + 1;
          
          const slotDate = new Date(new Date(json.fullSlot).getTime() - (60000*30));
          LocalNotifications.schedule({
            notifications:[
            {
                title : 'Session Reminder',
                body: 'You have a session with '+this.tutor.fullname+' in 30 min',
                largeBody : 'You have a session with '+this.tutor.fullname+' in 30 min',
                id : randomId,
                schedule: {
                    at: slotDate,
                    allowWhileIdle: true,
                    repeats: false,
                },
                channelId: 'tutrain-default',
                group:'tutrainapp'
            }]
          });
        }

      }).catch((error) => {
        this.isDisablied = false;
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
        paid_amount: this.course.price,
        service_fees:this.service,
        course_id : this.course.id,
        session_id : null,
        user_id : user.user_id,
        tutor_id: null,
        is_online:this.paymentType,
        book_id: null
      };
      this.fetchServices.updateOrder(data).then(async (response) => {
        const json = JSON.parse(response.data).response;
        await loading.dismiss();
        if(json.id){
          this.alertMessage('Payment','You have paid '+ (this.course.price+this.service).toFixed(3) );
        }

      }).catch((error) => {
        this.isDisablied = false;
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
  async checkPaymentSession(event)
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
        paid_amount: this.session.price,
        service_fees:this.service,
        course_id : null,
        session_id : this.session.id,
        user_id : user.user_id,
        tutor_id: null,
        is_online:this.paymentType,
        book_id: null
      };
      this.fetchServices.updateOrder(data).then(async (response) => {
        const json = JSON.parse(response.data).response;
        await loading.dismiss();
        if(json.id){
          const randomId = Math.floor(Math.random() * 10000) + 1;
          LocalNotifications.schedule({
            notifications:[
            {
                title : 'Session Reminder',
                body: 'You have a session with '+this.session.fullname+' begins today in '+ this.session.location,
                largeBody : 'You have a session with '+this.session.fullname+' begins today in '+ this.session.location,
                id : randomId,
                schedule: {
                    at: this.session.startdate,
                    allowWhileIdle: true,
                    repeats: false,
                },
                channelId: 'tutrain-default',
                group:'tutrainapp'
            }]
          });

          this.alertMessage('Payment','You have paid '+ (this.session.price+this.service).toFixed(3) );
        }

      }).catch((error) => {
        this.isDisablied = false;
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
  getActualDate(date)
  {
    const newdate = new Date(date);
      return newdate.getDate().toString().padStart(2, '0') + '/' +
      (1 + newdate.getMonth()).toString().padStart(2, '0') + '/' + newdate.getFullYear();
  }
  ionViewDidEnter() {
    this.util.refreshUserData();
    this.util.checkContest().then((response) => {
      this.contest = response;
      if(this.contest)
      {
        this.contestBadge = 1;
      }
    });

  }
  ionViewDidLeave() {
    this.util.refreshUserData();
  }
  setServiceFees(event){
    if(event.target.value !== 'online')
    {
      this.service = 0;
      this.tuturHourCost = 0;
      this.paymentType = false;
    }else{
      if(this.serviceFees.is_precentage)
      {
        this.service = (this.serviceFees.service_fees/100)*this.tutor.hour_price;
      }else{
        this.service = this.serviceFees.service_fees;
      }
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
      paid_amount: (this.tuturHourCost * this.durationSelect )+this.service,
      course_id : null,
      session_id : null,
      service_fees:this.service,
      user_id : user.user_id,
      tutor_id: this.tutor.user_id,
      is_online:this.paymentType,
      book_id: this.bookID,
      
    };
    this.fetchServices.updateOrder(data).then(async (response) => {
      const json = JSON.parse(response.data).response;
      await loading.dismiss();
      if(json.id){
        this.alertMessage('Payment','Your order has been placed make sure to pay the tutor directly on completetion of the session');
        const randomId = Math.floor(Math.random() * 10000) + 1;

        const slotDate = new Date(new Date(json.fullSlot).getTime() - (60000*30));
        LocalNotifications.schedule({
          notifications:[
          {
              title : 'Session Reminder',
              body: 'You have a session with '+this.tutor.fullname+' in 30 min',
              largeBody : 'You have a session with '+this.tutor.fullname+' in 30 min',
              id : randomId,
              schedule: {
                  at: slotDate,
                  allowWhileIdle: true,
                  repeats: false,
              },
              channelId: 'tutrain-default',
              group:'tutrainapp'
          }]
        });
      }

    }).catch((error) => {
      this.isDisablied = false;
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
