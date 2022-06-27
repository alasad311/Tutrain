import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StorageService } from '../service/storage/storage.service';
import { toastController } from '@ionic/core';
import { Clipboard } from '@capacitor/clipboard';
import { FetchService } from '../service/api/fetch.service';
import { UtilService } from '../service/util.service';
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
  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService
    ,public util: UtilService) { }

  async ngOnInit() {
    const user = await this.storage.get('user');
    this.refCode = "https://tapp.scd.edu.om/referral/?ref="+user.ref_code;

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
      message: 'Referral code has been copied!',
      duration: 2000
    });
    toast.present();
  }
  onSMS(){
    window.open('sms:?body=Here is a great app for tutors and students download the app and offer your courses / session or even look for tutors '+this.refCode, '_system');
  }
  onEmail(){
    window.open('mailto:?body=Here is a great app for tutors and students download the app and offer your courses / session or even look for tutors '+this.refCode, '_system');
  }
  onWhatsapp(){
    window.open('https://api.whatsapp.com/send?text=Here%20is%20a%20great%20app%20for%20tutors%20and%20students%20download%20the%20app%20and%20offer%20your%20courses%20%2F%20session%20or%20even%20look%20for%20tutors%20'+this.refCode, '_system');
  }
  onTwitter(){
    window.open('https://twitter.com/intent/tweet?text=Here%20is%20a%20great%20app%20for%20tutors%20and%20students%20download%20the%20app%20and%20offer%20your%20courses%20%2F%20session%20or%20even%20look%20for%20tutors%20'+this.refCode, '_system');
  }
  onFacebook(){
    window.open('https://www.facebook.com/sharer/sharer.php?u='+this.refCode+'&src=sdkpreparse', '_system');
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
