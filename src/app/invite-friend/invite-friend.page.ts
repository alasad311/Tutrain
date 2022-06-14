import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StorageService } from '../service/storage/storage.service';
import { toastController } from '@ionic/core';
import { Clipboard } from '@capacitor/clipboard';
@Component({
  selector: 'app-invite-friend',
  templateUrl: './invite-friend.page.html',
  styleUrls: ['./invite-friend.page.scss'],
})
export class InviteFriendPage implements OnInit {

  refCode: any;
  constructor(private navCtrl: NavController,private storage: StorageService) { }

  async ngOnInit() {
    const user = await this.storage.get('user');
    this.refCode = "https://tapp.scd.edu.om/referral/?ref="+user.ref_code;
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
}
