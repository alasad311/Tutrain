import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';
import { Camera, CameraResultType,CameraSource } from '@capacitor/camera';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventService } from '../service/event.service';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { VideoEditor } from '@awesome-cordova-plugins/video-editor/ngx';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  contest: any;
  contestBadge: any;
  tutor = false;
  student = true;
  internationalCode: any;
  imageUrl: any;
  imageData: any;
  imageMime: any;
  country: any;
  user: any;
  isSubmitted = false;
  isDisablied = false;
  profile: any;
  degree: any;
  gov: any;
  uploadVideo: any;
  introvideoURL: any;
  profileUpdate: FormGroup;
  hideVideo: any;
  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService,
    public alertController: AlertController,public loadingController: LoadingController,public util: UtilService,
    private router: Router,public formBuilder: FormBuilder,private event: EventService,private sanitizer: DomSanitizer,
    private chooser: Chooser, private filePath: FilePath,private videoEditor: VideoEditor) { }
  get errorControl() {
    return this.profileUpdate.controls;
  }
  async ngOnInit() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait loading profile...'
    });
    await loading.present();
    this.user = await this.storage.get('user');

    if(this.user.type == 'student')
    {
      this.student = true;
      this.tutor = false;
    }else {
      this.tutor = true;
      this.student = false;
    }

    this.fetch.getUserDetailByID(this.user.user_id).then(async (response) => {
      this.profile = JSON.parse(response.data).response[0];
      this.country = this.profile.country;
      this.imageUrl = this.profile.picture;
      this.degree = this.profile.degree;
      this.gov = this.profile.governorate;
      if(this.profile.introvideo)
      {
        this.hideVideo = true;
      }
      if(this.profile.type == 'student')
      {
        this.profileUpdate = this.formBuilder.group({
          fullname: [this.profile.fullname, [Validators.required, Validators.minLength(2)]],
          phone: [this.profile.phone, [Validators.required, Validators.minLength(7), Validators.pattern('^[0-9]+$')]],
          dob: [this.profile.dateofbirth],
        });
      }else{
        this.profileUpdate = this.formBuilder.group({
          fullname: [this.profile.fullname, [Validators.required, Validators.minLength(2)]],
          phone: [this.profile.phone, [Validators.required, Validators.minLength(7), Validators.pattern('^[0-9]+$')]],
          deg: [this.profile.degree,  [Validators.required]],
          spec: [this.profile.specialization,  [Validators.required]],
          address: [this.profile.address,  [Validators.required]],
          about:  [this.profile.about,  [Validators.required]],
          tags: [this.profile.tags , [Validators.required]],
          isemail: [this.profile.is_email,  [Validators.required]],
          isphone: [this.profile.is_phone,  [Validators.required]],
          iswhatsapp: [this.profile.is_whatapp,  [Validators.required]],
          hourcost : [this.profile.hour_price, [Validators.required, Validators.pattern('^([0-9]+\.?[0-9]*|\.[0-9]+)$')]],
          dob: [this.profile.dateofbirth],
        });
      }
      if(this.profile.country == 'om'){
        this.internationalCode = '+968';
      }else if(this.profile.country == 'kw'){
        this.internationalCode = '+965';
      }else if(this.profile.country == 'sa'){
        this.internationalCode = '+966';
      }else if(this.profile.country == 'qa'){
        this.internationalCode = '+974';
      }else if(this.profile.country == 'iq'){
        this.internationalCode = '+964';
      }else if(this.profile.country == 'bh'){
        this.internationalCode = '+973';
      }else if(this.profile.country == 'ae'){
        this.internationalCode = '+971';
      }
      await loading.dismiss();
    }).catch((error) => {

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
  async updateProfile(){
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait updating profile...'
    });
    await loading.present();
    //lets begin updateing
    this.isSubmitted = true;
    this.isDisablied = true;
    if (!this.profileUpdate.valid) {
      this.isDisablied = false;
      await loading.dismiss();
      return false;
    } else {
      const data = JSON.parse(JSON.stringify(this.profileUpdate.value));
      if(data.dob === this.profile.dateofbirth)
      {
        delete data.dob;
      }
      if(this.country !== this.profile.country)
      {
        data.country = this.country;
      }
      if(data.phone === this.profile.phone)
      {
        delete data.phone;
      }
      if(data.fullname === this.profile.fullname)
      {
        delete data.fullname;
      }
      if(data)
      {
        if(this.uploadVideo)
        {
          this.fetch.uploadBio(this.profile.user_id,this.uploadVideo).then(async (response) => {

          });
        }
        this.fetch.updateUser(this.profile.user_id,data,this.imageData).then(async (response) => {
          if(response.response.results == 'success')
          {
            await loading.dismiss();
            this.alertMessage('Updated','Profile updated successfully!');
            this.storage.clear();
            this.storage.set('user',response.response.user[0]);
            this.event.publishSomeData(response.response.user[0]);
            this.goBackHome();
          }else{
            await loading.dismiss();
            this.alertMessage('Error','Couldn\'t update your profile, try again later!');
            this.isDisablied = false;
          }


        }).catch(async (error) => {
          //this.alertMessage('Error: #1','Service seems offline or unavailable at the moment','');
          await loading.dismiss();
          this.alertMessage('Error','Couldn\'t update your profile, try again later!');
          this.isDisablied = false;
       });
      }else{
        await loading.dismiss();
        this.alertMessage('Nothing','Nothing to be updated!');
        this.isDisablied = false;
        return false;
      }
    }
  }
  selectPicture = async () => {
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

  ionViewDidLeave() {
    this.util.refreshUserData();
  }
  introVideo = async () => {
    let mainVideo = <HTMLMediaElement>document.getElementById('introVideoTag');
    this.hideVideo = null;
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait while we load the video...'
    });
    await this.chooser.getFile('video/*')
    .then(
      async file =>{
        await loading.present();
        this.hideVideo = true;
        this.uploadVideo = file;
        this.introvideoURL = this.sanitizer.bypassSecurityTrustUrl(
          Capacitor.convertFileSrc(file.dataURI)
        )
        mainVideo.play();
        mainVideo.pause();
      }).catch((error: any) => console.error(error));
      await loading.dismiss();
  };
  getSelectCountry(e){
    if(e.target.value == 'om'){
      this.internationalCode = '+968';
    }else if(e.target.value == 'kw'){
      this.internationalCode = '+965';
    }else if(e.target.value == 'sa'){
      this.internationalCode = '+966';
    }else if(e.target.value == 'qa'){
      this.internationalCode = '+974';
    }else if(e.target.value == 'iq'){
      this.internationalCode = '+964';
    }else if(e.target.value == 'bh'){
      this.internationalCode = '+973';
    }else if(e.target.value == 'ae'){
      this.internationalCode = '+971';
    }
  }
  async alertMessage(header,message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
