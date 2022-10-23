import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-contest',
  templateUrl: './contest.page.html',
  styleUrls: ['./contest.page.scss'],
})
export class ContestPage implements OnInit {
  isAnswered = true;
  contest: any;
  contestAnswerer: string;
  disabled = true;
  isDisabled = false;
  lang: any;
  constructor(private navCtrl: NavController,public util: UtilService,private fetch: FetchService,
    private route: ActivatedRoute,public alertController: AlertController,public loadingController: LoadingController,
    private storage: StorageService,private globalization: Globalization,public translate: TranslateService) { }

  async ngOnInit() {
    await this.globalization.getPreferredLanguage().then(async (res) =>{
      const language = res.value.split('-');
      this.lang = language[0];
    });
    this.route.params.subscribe((params: any) => {
      this.fetch.contestDidAnswerer(params['id']).then(async (response) => {
        if(JSON.parse(response.data).isAnswererd)
        {
          this.contestAnswerer = JSON.parse(response.data).value
          this.isAnswered = true;
          this.fetch.getContestQuestions(params['id']).then(async (response) => {
            this.contest = JSON.parse(response.data).response;
          }).catch((error) => {
          });
        }else{
          this.isAnswered = false;
          this.fetch.getContestQuestions(params['id']).then(async (response) => {
            this.contest = JSON.parse(response.data).response;
          }).catch((error) => {
          });
        }
        
      }).catch((error) => {
      });
    });
  }
  submitAnswer(){
    if(this.contestAnswerer)
    {
      this.isDisabled = true;
      this.alertMessageWithBtn(this.translate.instant('message.areyousure'),"")
    }else{
      this.util.showWarningAlert(this.translate.instant('message.error'),this.translate.instant('message.haventselectedanswerer'))
    }
  }
  goBackHome(){
    this.navCtrl.back();
  }
  ionViewDidEnter() {
    this.util.refreshUserData();
  }
  ionViewDidLeave() {
    this.util.refreshUserData();
  }
  async alertMessageWithBtn(header,message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: [
        {
          text: this.translate.instant('message.ok'),
          id: 'confirm-button',
          handler: async () => {
            const loading = await this.loadingController.create({
              cssClass: 'my-custom-class',
              message: this.translate.instant('message.pleasewait')
            });
            await loading.present();
            this.fetch.submitUserAnswerer(this.contest[0].id,this.contestAnswerer).then(async (response)=>{
              if(JSON.parse(response.data).id)
              {
                await loading.dismiss();
                this.alertMessageWithBtn2(this.translate.instant('message.success'),
                this.translate.instant('message.answersubmitted'),this.contest[0].id);
              }
            })
          }
        },{
          text: 'Cancel',
          id: 'cancel-button',
          handler: () => {
            alert.dismiss();
            this.isDisabled = false;
          }
        }
      ]
    });

    await alert.present();
  }
  async alertMessageWithBtn2(header,message,id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: [
        {
          text: this.translate.instant('message.ok'),
          id: 'confirm-button',
          handler: () => {
            this.contest = null;
            this.fetch.contestDidAnswerer(id).then(async (response) => {
              if(JSON.parse(response.data).isAnswererd)
              {
                this.contestAnswerer = JSON.parse(response.data).value
                this.isAnswered = true;
                this.fetch.getContestQuestions(id).then(async (response) => {
                  this.contest = JSON.parse(response.data).response;
                }).catch((error) => {
                });
              }else{
                this.isAnswered = false;
                this.fetch.getContestQuestions(id).then(async (response) => {
                  this.contest = JSON.parse(response.data).response;
                }).catch((error) => {
                });
              }
              
            }).catch((error) => {
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
