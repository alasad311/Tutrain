import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ModalController, AlertController } from '@ionic/angular';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.page.html',
  styleUrls: ['./session-list.page.scss'],
})
export class SessionListPage implements OnInit {

  section = 'all';
  isCreate = false;
  isAll = true;
  user: any;
  sessions = null;
  page = 0;
  showNull = false;
  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService
    ,private util: UtilService,public loadingController: LoadingController, public modalController: ModalController
    ,public alertController: AlertController) { }

  async ngOnInit() {
    this.user = await this.storage.get('user');
    this.fetch.getAllSessions(this.user.user_id,this.page).then(async (response) => {
      this.sessions = JSON.parse(response.data).response;
      if(this.sessions.length === 0){this.showNull = true;}else{this.showNull = false;}
    }).catch((error) => {
    });
  }
  getActualDate(date)
  {
    const newdate = new Date(date);
      return newdate.getDate().toString().padStart(2, '0') + '/' +
      (1 + newdate.getMonth()).toString().padStart(2, '0') + '/' + newdate.getFullYear();
  }
  doInfinite(event) {
    setTimeout(() => {
      this.page = this.page + 1;
      this.fetch.getAllSessions(this.user.user_id,this.page).then(async (response) => {
        const json = JSON.parse(response.data);
        for (let i = 0; i < json.response.length; i++) {
          this.sessions.push(json.response[i]);
        }
        if(json.response.length === 0)
          {event.target.disabled = true;}
        event.target.complete();
      }).catch((error) => {

      });
    }, 2000);
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
  showSegment(section)
  {
    if(section === 'all'){
      this.sessions = null;
      this.fetch.getAllSessions(this.user.user_id,this.page).then(async (response) => {
        this.sessions = JSON.parse(response.data).response;
        if(this.sessions.length === 0){this.showNull = true;}else{this.showNull = false;}
      }).catch((error) => {
      });
      this.isAll = true;
      this.isCreate = false;
    }else if(section === 'create'){
      this.isAll = false;
      this.isCreate = true;
    }
  }
  goToSessionUpdate(id,isActive){

    //process the changes
   
  }
}
