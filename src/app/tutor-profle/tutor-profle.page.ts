import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ModalController, AlertController } from '@ionic/angular';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-tutor-profle',
  templateUrl: './tutor-profle.page.html',
  styleUrls: ['./tutor-profle.page.scss'],
})
export class TutorProflePage implements OnInit {
  contest: any;
  contestBadge: any;
  user: any;
  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService
    ,public util: UtilService,public loadingController: LoadingController, public modalController: ModalController
    ,public alertController: AlertController) { }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait loading profile...'
    });
    await loading.present();
    const users = await this.storage.get('user');
    this.fetch.getUserDetailByID(users.user_id).then(async (response) => {
      this.user = JSON.parse(response.data).response[0];
      await loading.dismiss();
    }).catch((error) => {

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
    this.navCtrl.back();
  }
}
