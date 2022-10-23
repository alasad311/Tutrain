import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController, ModalController, AlertController } from '@ionic/angular';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';
import { Camera, CameraResultType,CameraSource } from '@capacitor/camera';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.page.html',
  styleUrls: ['./edit-session.page.scss'],
})
export class EditSessionPage implements OnInit {
  @Input() sessionID: any;
  session: any;
  contest: any;
  contestBadge: any;
  isSubmitted = false;
  isDisablied = false;
  sessionUpdate: FormGroup;
  startDateInput: any;
  imageData: any;
  imageUrl: any;
  date = new Date();
  toDay: any;
  lang: any;
  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService
    ,public util: UtilService,public loadingController: LoadingController, public modalController: ModalController
    ,public alertController: AlertController,public formBuilder: FormBuilder,private globalization: Globalization,
    public translate: TranslateService) { 
      this.date.setDate(this.date.getDate() + 1);
      this.toDay = this.date.getFullYear()+ '-' + (1 + this.date.getMonth()).toString().padStart(2, '0') + '-' +
      this.date.getDate().toString().padStart(2, '0')
    }
  get errorControl() {
    return this.sessionUpdate.controls;
  }
  async ngOnInit() {
    await this.globalization.getPreferredLanguage().then(async (res) =>{
      const language = res.value.split('-');
      this.lang = language[0];
    });
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: this.translate.instant('message.pleasewaitsession')
    });
    await loading.present();
    this.fetch.getSessionDetails(this.sessionID).then( async (response) =>{
      this.session = JSON.parse(response[0].data).response[0];
      this.startDateInput = this.getActualDate(this.session.startdate);
      this.sessionUpdate = this.formBuilder.group({
        sessionname: [this.session.session_name, [Validators.required]],
        sessionlocation: [this.session.location, [Validators.required]],
        sessiondescription: [this.session.description,  [Validators.required]],
        sessiontag: [this.session.tags,  [Validators.required]],
        sessionduration: [this.session.duration,  [Validators.required, Validators.pattern('^[0-9]+$')]],
        sessionprice:  [this.session.price],
        sessionlang: [this.session.lang],
        sessionseats: [this.session.seats],
        sessionagenda: [this.session.agenda,  [Validators.required]],
        startdate : [this.getActualDate(this.session.startdate), [Validators.required]],
        enddate: [this.getActualDate(this.session.enddate), [Validators.required]],
        sessionmap: [this.session.map]
      });
      await loading.dismiss();
    });
  }
  goBackHome(data){
    this.modalController.dismiss(data);
  }
  async updateSession(){
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: this.translate.instant('message.updatingsession')
    });
    await loading.present();
    //lets begin updateing
    this.isSubmitted = true;
    this.isDisablied = true;
    if (!this.sessionUpdate.valid) {
      this.isDisablied = false;
      await loading.dismiss();
      return false;
    } else {
      const data = JSON.parse(JSON.stringify(this.sessionUpdate.value));
      this.fetch.updateSession(this.sessionID,data,this.imageData).then(async (response) => {
        if(response.response.results == 'success')
        {
          await loading.dismiss();
          this.alertMessage(this.translate.instant('message.updated'),this.translate.instant('message.sessionupdated'));
          this.goBackHome({
            dismissed : true
          });
        }else{
          await loading.dismiss();
          this.alertMessage(this.translate.instant('message.error'),this.translate.instant('message.couldntupdatesession'));
          this.isDisablied = false;
        }
      }).catch(async (error) => {
        //this.alertMessage('Error: #1','Service seems offline or unavailable at the moment','');
        await loading.dismiss();
        this.alertMessage(this.translate.instant('message.error'),this.translate.instant('message.couldntupdatesession'));
        this.isDisablied = false;
     });

    }
  }
  getActualDate(date)
  {
    const newdate = new Date(date);
      return newdate.getFullYear() + '-' + (1 + newdate.getMonth()).toString().padStart(2, '0') + '-' +
      newdate.getDate().toString().padStart(2, '0');
  }
  setMinEndDate(){
    const startDateInput = (document.getElementById('startDateInput') as HTMLInputElement);
    this.startDateInput = this.getActualDate(startDateInput.value);
  }
  changeImage = async () => {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      presentationStyle: 'fullscreen'
    });
    this.imageUrl = image.webPath;
    this.imageData = image;
  };
  async alertMessage(header,message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header,
      message,
      buttons: [this.translate.instant('message.ok')]
    });

    await alert.present();
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
