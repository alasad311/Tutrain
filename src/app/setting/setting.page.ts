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

  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService) { }

  ngOnInit() {
  }
  goBackHome(){
    this.navCtrl.back();
  }
}
