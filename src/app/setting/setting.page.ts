import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  user: any;
  wallet: any;
  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService) { }

  async ngOnInit() {
    this.user = await this.storage.get('user');
    this.fetch.getTotalUnPaid(this.user.user_id).then(async (response) => {
      const json = JSON.parse(response.data);
      this.wallet = json.response[0].TotalW;
    }).catch((error) => {
    });
  }
  goBackHome(){
    this.navCtrl.back();
  }
}
