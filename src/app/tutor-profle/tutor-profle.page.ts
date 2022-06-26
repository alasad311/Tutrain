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

  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService
    ,private util: UtilService,public loadingController: LoadingController, public modalController: ModalController
    ,public alertController: AlertController) { }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.util.refreshUserData();
  }
  ionViewDidLeave() {
    this.util.refreshUserData();
  }
  goBackHome(){
    this.navCtrl.back();
  }
}
