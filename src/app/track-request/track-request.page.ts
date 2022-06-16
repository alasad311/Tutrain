import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { PaymentPage } from '../payment/payment.page';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';

@Component({
  selector: 'app-track-request',
  templateUrl: './track-request.page.html',
  styleUrls: ['./track-request.page.scss'],
})
export class TrackRequestPage implements OnInit {
  requests: any;
  user: any;
  showNull = false;
  page = 0;
  tutor = false;
  student = false;
  section = 'pending';
  hidePending = false;
  hideConfirmed = true;
  constructor(public alertController: AlertController,private navCtrl: NavController,private storage: StorageService,
    private fetch: FetchService,public loadingController: LoadingController,public modalController: ModalController) { }
  
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
  async onMakePayment(id,tutorID,duration,timefrom,timeto,slotDate){
    let tutorD;
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
      this.requests = null;
      this.fetch.getUserRequests(this.user.user_id,this.page).then(async (responsee) => {
        this.requests = JSON.parse(responsee.data).response;
        if(this.requests.length == 0)
        {
          this.showNull = true;
        }
      });
    });
  }
  onCancelReques(id){

  }
  async onAccept(id){
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
        this.fetch.getUserRequests(this.user.user_id,this.page).then(async (responsee) => {
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
          this.fetch.getUserRequests(this.user.user_id,this.page).then(async (responsee) => {
            this.requests = JSON.parse(responsee.data).response;
            if(this.requests.length == 0)
            {
              this.showNull = true;
            }
          });
      }
    }).catch((error) => {
    });

  }
  async onReject(id){
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
          this.fetch.getUserRequests(this.user.user_id,this.page,this.section).then(async (responsee) => {
            this.requests = JSON.parse(responsee.data).response;
            if(this.requests.length == 0)
            {
              this.showNull = true;
            }
          });
      }
    }).catch((error) => {
    });
  }
  showSegment(section){
    alert(section);
    this.requests = null;
    this.fetch.getUserRequests(this.user.user_id,this.page,this.section).then(async (responsee) => {
      this.requests = JSON.parse(responsee.data).response;
      if(this.requests.length == 0)
      {
        this.showNull = true;
      }
    });
  }
}
