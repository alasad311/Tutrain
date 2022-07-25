import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { FetchService } from '../service/api/fetch.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-winners',
  templateUrl: './winners.page.html',
  styleUrls: ['./winners.page.scss'],
})
export class WinnersPage implements OnInit {
  contest: any;
  contestBadge: any;
  winners: any;
  constructor(private navCtrl: NavController,public util: UtilService,private fetch: FetchService,
    public loadingController: LoadingController) { }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait updating profile...'
    });
    await loading.present();
    this.fetch.getWinners().then(async (response) => {
      this.winners = JSON.parse(response.data).response;
      await loading.dismiss();
    }).catch(async (error) => {  await loading.dismiss();});
  }
  goBackHome(){
    this.navCtrl.back();
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
}
