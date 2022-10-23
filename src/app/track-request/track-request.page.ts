import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PaymentPage } from '../payment/payment.page';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-track-request',
  templateUrl: './track-request.page.html',
  styleUrls: ['./track-request.page.scss'],
})
export class TrackRequestPage implements OnInit {
  contest: any;
  contestBadge: any;
  requests: any;
  user: any;
  showNull = false;
  page = 0;
  tutor = false;
  student = false;
  section = 'pending';
  pending = true;
  confirmed = false;
  hidePending = false;
  hideConfirmed = true;
  isDisablied = false;
  constructor(public alertController: AlertController,private navCtrl: NavController,private storage: StorageService,
    private fetch: FetchService,public loadingController: LoadingController,public modalController: ModalController,
    public util: UtilService,public translate: TranslateService) { }
  
  async ngOnInit() {
    this.user = await this.storage.get('user');

    if(this.user.type == 'student')
    {
      this.student = true;
      this.tutor = false;
    }else {
      this.tutor = true;
      this.student = false;
    }

    this.fetch.getUserRequests(this.user.user_id,this.page,this.section).then(async (response) => {
      this.requests = JSON.parse(response.data).response;
      if(this.requests.length == 0)
      {
        this.showNull = true;
      }
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
      this.fetch.getUserRequests(this.user.user_id,this.page,this.section).then((response) => {
        var json = JSON.parse(response.data);
        for (let i = 0; i < json.response.length; i++) {
          this.requests.push(json.response[i])
        }
        if(json.response.length == 0)
          event.target.disabled = true;
        event.target.complete();
      }).catch((error) => {
        
      });
    }, 2000);
  }
  async onCallTutor(tutorID){
    this.isDisablied = true;
    await this.fetch.getUserDetailByID(tutorID).then(async (response) => {
      let json = JSON.parse(response.data).response[0];
      this.isDisablied = false;
      if(json.country == 'dz'){
        window.open('tel:+213'+json.phone, '_system');
      }else if(json.country == 'bh'){
          window.open('tel:+973'+json.phone, '_system');
      }else if(json.country == 'eg'){
          window.open('tel:+20'+json.phone, '_system');
      }else if(json.country == 'iq'){
          window.open('tel:+964'+json.phone, '_system');
      }else if(json.country == 'jo'){
          window.open('tel:+962'+json.phone, '_system');
      }else if(json.country == 'kw'){
          window.open('tel:+965'+json.phone, '_system');
      }else if(json.country == 'lb'){
          window.open('tel:+961'+json.phone, '_system');
      }else if(json.country == 'ly'){
          window.open('tel:+218'+json.phone, '_system');
      }else if(json.country == 'ma'){
          window.open('tel:+212'+json.phone, '_system');
      }else if(json.country == 'ps'){
          window.open('tel:+970'+json.phone, '_system');
      }else if(json.country == 'qa'){
          window.open('tel:+974'+json.phone, '_system');
      }else if(json.country == 'sa'){
          window.open('tel:+966'+json.phone, '_system');
      }else if(json.country == 'ss'){
          window.open('tel:+211'+json.phone, '_system');
      }else if(json.country == 'sd'){
          window.open('tel:+249'+json.phone, '_system');
      }else if(json.country == 'om'){
          window.open('tel:+968'+json.phone, '_system');
      }else if(json.country == 'sy'){
          window.open('tel:+963'+json.phone, '_system');
      }else if(json.country == 'tn'){
          window.open('tel:+216'+json.phone, '_system');
      }else if(json.country == 'ae'){
          window.open('tel:+971'+json.phone, '_system');
      }else if(json.country == 'ye'){
          window.open('tel:+967'+json.phone, '_system');
      }
    }).catch((error) => {
    });
  }
  async onCallStudent(userID){
    this.isDisablied = true;
    await this.fetch.getUserDetailByID(userID).then(async (response) => {
      let json = JSON.parse(response.data).response[0];
      this.isDisablied = false;
      if(json.country == 'dz'){
        window.open('tel:+213'+json.phone, '_system');
      }else if(json.country == 'bh'){
          window.open('tel:+973'+json.phone, '_system');
      }else if(json.country == 'eg'){
          window.open('tel:+20'+json.phone, '_system');
      }else if(json.country == 'iq'){
          window.open('tel:+964'+json.phone, '_system');
      }else if(json.country == 'jo'){
          window.open('tel:+962'+json.phone, '_system');
      }else if(json.country == 'kw'){
          window.open('tel:+965'+json.phone, '_system');
      }else if(json.country == 'lb'){
          window.open('tel:+961'+json.phone, '_system');
      }else if(json.country == 'ly'){
          window.open('tel:+218'+json.phone, '_system');
      }else if(json.country == 'ma'){
          window.open('tel:+212'+json.phone, '_system');
      }else if(json.country == 'ps'){
          window.open('tel:+970'+json.phone, '_system');
      }else if(json.country == 'qa'){
          window.open('tel:+974'+json.phone, '_system');
      }else if(json.country == 'sa'){
          window.open('tel:+966'+json.phone, '_system');
      }else if(json.country == 'ss'){
          window.open('tel:+211'+json.phone, '_system');
      }else if(json.country == 'sd'){
          window.open('tel:+249'+json.phone, '_system');
      }else if(json.country == 'om'){
          window.open('tel:+968'+json.phone, '_system');
      }else if(json.country == 'sy'){
          window.open('tel:+963'+json.phone, '_system');
      }else if(json.country == 'tn'){
          window.open('tel:+216'+json.phone, '_system');
      }else if(json.country == 'ae'){
          window.open('tel:+971'+json.phone, '_system');
      }else if(json.country == 'ye'){
          window.open('tel:+967'+json.phone, '_system');
      }
    }).catch((error) => {
    });
    
  }
  async onMakePayment(id,tutorID,duration,timefrom,timeto,slotDate){
    let tutorD;
    this.isDisablied = true;
    await this.fetch.getUserDetailByID(tutorID).then(async (response) => {
      tutorD = JSON.parse(response.data).response[0];
    }).catch((error) => {
    });
    const modal = await this.modalController.create({
      component: PaymentPage,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      componentProps: {
        tutor:tutorD,
        durationSelect:duration,
        dateSelected:slotDate,
        timeFromSelected:timefrom,
        timeToSelected:timeto,
        bookID: id
      }
    });
    await modal.present();
    modal.onDidDismiss()
    .then(async (data) => {
      this.isDisablied = false;
      this.requests = null;
      this.showNull = false;
      this.fetch.getUserRequests(this.user.user_id,this.page,this.section).then(async (responsee) => {
        this.requests = JSON.parse(responsee.data).response;
        if(this.requests.length == 0)
        {
          this.showNull = true;
        }
      });
    });
  }
  async onCancelReques(id){
    this.isDisablied = true;
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: this.translate.instant('message.pleasewait')
    });
    await loading.present();
    this.fetch.cancelBooking({is_trash: true,bookid : id}).then(async (response) => {
      const json = JSON.parse(response.data).response;
      if(json.status == 'updated')
      {
        await loading.dismiss();
        const alertRes = await this.alertController.create({
          header: this.translate.instant('message.updated'),
          message:  this.translate.instant('message.bookingupdated'),
          buttons: [this.translate.instant('message.ok')]});
        await alertRes.present();
        this.requests = null;
        this.showNull = false;
        this.fetch.getUserRequests(this.user.user_id,this.page,this.section).then(async (responsee) => {
          this.requests = JSON.parse(responsee.data).response;
          if(this.requests.length == 0)
          {
            this.showNull = true;
          }
        });
      }else{
          await loading.dismiss();
          const alertRes = await this.alertController.create({
            header: this.translate.instant('message.error'),
            message:  this.translate.instant('message.errormessage'),
            buttons: [this.translate.instant('message.ok')]});
          await alertRes.present();
          this.requests = null;
          this.showNull = false;
          this.fetch.getUserRequests(this.user.user_id,this.page,this.section).then(async (responsee) => {
            this.requests = JSON.parse(responsee.data).response;
            if(this.requests.length == 0)
            {
              this.showNull = true;
            }
          });
      }
      this.isDisablied = false;
    }).catch((error) => {
    });
  }
  async onAccept(id){
    this.isDisablied = true;
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: this.translate.instant('message.pleasewait')
    });
    await loading.present();
    this.fetch.updateBooking({is_accpeted: true,bookid : id}).then(async (response) => {
      const json = JSON.parse(response.data).response;
      if(json.status == 'updated')
      {
        await loading.dismiss();
        const alertRes = await this.alertController.create({
          header: this.translate.instant('message.updated'),
          message:  this.translate.instant('message.bookingupdated'),
          buttons: [this.translate.instant('message.ok')]});
        await alertRes.present();
        this.requests = null;
        this.showNull = false;
        this.fetch.getUserRequests(this.user.user_id,this.page,this.section).then(async (responsee) => {
          this.requests = JSON.parse(responsee.data).response;
          if(this.requests.length == 0)
          {
            this.showNull = true;
          }
        });
      }else{
          await loading.dismiss();
          const alertRes = await this.alertController.create({
            header: this.translate.instant('message.error'),
            message:  this.translate.instant('message.errormessage'),
            buttons: [this.translate.instant('message.ok')]});
          await alertRes.present();
          this.requests = null;
          this.showNull = false;
          this.fetch.getUserRequests(this.user.user_id,this.page,this.section).then(async (responsee) => {
            this.requests = JSON.parse(responsee.data).response;
            if(this.requests.length == 0)
            {
              this.showNull = true;
            }
          });
      }
      this.isDisablied = false;
    }).catch((error) => {
    });

  }
  async onReject(id){
    this.isDisablied = true;
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: this.translate.instant('message.pleasewait')
    });
    await loading.present();
    this.fetch.updateBooking({is_accpeted: false,bookid : id}).then(async (response) => {
      const json = JSON.parse(response.data).response;
      if(json.status == 'updated')
      {
        await loading.dismiss();
        const alertRes = await this.alertController.create({
          header: this.translate.instant('message.updated'),
          message:  this.translate.instant('message.bookingupdated'),
          buttons: [this.translate.instant('message.ok')]});
        await alertRes.present();
        this.requests = null;
        this.showNull = false;
        this.fetch.getUserRequests(this.user.user_id,this.page,this.section).then(async (responsee) => {
          this.requests = JSON.parse(responsee.data).response;
          if(this.requests.length == 0)
          {
            this.showNull = true;
          }
        });
      }else{
          await loading.dismiss();
          const alertRes = await this.alertController.create({
            header: this.translate.instant('message.error'),
            message:  this.translate.instant('message.errormessage'),
            buttons: [this.translate.instant('message.ok')]});
          await alertRes.present();
          this.requests = null;
          this.showNull = false;
          this.fetch.getUserRequests(this.user.user_id,this.page,this.section).then(async (responsee) => {
            this.requests = JSON.parse(responsee.data).response;
            if(this.requests.length == 0)
            {
              this.showNull = true;
            }
          });
          this.isDisablied = false;
      }
    }).catch((error) => {
    });
  }
  showSegment(){
    if(this.section == "pending")
    {
      this.confirmed = false;
      this.pending = true;
    }else{
      this.confirmed = true;
      this.pending = false;
    }

    this.requests = null;
    this.showNull = false;
    this.fetch.getUserRequests(this.user.user_id,this.page,this.section).then(async (responsee) => {
      this.requests = JSON.parse(responsee.data).response;
      if(this.requests.length == 0)
      {
        this.showNull = true;
      }
    });
  }
}
