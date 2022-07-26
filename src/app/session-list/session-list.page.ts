import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, LoadingController, ModalController, AlertController, IonInfiniteScroll } from '@ionic/angular';
import { EditSessionPage } from '../edit-session/edit-session.page';
import { ListSeatsPage } from '../list-seats/list-seats.page';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.page.html',
  styleUrls: ['./session-list.page.scss'],
})
export class SessionListPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  contest: any;
  contestBadge: any;
  user: any;
  sessions = null;
  page = 0;
  searchInput: any;
  showNull = false;
  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService
    ,public util: UtilService,public loadingController: LoadingController, public modalController: ModalController
    ,public alertController: AlertController) { 

  }

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
  onClear(){
    this.page = 0;
    this.sessions = null;
    this.showNull = false;
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    this.fetch.getAllSessions(this.user.user_id,this.page).then(async (response) => {
      this.sessions = JSON.parse(response.data).response;
      if(this.sessions.length === 0){this.showNull = true;}else{this.showNull = false;}
    }).catch((error) => {
    });
  }
  searchSessions(search)
  {
    this.page = 0;
    this.sessions = null;
    this.showNull = false;
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;

    this.fetch.searchSessionsWithinUser(search,this.page).then((response) => {
      const json = JSON.parse(response.data);
      this.sessions = json.response;
      if(json.response.length === 0)
      {
        this.showNull = true;
        this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
      }
    }).catch((error) => {

    });
  }
  doInfinite(event) {
    setTimeout(() => {
      this.page = this.page + 1;
      if(this.searchInput)
      {
        this.fetch.searchSessionsWithinUser(this.searchInput,this.page).then((response) => {
          const json = JSON.parse(response.data);
          for (let i = 0; i < json.response.length; i++) {
            this.sessions.push(json.response[i]);
          }
          if(json.response.length === 0)
          {event.target.disabled = true;}
        event.target.complete();
        }).catch((error) => {

        });
      }else{
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
      }
    }, 2000);
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
  async deleteSession(id,status){
    if(status){
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Please wait deleting in progress...'
      });
      await loading.present();
      this.fetch.deleteSession(id).then(async (response) =>{
        if(JSON.parse(response.data).result)
        {
          this.util.showWarningAlert('Success','You have deleted the session successfully!');
          await loading.dismiss();
          this.onClear();
        }else{
          await loading.dismiss();
          this.util.showWarningAlert('Error',`Couldn\'t delete session as there was seats been sold.
          \n Contact support for further actions!`);
        }
      });
    }else{
      this.util.showWarningAlert('Error',`Couldn\'t delete the course session as the course 
      session end date has expired and no longer active!`);
    }
  }

  goBackHome(){
    this.navCtrl.back();
  }
  createSession(){

  }
  async updateSession(id,status){
    //process the changes
    if(status){
      const modal = await this.modalController.create({
        component: EditSessionPage,
        componentProps: { sessionID: id }
      });
      await modal.present();
      modal.onDidDismiss()
      .then((data) => {
         const response = data.data.dismissed; // Here's your selected user!
        if(response === true)
        {
          if(this.searchInput)
          {
            this.searchSessions(this.searchInput);
          }else{
            this.onClear();
          }
        }
      });
    }else{
      this.util.showWarningAlert('Error',`Couldn\'t update the course session as the course 
      session end date has expired and no longer active!`);
    }
  }
  async goToSeatList(id){
    //process the changes
    const modal = await this.modalController.create({
      component: ListSeatsPage,
      componentProps: { sessionID: id }
    });
    await modal.present();
  }
}
