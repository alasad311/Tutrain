import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
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
    public util: UtilService) { }
  
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
      if(json.country == 'om'){
        window.open('tel:+968'+json.phone, '_system');
      }else if(json.country == 'kw'){
        window.open('tel:+965'+json.phone, '_system');
      }else if(json.country == 'sa'){
        window.open('tel:+966'+json.phone, '_system');
      }else if(json.country == 'qa'){
        window.open('tel:+974'+json.phone, '_system');
      }else if(json.country == 'iq'){
        window.open('tel:+964'+json.phone, '_system');
      }else if(json.country == 'bh'){
        window.open('tel:+973'+json.phone, '_system');
      }else if(json.country == 'ae'){
        window.open('tel:+971'+json.phone, '_system');
      }
    }).catch((error) => {
    });
  }
  async onCallStudent(userID){
    this.isDisablied = true;
    await this.fetch.getUserDetailByID(userID).then(async (response) => {
      let json = JSON.parse(response.data).response[0];
      this.isDisablied = false;
      if(json.country == 'om'){
        window.open('tel:+968'+json.phone, '_system');
      }else if(json.country == 'kw'){
        window.open('tel:+965'+json.phone, '_system');
      }else if(json.country == 'sa'){
        window.open('tel:+966'+json.phone, '_system');
      }else if(json.country == 'qa'){
        window.open('tel:+974'+json.phone, '_system');
      }else if(json.country == 'iq'){
        window.open('tel:+964'+json.phone, '_system');
      }else if(json.country == 'bh'){
        window.open('tel:+973'+json.phone, '_system');
      }else if(json.country == 'ae'){
        window.open('tel:+971'+json.phone, '_system');
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
      message: 'Please wait...'
    });
    await loading.present();
    this.fetch.cancelBooking({is_trash: true,bookid : id}).then(async (response) => {
      const json = JSON.parse(response.data).response;
      if(json.status == 'updated')
      {
        await loading.dismiss();
        const alertRes = await this.alertController.create({
          header: 'Updated',
          message:  'Booking has been updated',
          buttons: ['OK']});
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
            header: 'Error',
            message:  'An Error happened while updated try again later.',
            buttons: ['OK']});
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
      message: 'Please wait...'
    });
    await loading.present();
    this.fetch.updateBooking({is_accpeted: true,bookid : id}).then(async (response) => {
      const json = JSON.parse(response.data).response;
      if(json.status == 'updated')
      {
        await loading.dismiss();
        const alertRes = await this.alertController.create({
          header: 'Updated',
          message:  'Booking has been updated',
          buttons: ['OK']});
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
            header: 'Error',
            message:  'An Error happened while updated try again later.',
            buttons: ['OK']});
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
      message: 'Please wait...'
    });
    await loading.present();
    this.fetch.updateBooking({is_accpeted: false,bookid : id}).then(async (response) => {
      const json = JSON.parse(response.data).response;
      if(json.status == 'updated')
      {
        await loading.dismiss();
        const alertRes = await this.alertController.create({
          header: 'Updated',
          message:  'Booking has been updated',
          buttons: ['OK']});
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
            header: 'Error',
            message:  'An Error happened while updated try again later.',
            buttons: ['OK']});
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
