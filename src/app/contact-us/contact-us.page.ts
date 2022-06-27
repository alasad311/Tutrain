import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  contest: any;
  contestBadge: any;
  constructor(private navCtrl: NavController,public util: UtilService) { }

  ngOnInit() {
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
  goToEmail(){
    window.open('mailto:support@tutrainapp.com', '_system');
  }
  goToWhatsApp(){
    window.open('https://api.whatsapp.com/send?phone=+96899776717&text=Hey%20there%2C%20i%20need%20help', '_system');
  }
  openTwitter(){
    window.open('https://www.twitter.com', '_system');
  }
  openFacebook(){
    window.open('https://www.facebook.com', '_system');
  }
  openInstagram(){
    window.open('https://www.instagram.com', '_system');
  }
  openYoutube(){
    window.open('https://www.youtube.com', '_system');
  }
}
