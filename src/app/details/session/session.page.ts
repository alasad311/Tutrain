import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonRouterOutlet, AlertController, ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PaymentPage } from 'src/app/payment/payment.page';
import { FetchService } from 'src/app/service/api/fetch.service';
import { UtilService } from 'src/app/service/util.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.page.html',
  styleUrls: ['./session.page.scss'],
})
export class SessionPage implements OnInit {
  contest: any;
  contestBadge: any;
  id: any;
  page: any;
  session: any;
  durationName: any;
  paid: any;
  numberofSeats = 0;
  constructor(private routerOutlet: IonRouterOutlet,public alertController: AlertController,
    public modalController: ModalController,private router: Router,private route: ActivatedRoute,private fetch: FetchService,
    private nav: NavController,public util: UtilService,public translate: TranslateService) { }

    async ngOnInit() {
      this.route.queryParams.subscribe(params => {
        this.id = params.id;
        this.page = params.page;
      });
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
  goBackHome(){
    this.nav.back();
  }
  ionViewWillEnter(){
    this.getSessionDetails(this.id);
  }
  directionToLocation(map){
    window.open(map, '_system');
  }
  getSessionDetails(id){
    this.fetch.getSessionDetails(id).then((response) => {
      this.session = JSON.parse(response[0].data).response[0];
      if(this.session)
      {
        this.numberofSeats = this.session.seats - JSON.parse(response[1].data).response[0].totalSeatsTaken
        if(JSON.parse(response[2].data).response.length === 0)
          this.paid = false;
        else
          this.paid = true;
      }else{
        this.goBackHome();
      }
      
    }).catch((error) => {
      
    });
    
  }
  getActualDate(date)
  {
    const newdate = new Date(date);
      return newdate.getDate().toString().padStart(2, '0') + '/' +
      (1 + newdate.getMonth()).toString().padStart(2, '0') + '/' + newdate.getFullYear();
  }
  buySeat(){
    if(this.session.seats > 0)
    {
      this.alertMessage(this.translate.instant('messages.purchase'),this.translate.instant('messages.buyseat')+this.session.session_name);
    }else{
      this.alertMessage2(this.translate.instant('messages.full'),this.translate.instant('messages.fullsession'));
    }
  }
  async alertMessage(header,message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: [
        {
          text: this.translate.instant('messages.ok'),
          id: 'confirm-button',
          handler: () => {
            this.showPaymentPage()
          }
        },{
          text: this.translate.instant('messages.cancel'),
          id: 'cancel-button',
          handler: () => {
            
          }
        }
      ]
    });

    await alert.present();
  }
  async alertMessage2(header,message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: [this.translate.instant('messages.ok')]
    });

    await alert.present();
  }
  async showPaymentPage() {
    const modal = await this.modalController.create({
      component: PaymentPage,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        'session': this.session,
      }
    });
    modal.onDidDismiss()
    .then((data) => {
       const response = data.data.dismissed; // Here's your selected user!
      if(response === true)
      {
        this.getSessionDetails(this.id);
      }else
      {

      }
    });
    await modal.present();

  }
}
