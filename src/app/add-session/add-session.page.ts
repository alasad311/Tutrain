import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController, ModalController, AlertController } from '@ionic/angular';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';
import { Camera, CameraResultType,CameraSource } from '@capacitor/camera';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-session',
  templateUrl: './add-session.page.html',
  styleUrls: ['./add-session.page.scss'],
})
export class AddSessionPage implements OnInit {
  @Input() sessionID: any;
  session: any;
  contest: any;
  contestBadge: any;
  isSubmitted = false;
  isDisablied = false;
  sessionAdd: UntypedFormGroup;
  startDateInput: any;
  imageData: any;
  imageUrl: any;
  date = new Date();
  toDay: any;
  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService
    ,public util: UtilService,public loadingController: LoadingController, public modalController: ModalController
    ,public alertController: AlertController,public formBuilder: UntypedFormBuilder,public translate: TranslateService) { 
      this.date.setDate(this.date.getDate() + 1);
      this.toDay = this.date.getFullYear()+ '-' + (1 + this.date.getMonth()).toString().padStart(2, '0') + '-' +
      this.date.getDate().toString().padStart(2, '0')
    }
  get errorControl() {
    return this.sessionAdd.controls;
  }
  async ngOnInit() {
    this.sessionAdd = this.formBuilder.group({
      sessionname: ['', [Validators.required]],
      sessionlocation: ['', [Validators.required]],
      sessiondescription: ['',  [Validators.required]],
      sessiontag: ['',  [Validators.required]],
      sessionduration: ['',  [Validators.required, Validators.pattern('^[0-9]+$')]],
      sessionprice:  ['',[Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,3})?$')]],
      sessionlang: ['',[Validators.required]],
      sessionseats: ['',[Validators.required, Validators.pattern('^[0-9]+$')]],
      sessionagenda: ['',  [Validators.required]],
      startdate : ['', [Validators.required]],
      enddate: ['', [Validators.required]],
      sessionmap: ['']
    });
  }
  goBackHome(data){
    this.modalController.dismiss(data);
  }
  async updateSession(){
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: this.translate.instant('messages.updatingsession')
    });
    await loading.present();
    //lets begin updateing
    this.isSubmitted = true;
    this.isDisablied = true;
    if (!this.sessionAdd.valid && !this.imageData) {
      this.isDisablied = false;
      await loading.dismiss();
      return false;
    } else {
      const data = JSON.parse(JSON.stringify(this.sessionAdd.value));
      this.fetch.createSession(data,this.imageData).then(async (response) => {
        if(response.response.results == 'success')
        {
          await loading.dismiss();
          this.alertMessage(this.translate.instant('messages.updated'),'Session updated successfully!');
          this.goBackHome({
            dismissed : true
          });
        }else{
          await loading.dismiss();
          this.alertMessage(this.translate.instant('messages.error'),this.translate.instant('messages.coudntupdate'));
          this.isDisablied = false;
        }
      }).catch(async (error) => {
        //this.alertMessage('Error: #1','Service seems offline or unavailable at the moment','');
        await loading.dismiss();
        this.alertMessage(this.translate.instant('messages.error'),this.translate.instant('messages.coudntupdate'));
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
      buttons: [this.translate.instant('messages.ok')]
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
