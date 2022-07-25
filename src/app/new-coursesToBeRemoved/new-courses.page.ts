import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MenuController, NavController, ModalController, AlertController } from '@ionic/angular';
import { FetchService } from '../service/api/fetch.service';
import { AuthGuardService } from '../service/Auth/auth-guard.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-new-courses',
  templateUrl: './new-courses.page.html',
  styleUrls: ['./new-courses.page.scss'],
})
export class NewCoursesPage implements OnInit {
  contest: any;
  contestBadge: any;
  courses: any;
  page = 0;
  user:any;
  constructor(private nav: NavController,
    private fetch: FetchService, private storage: StorageService,
    public util: UtilService,public alertController: AlertController) { }

  async ngOnInit() {
    this.user = await this.storage.get("user");
    this.fetch.getAllNewCoursePages(this.user.user_id,this.page).then((response) => {
      var json = JSON.parse(response.data);
      this.courses = json.response;
    });
  }
  goBackHome(){
    this.nav.back();
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
  goToCourse(selectID)
  {
    const navigationExtras: NavigationExtras = {
      queryParams: {
          page: '/new-courses',
          id: selectID
      }
    };
    this.nav.navigateForward('/details/courses',navigationExtras);
  }
  doInfinite(event) {
    setTimeout(() => {
      this.page = this.page + 1;
      this.fetch.getAllNewCoursePages(this.user.user_id,this.page).then((response) => {
        var json = JSON.parse(response.data);
        for (let i = 0; i < json.response.length; i++) {
          this.courses.push(json.response[i])
        }
        if(json.response.length == 0)
          event.target.disabled = true;
        event.target.complete();
      }).catch(() => {
        
      });
     
    }, 3000);
  }
}
