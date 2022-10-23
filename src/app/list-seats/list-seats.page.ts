import { Component, Input, OnInit } from '@angular/core';
import { NavController, LoadingController, ModalController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-list-seats',
  templateUrl: './list-seats.page.html',
  styleUrls: ['./list-seats.page.scss'],
})
export class ListSeatsPage implements OnInit {
  @Input() sessionID: any;
  contest: any;
  contestBadge: any;
  users: any;
  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService
    ,public util: UtilService,public loadingController: LoadingController, public modalController: ModalController
    ,public alertController: AlertController,public translate: TranslateService) {

  }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: this.translate.instant('message.pleasewaitsession')
    });
    await loading.present();
    this.fetch.getAllSeatBySession(this.sessionID).then(async (response) =>{
      this.users = JSON.parse(response.data).response;
      await loading.dismiss();
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
    this.modalController.dismiss();
  }
  getActualDate(date)
  {
    const newdate = new Date(date);
      return newdate.getDate().toString().padStart(2, '0') + '/' +
      (1 + newdate.getMonth()).toString().padStart(2, '0') + '/' + newdate.getFullYear();
  }
}
