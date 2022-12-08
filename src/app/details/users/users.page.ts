import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,NavigationExtras,Router } from '@angular/router';
import { AlertController, IonRouterOutlet, LoadingController, ModalController, NavController } from '@ionic/angular';
import { FetchService } from 'src/app/service/api/fetch.service';
import { ReportUserPage } from '../../report-user/report-user.page';
import { BookTutorPage } from '../../book-tutor/book-tutor.page';
import { StorageService } from 'src/app/service/storage/storage.service';
import { UtilService } from 'src/app/service/util.service';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  contest: any;
  contestBadge: any;
  id: any;
  page: any;
  courseID: any;
  user: any;
  lang: any;
  constructor(private storage: StorageService,public loadingController: LoadingController,private router: Router,
    public modalController: ModalController,private routerOutlet: IonRouterOutlet,
    private route: ActivatedRoute,private nav: NavController,private fetch: FetchService,public alertController: AlertController,
    public util: UtilService,private globalization: Globalization,public translate: TranslateService
    ) { }

  async ngOnInit() {
    await this.globalization.getPreferredLanguage().then(async (res) =>{
      const language = res.value.split('-');
      this.lang = language[0];
    });
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
      this.page = params.page;
      if(params.courseid)
      {
        this.courseID = params.courseid;
      }
  });
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
  ionViewWillEnter(){
    this.getUserDetails(this.id);
  }
  getUserDetails(id)
  {
    this.user = null;
    this.fetch.getUserDetailByID(id).then((response) => {
      this.user = JSON.parse(response.data).response[0];

    }).catch((error) => {

    });
  }
  goBackHome(){
    this.nav.back();
  }
  async reportTutor(){
    //lets add the report to the DB
    const modal = await this.modalController.create({
      component: ReportUserPage,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1],
      presentingElement: await this.modalController.getTop(),
      componentProps: {
        tutorID: this.id,
        tutorName: this.user.fullname,
      }
    });
    modal.onDidDismiss()
    .then((data) => {
       const response = data.data.isReported; // Here's your selected user!
      if(response === true)
      {
        this.alertMessage(this.translate.instant('messages.report'),this.translate.instant('messages.successreport')+ this.user.fullname);
      }else
      {
        this.alertMessage(this.translate.instant('messages.report'),this.translate.instant('messages.errorreporting'));
      }
    });
    await modal.present();
  }
  async alertMessage(header,message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header,
      message,
      buttons: [this.translate.instant('messages.ok')]
    });

    await alert.present();
  }
  async bookTutor(){
    //lets add the order to the DB
    const modal = await this.modalController.create({
      component: BookTutorPage,
      initialBreakpoint: 0.7,
      breakpoints: [0, 0.7, 1],
      presentingElement: await this.modalController.getTop(),
      componentProps: {
        tutorName: this.user.fullname,
      }
    });
    modal.onDidDismiss()
    .then(async (data) => {
      if(data.data.confirm)
      {
        const loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: this.translate.instant('messages.pleasewait')
        });
        await loading.present();
        const loginUser = await this.storage.get('user');
        const date = new Date(data.data.datetimeSelect);
        let hour = date.getUTCHours();
        let min = date.getUTCMinutes().toString().padStart(2, '0');
        let yourDate = new Date(date.getTime() + (1000 * 60 * 60 * data.data.durationSelect));
        const datas = {
          user_id: loginUser.user_id,
          tutor_id : this.user.user_id,
          duration : data.data.durationSelect,
          slot: date.getFullYear() + "-" + (1 + date.getMonth()).toString().padStart(2, '0') + "-"+date.getDate().toString().padStart(2, '0'),
          timefrom:  hour + ":" + min,
          timeto: yourDate.getUTCHours() + ":" + min,
          fullslot:  date.getFullYear() + "-" + (1 + date.getMonth()).toString().padStart(2, '0') + "-"+date.getDate().toString().padStart(2, '0')+'T'+hour+':00:00.136Z'
        };
        this.fetch.createSlot(datas).then(async (response) => {
          const json = JSON.parse(response.data).response;
          if(json.id){
            await loading.dismiss();
            this.alertMessage(this.translate.instant('messages.booking'),this.translate.instant('messages.bookingerror')+ this.user.fullname);
          }else if(json.results === "duplicate"){
            await loading.dismiss();
            this.alertMessage(this.translate.instant('messages.duplicate'),this.translate.instant('messages.duplicateerror'));
          }else{
            await loading.dismiss();
            this.alertMessage(this.translate.instant('messages.error'),this.translate.instant('messages.usererror'));
          }
        });
      }
    });
    await modal.present();
  } 
  dialNumber(){
    if(this.user.country == 'dz'){
      window.open('tel:+213'+this.user.phone, '_system');
    }else if(this.user.country == 'bh'){
        window.open('tel:+973'+this.user.phone, '_system');
    }else if(this.user.country == 'eg'){
        window.open('tel:+20'+this.user.phone, '_system');
    }else if(this.user.country == 'iq'){
        window.open('tel:+964'+this.user.phone, '_system');
    }else if(this.user.country == 'jo'){
        window.open('tel:+962'+this.user.phone, '_system');
    }else if(this.user.country == 'kw'){
        window.open('tel:+965'+this.user.phone, '_system');
    }else if(this.user.country == 'lb'){
        window.open('tel:+961'+this.user.phone, '_system');
    }else if(this.user.country == 'ly'){
        window.open('tel:+218'+this.user.phone, '_system');
    }else if(this.user.country == 'ma'){
        window.open('tel:+212'+this.user.phone, '_system');
    }else if(this.user.country == 'ps'){
        window.open('tel:+970'+this.user.phone, '_system');
    }else if(this.user.country == 'qa'){
        window.open('tel:+974'+this.user.phone, '_system');
    }else if(this.user.country == 'sa'){
        window.open('tel:+966'+this.user.phone, '_system');
    }else if(this.user.country == 'ss'){
        window.open('tel:+211'+this.user.phone, '_system');
    }else if(this.user.country == 'sd'){
        window.open('tel:+249'+this.user.phone, '_system');
    }else if(this.user.country == 'om'){
        window.open('tel:+968'+this.user.phone, '_system');
    }else if(this.user.country == 'sy'){
        window.open('tel:+963'+this.user.phone, '_system');
    }else if(this.user.country == 'tn'){
        window.open('tel:+216'+this.user.phone, '_system');
    }else if(this.user.country == 'ae'){
        window.open('tel:+971'+this.user.phone, '_system');
    }else if(this.user.country == 'ye'){
        window.open('tel:+967'+this.user.phone, '_system');
    }
  }
  sendEmail(){
    window.open('mailto:'+this.user.email, '_system');
  }
  
  sendWhatapp(){
   if(this.lang === 'en')
   {
    if(this.user.country == 'dz'){
      window.open('https://api.whatsapp.com/send?phone=+213'+this.user.phone+'&text=Hey%20there,%20found%20you%20on%20Tutrain%20App.%20I%20need%20your%20help?', '_system');
    }else if(this.user.country == 'bh'){
        window.open('https://api.whatsapp.com/send?phone=+973'+this.user.phone+'&text=Hey%20there,%20found%20you%20on%20Tutrain%20App.%20I%20need%20your%20help?', '_system');
    }else if(this.user.country == 'eg'){
        window.open('https://api.whatsapp.com/send?phone=+20'+this.user.phone+'&text=Hey%20there,%20found%20you%20on%20Tutrain%20App.%20I%20need%20your%20help?', '_system');
    }else if(this.user.country == 'iq'){
        window.open('https://api.whatsapp.com/send?phone=+964'+this.user.phone+'&text=Hey%20there,%20found%20you%20on%20Tutrain%20App.%20I%20need%20your%20help?', '_system');
    }else if(this.user.country == 'jo'){
        window.open('https://api.whatsapp.com/send?phone=+962'+this.user.phone+'&text=Hey%20there,%20found%20you%20on%20Tutrain%20App.%20I%20need%20your%20help?', '_system');
    }else if(this.user.country == 'kw'){
        window.open('https://api.whatsapp.com/send?phone=+965'+this.user.phone+'&text=Hey%20there,%20found%20you%20on%20Tutrain%20App.%20I%20need%20your%20help?', '_system');
    }else if(this.user.country == 'lb'){
        window.open('https://api.whatsapp.com/send?phone=+961'+this.user.phone+'&text=Hey%20there,%20found%20you%20on%20Tutrain%20App.%20I%20need%20your%20help?', '_system');
    }else if(this.user.country == 'ly'){
        window.open('https://api.whatsapp.com/send?phone=+218'+this.user.phone+'&text=Hey%20there,%20found%20you%20on%20Tutrain%20App.%20I%20need%20your%20help?', '_system');
    }else if(this.user.country == 'ma'){
        window.open('https://api.whatsapp.com/send?phone=+212'+this.user.phone+'&text=Hey%20there,%20found%20you%20on%20Tutrain%20App.%20I%20need%20your%20help?', '_system');
    }else if(this.user.country == 'ps'){
        window.open('https://api.whatsapp.com/send?phone=+970'+this.user.phone+'&text=Hey%20there,%20found%20you%20on%20Tutrain%20App.%20I%20need%20your%20help?', '_system');
    }else if(this.user.country == 'qa'){
        window.open('https://api.whatsapp.com/send?phone=+974'+this.user.phone+'&text=Hey%20there,%20found%20you%20on%20Tutrain%20App.%20I%20need%20your%20help?', '_system');
    }else if(this.user.country == 'sa'){
        window.open('https://api.whatsapp.com/send?phone=+966'+this.user.phone+'&text=Hey%20there,%20found%20you%20on%20Tutrain%20App.%20I%20need%20your%20help?', '_system');
    }else if(this.user.country == 'ss'){
        window.open('https://api.whatsapp.com/send?phone=+211'+this.user.phone+'&text=Hey%20there,%20found%20you%20on%20Tutrain%20App.%20I%20need%20your%20help?', '_system');
    }else if(this.user.country == 'sd'){
        window.open('https://api.whatsapp.com/send?phone=+249'+this.user.phone+'&text=Hey%20there,%20found%20you%20on%20Tutrain%20App.%20I%20need%20your%20help?', '_system');
    }else if(this.user.country == 'om'){
        window.open('https://api.whatsapp.com/send?phone=+968'+this.user.phone+'&text=Hey%20there,%20found%20you%20on%20Tutrain%20App.%20I%20need%20your%20help?', '_system');
    }else if(this.user.country == 'sy'){
        window.open('https://api.whatsapp.com/send?phone=+963'+this.user.phone+'&text=Hey%20there,%20found%20you%20on%20Tutrain%20App.%20I%20need%20your%20help?', '_system');
    }else if(this.user.country == 'tn'){
        window.open('https://api.whatsapp.com/send?phone=+216'+this.user.phone+'&text=Hey%20there,%20found%20you%20on%20Tutrain%20App.%20I%20need%20your%20help?', '_system');
    }else if(this.user.country == 'ae'){
        window.open('https://api.whatsapp.com/send?phone=+971'+this.user.phone+'&text=Hey%20there,%20found%20you%20on%20Tutrain%20App.%20I%20need%20your%20help?', '_system');
    }else if(this.user.country == 'ye'){
        window.open('https://api.whatsapp.com/send?phone=+967'+this.user.phone+'&text=Hey%20there,%20found%20you%20on%20Tutrain%20App.%20I%20need%20your%20help?', '_system');
    }
   }else if(this.lang === 'ar')
   {
    if(this.user.country == 'dz'){
      window.open('https://api.whatsapp.com/send?phone=+213'+this.user.phone+'&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D9%88%D8%AC%D8%AF%D8%AA%D9%83%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20Tutrain.%20%D8%A7%D9%86%D8%A7%20%D8%A8%D8%AD%D8%A7%D8%AC%D8%A9%20%D8%A7%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%83%D9%85%D8%9F', '_system');
    }else if(this.user.country == 'bh'){
        window.open('https://api.whatsapp.com/send?phone=+973'+this.user.phone+'&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D9%88%D8%AC%D8%AF%D8%AA%D9%83%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20Tutrain.%20%D8%A7%D9%86%D8%A7%20%D8%A8%D8%AD%D8%A7%D8%AC%D8%A9%20%D8%A7%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%83%D9%85%D8%9F', '_system');
    }else if(this.user.country == 'eg'){
        window.open('https://api.whatsapp.com/send?phone=+20'+this.user.phone+'&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D9%88%D8%AC%D8%AF%D8%AA%D9%83%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20Tutrain.%20%D8%A7%D9%86%D8%A7%20%D8%A8%D8%AD%D8%A7%D8%AC%D8%A9%20%D8%A7%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%83%D9%85%D8%9F', '_system');
    }else if(this.user.country == 'iq'){
        window.open('https://api.whatsapp.com/send?phone=+964'+this.user.phone+'&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D9%88%D8%AC%D8%AF%D8%AA%D9%83%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20Tutrain.%20%D8%A7%D9%86%D8%A7%20%D8%A8%D8%AD%D8%A7%D8%AC%D8%A9%20%D8%A7%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%83%D9%85%D8%9F', '_system');
    }else if(this.user.country == 'jo'){
        window.open('https://api.whatsapp.com/send?phone=+962'+this.user.phone+'&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D9%88%D8%AC%D8%AF%D8%AA%D9%83%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20Tutrain.%20%D8%A7%D9%86%D8%A7%20%D8%A8%D8%AD%D8%A7%D8%AC%D8%A9%20%D8%A7%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%83%D9%85%D8%9F', '_system');
    }else if(this.user.country == 'kw'){
        window.open('https://api.whatsapp.com/send?phone=+965'+this.user.phone+'&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D9%88%D8%AC%D8%AF%D8%AA%D9%83%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20Tutrain.%20%D8%A7%D9%86%D8%A7%20%D8%A8%D8%AD%D8%A7%D8%AC%D8%A9%20%D8%A7%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%83%D9%85%D8%9F', '_system');
    }else if(this.user.country == 'lb'){
        window.open('https://api.whatsapp.com/send?phone=+961'+this.user.phone+'&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D9%88%D8%AC%D8%AF%D8%AA%D9%83%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20Tutrain.%20%D8%A7%D9%86%D8%A7%20%D8%A8%D8%AD%D8%A7%D8%AC%D8%A9%20%D8%A7%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%83%D9%85%D8%9F', '_system');
    }else if(this.user.country == 'ly'){
        window.open('https://api.whatsapp.com/send?phone=+218'+this.user.phone+'&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D9%88%D8%AC%D8%AF%D8%AA%D9%83%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20Tutrain.%20%D8%A7%D9%86%D8%A7%20%D8%A8%D8%AD%D8%A7%D8%AC%D8%A9%20%D8%A7%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%83%D9%85%D8%9F', '_system');
    }else if(this.user.country == 'ma'){
        window.open('https://api.whatsapp.com/send?phone=+212'+this.user.phone+'&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D9%88%D8%AC%D8%AF%D8%AA%D9%83%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20Tutrain.%20%D8%A7%D9%86%D8%A7%20%D8%A8%D8%AD%D8%A7%D8%AC%D8%A9%20%D8%A7%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%83%D9%85%D8%9F', '_system');
    }else if(this.user.country == 'ps'){
        window.open('https://api.whatsapp.com/send?phone=+970'+this.user.phone+'&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D9%88%D8%AC%D8%AF%D8%AA%D9%83%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20Tutrain.%20%D8%A7%D9%86%D8%A7%20%D8%A8%D8%AD%D8%A7%D8%AC%D8%A9%20%D8%A7%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%83%D9%85%D8%9F', '_system');
    }else if(this.user.country == 'qa'){
        window.open('https://api.whatsapp.com/send?phone=+974'+this.user.phone+'&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D9%88%D8%AC%D8%AF%D8%AA%D9%83%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20Tutrain.%20%D8%A7%D9%86%D8%A7%20%D8%A8%D8%AD%D8%A7%D8%AC%D8%A9%20%D8%A7%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%83%D9%85%D8%9F', '_system');
    }else if(this.user.country == 'sa'){
        window.open('https://api.whatsapp.com/send?phone=+966'+this.user.phone+'&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D9%88%D8%AC%D8%AF%D8%AA%D9%83%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20Tutrain.%20%D8%A7%D9%86%D8%A7%20%D8%A8%D8%AD%D8%A7%D8%AC%D8%A9%20%D8%A7%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%83%D9%85%D8%9F', '_system');
    }else if(this.user.country == 'ss'){
        window.open('https://api.whatsapp.com/send?phone=+211'+this.user.phone+'&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D9%88%D8%AC%D8%AF%D8%AA%D9%83%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20Tutrain.%20%D8%A7%D9%86%D8%A7%20%D8%A8%D8%AD%D8%A7%D8%AC%D8%A9%20%D8%A7%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%83%D9%85%D8%9F', '_system');
    }else if(this.user.country == 'sd'){
        window.open('https://api.whatsapp.com/send?phone=+249'+this.user.phone+'&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D9%88%D8%AC%D8%AF%D8%AA%D9%83%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20Tutrain.%20%D8%A7%D9%86%D8%A7%20%D8%A8%D8%AD%D8%A7%D8%AC%D8%A9%20%D8%A7%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%83%D9%85%D8%9F', '_system');
    }else if(this.user.country == 'om'){
        window.open('https://api.whatsapp.com/send?phone=+968'+this.user.phone+'&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D9%88%D8%AC%D8%AF%D8%AA%D9%83%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20Tutrain.%20%D8%A7%D9%86%D8%A7%20%D8%A8%D8%AD%D8%A7%D8%AC%D8%A9%20%D8%A7%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%83%D9%85%D8%9F', '_system');
    }else if(this.user.country == 'sy'){
        window.open('https://api.whatsapp.com/send?phone=+963'+this.user.phone+'&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D9%88%D8%AC%D8%AF%D8%AA%D9%83%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20Tutrain.%20%D8%A7%D9%86%D8%A7%20%D8%A8%D8%AD%D8%A7%D8%AC%D8%A9%20%D8%A7%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%83%D9%85%D8%9F', '_system');
    }else if(this.user.country == 'tn'){
        window.open('https://api.whatsapp.com/send?phone=+216'+this.user.phone+'&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D9%88%D8%AC%D8%AF%D8%AA%D9%83%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20Tutrain.%20%D8%A7%D9%86%D8%A7%20%D8%A8%D8%AD%D8%A7%D8%AC%D8%A9%20%D8%A7%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%83%D9%85%D8%9F', '_system');
    }else if(this.user.country == 'ae'){
        window.open('https://api.whatsapp.com/send?phone=+971'+this.user.phone+'&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D9%88%D8%AC%D8%AF%D8%AA%D9%83%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20Tutrain.%20%D8%A7%D9%86%D8%A7%20%D8%A8%D8%AD%D8%A7%D8%AC%D8%A9%20%D8%A7%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%83%D9%85%D8%9F', '_system');
    }else if(this.user.country == 'ye'){
        window.open('https://api.whatsapp.com/send?phone=+967'+this.user.phone+'&text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%8C%20%D9%88%D8%AC%D8%AF%D8%AA%D9%83%20%D9%81%D9%8A%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%20Tutrain.%20%D8%A7%D9%86%D8%A7%20%D8%A8%D8%AD%D8%A7%D8%AC%D8%A9%20%D8%A7%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%83%D9%85%D8%9F', '_system');
    }
   }
  }
}
