import { Component, OnInit } from '@angular/core';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
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
  lang: any;
  constructor(private navCtrl: NavController,public util: UtilService,private globalization: Globalization) { }

  async ngOnInit() {
    await this.globalization.getPreferredLanguage().then(async (res) =>{
      const language = res.value.split('-');
      this.lang = language[0];
    });
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
    if(this.lang === 'en')
    {
      window.open('https://api.whatsapp.com/send?phone=+96899776717&text=Hey%20there%2C%20i%20need%20help', '_system');
    }else if(this.lang === 'ar')
    {
      window.open('https://api.whatsapp.com/send?phone=+96899776717&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D8%A3%D8%AD%D8%AA%D8%A7%D8%AC%20%D8%A5%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A9', '_system');
    }
    
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
