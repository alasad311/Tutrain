import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, LoadingController, ModalController, AlertController, IonInfiniteScroll } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AddSessionPage } from '../add-session/add-session.page';
import { EditSessionPage } from '../edit-session/edit-session.page';
import { ListSeatsPage } from '../list-seats/list-seats.page';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.page.html',
  styleUrls: ['./course-list.page.scss'],
})
export class CourseListPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  contest: any;
  contestBadge: any;
  user: any;
  courses = null;
  page = 0;
  searchInput: any;
  showNull = false;
  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService
    ,public util: UtilService,public loadingController: LoadingController, public modalController: ModalController
    ,public alertController: AlertController,public translate: TranslateService) { 

  }

  async ngOnInit() {
    this.user = await this.storage.get('user');
    this.fetch.getAllCourses(this.user.user_id,this.page).then(async (response) => {
      this.courses = JSON.parse(response.data).response;
      if(this.courses.length === 0){this.showNull = true;}else{this.showNull = false;}
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
    this.courses = null;
    this.showNull = false;
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    this.fetch.getAllCourses(this.user.user_id,this.page).then(async (response) => {
      this.courses = JSON.parse(response.data).response;
      if(this.courses.length === 0){this.showNull = true;}else{this.showNull = false;}
    }).catch((error) => {
    });
  }
  searchCourses(search)
  {
    this.page = 0;
    this.courses = null;
    this.showNull = false;
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;

    this.fetch.searchCoursesWithinUser(search,this.page).then((response) => {
      const json = JSON.parse(response.data);
      this.courses = json.response;
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
        this.fetch.searchCoursesWithinUser(this.searchInput,this.page).then((response) => {
          const json = JSON.parse(response.data);
          for (let i = 0; i < json.response.length; i++) {
            this.courses.push(json.response[i]);
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
            this.courses.push(json.response[i]);
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
  async deleteSession(id){
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: this.translate.instant('messages.pleasewaitdeleting')
    });
    await loading.present();
    this.fetch.deleteCourse(id).then(async (response) =>{
      if(JSON.parse(response.data).result)
      {
        this.util.showWarningAlert(this.translate.instant('messages.success'),this.translate.instant('messages.deletecourse'));
        await loading.dismiss();
        this.onClear();
      }else{
        await loading.dismiss();
        this.util.showWarningAlert(this.translate.instant('messages.error'),this.translate.instant('messages.couldntdeletecourse'));
      }
    });
  }

  goBackHome(){
    this.navCtrl.back();
  }
  // async createSession(){
  //   window.open('https://tutrain.com', '_system');
  // }
}
