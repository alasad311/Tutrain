import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MenuController, NavController, ModalController, AlertController } from '@ionic/angular';
import { FetchService } from '../service/api/fetch.service';
import { AuthGuardService } from '../service/Auth/auth-guard.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  contest: any;
  contestBadge: any;
  category: any;
  page = 0;
  user:any;
  categoryID;
  constructor(private router: Router, private menuCtrl: MenuController,private nav: NavController,
    private fetch: FetchService, private auth: AuthGuardService, private storage: StorageService,
    private modalCtrl: ModalController,public util: UtilService,public alertController: AlertController,
    private route: ActivatedRoute) { }

  async ngOnInit() {
    this.user = await this.storage.get("user");

    this.route.params.subscribe((params: any) => {
      this.categoryID = params.id
      this.fetch.getAllCoursesInCategory(this.user.user_id,params.id,this.page).then((response) => {
        var json = JSON.parse(response.data);
        this.category = json.response;
      }).catch(() => {
        
      });
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
      this.fetch.getAllCoursesInCategory(this.user.user_id,this.categoryID,this.page).then((response) => {
        var json = JSON.parse(response.data);
        for (let i = 0; i < json.response.length; i++) {
          this.category.push(json.response[i])
        }
        if(json.response.length == 0)
          event.target.disabled = true;
        event.target.complete();
      }).catch(() => {
        
      });
     
    }, 3000);
  }
}
