import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {
  contest: any;
  contestBadge: any;
  constructor(private navCtrl: NavController,public util: UtilService) { }

  ngOnInit() {
  }
  onClick(id)
  {
    if(document.getElementById(id).classList.contains('hide'))
    {
      document.getElementById(id).classList.remove('hide');
      document.getElementById(id).classList.add('show');
    }else{
      document.getElementById(id).classList.add('hide');
      document.getElementById(id).classList.remove('show');
    }
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
}
