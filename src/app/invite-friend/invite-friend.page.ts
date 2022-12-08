import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StorageService } from '../service/storage/storage.service';
import { toastController } from '@ionic/core';
import { Clipboard } from '@capacitor/clipboard';
import { FetchService } from '../service/api/fetch.service';
import { UtilService } from '../service/util.service';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
@Component({
  selector: 'app-invite-friend',
  templateUrl: './invite-friend.page.html',
  styleUrls: ['./invite-friend.page.scss'],
})
export class InviteFriendPage implements OnInit {
  contest: any;
  contestBadge: any;
  refCode: any;
  confirmedInvites = 0;
  lang: any;
  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService
    ,public util: UtilService,public translate: TranslateService,private globalization: Globalization) { }

  async ngOnInit() {
    await this.globalization.getPreferredLanguage().then(async (res) =>{
      const language = res.value.split('-');
      this.lang = language[0];
    });
    const user = await this.storage.get('user');
    this.refCode = "https://tutrain.com/referral/?ref="+user.ref_code;

    this.fetch.getUserInvites(user.ref_code).then(async (response) => {
      const json = JSON.parse(response.data).response[0];
      this.confirmedInvites = json.TotalInvites;
    });

  }
  goBackHome(){
    this.navCtrl.back();
  }
  async onCopy(){
    await Clipboard.write({
      string: this.refCode
    });
    const toast = await toastController.create({
      message: this.translate.instant('messages.copiedreferral'),
      duration: 2000
    });
    toast.present();
  }
  onSMS(){
    if(this.lang === 'en'){
      window.open('sms:?body=Here is a great app for tutors and students download the app it offer your courses / session or even allows you to look for tutors .'+this.refCode, '_system');
    }else if(this.lang === 'ar'){
      window.open('sms:?body=هنا تطبيق رائع للمعلمين والطلاب قم بتنزيل التطبيق الآن. .'+this.refCode, '_system');
    }
  }
  onEmail(){
    if(this.lang === 'en'){
      window.open('mailto:?body=Here is a great app for tutors and students download the app it offer your courses / session or even allows you to look for tutors .'+this.refCode, '_system');
    }else if(this.lang === 'ar'){
      window.open('mailto:?body=هنا تطبيق رائع للمعلمين والطلاب قم بتنزيل التطبيق الآن. .'+this.refCode, '_system');
    }
  }
  onWhatsapp(){
    if(this.lang === 'en'){
      window.open('https://api.whatsapp.com/send?text=Here%20is%20a%20great%20app%20for%20tutors%20and%20students%20download%20the%20app%20it%20offer%20your%20courses%20%2F%20session%20or%20even%20allows%20you%20to%20look%20for%20tutors%20.'+this.refCode, '_system');
    }else if(this.lang === 'ar'){
      window.open('https://api.whatsapp.com/send?text=%D9%87%D9%86%D8%A7%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20%D8%B1%D8%A7%D8%A6%D8%B9%20%D9%84%D9%84%D9%85%D8%B9%D9%84%D9%85%D9%8A%D9%86%20%D9%88%D8%A7%D9%84%D8%B7%D9%84%D8%A7%D8%A8%20%D9%82%D9%85%20%D8%A8%D8%AA%D9%86%D8%B2%D9%8A%D9%84%20%D8%A7%D9%84%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20%D8%A7%D9%84%D8%A2%D9%86.'+this.refCode, '_system');
    }
  }
  onTwitter(){
    if(this.lang === 'en'){
      window.open('https://twitter.com/intent/tweet?text=Here%20is%20a%20great%20app%20for%20tutors%20and%20students%20download%20the%20app%20it%20offer%20your%20courses%20%2F%20session%20or%20even%20allows%20you%20to%20look%20for%20tutors%20.'+this.refCode, '_system');
    }else if(this.lang === 'ar'){
      window.open('https://twitter.com/intent/tweet?text=%D9%87%D9%86%D8%A7%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20%D8%B1%D8%A7%D8%A6%D8%B9%20%D9%84%D9%84%D9%85%D8%B9%D9%84%D9%85%D9%8A%D9%86%20%D9%88%D8%A7%D9%84%D8%B7%D9%84%D8%A7%D8%A8%20%D9%82%D9%85%20%D8%A8%D8%AA%D9%86%D8%B2%D9%8A%D9%84%20%D8%A7%D9%84%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20%D8%A7%D9%84%D8%A2%D9%86.'+this.refCode, '_system');
    }
  }
  onFacebook(){
    if(this.lang === 'en'){
      window.open('https://www.facebook.com/sharer/sharer.php?u=Here%20is%20a%20great%20app%20for%20tutors%20and%20students%20download%20the%20app%20it%20offer%20your%20courses%20%2F%20session%20or%20even%20allows%20you%20to%20look%20for%20tutors%20.'+this.refCode+'&src=sdkpreparse', '_system');
    }else if(this.lang === 'ar'){
      window.open('https://www.facebook.com/sharer/sharer.php?u=%D9%87%D9%86%D8%A7%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20%D8%B1%D8%A7%D8%A6%D8%B9%20%D9%84%D9%84%D9%85%D8%B9%D9%84%D9%85%D9%8A%D9%86%20%D9%88%D8%A7%D9%84%D8%B7%D9%84%D8%A7%D8%A8%20%D9%82%D9%85%20%D8%A8%D8%AA%D9%86%D8%B2%D9%8A%D9%84%20%D8%A7%D9%84%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20%D8%A7%D9%84%D8%A2%D9%86.'+this.refCode+'&src=sdkpreparse', '_system');
    }
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
