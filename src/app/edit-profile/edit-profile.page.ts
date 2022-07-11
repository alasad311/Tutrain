import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';
import { Camera, CameraResultType,CameraSource } from '@capacitor/camera';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


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
  internationalCode:any;
  imageUrl:any;
  country:any;
  user: any;
  isSubmitted = false;
  isDisablied = false;
  profile:any;
  profileUpdate: FormGroup;
  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService,
    public alertController: AlertController,public loadingController: LoadingController,public util: UtilService,
    private router: Router,public formBuilder: FormBuilder) { }

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
      this.profileUpdate = this.formBuilder.group({
          fullname: [this.profile.fullname, [Validators.required, Validators.minLength(2)]],
          phone: [this.profile.phone, [Validators.required, Validators.minLength(7), Validators.pattern('^[0-9]+$')]],
          dob: [this.profile.dateofbirth],
        }
      );
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
  get errorControl() {
    return this.profileUpdate.controls;
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
  updateProfile(){
    //lets begin updateing
    this.isSubmitted = true;
    this.isDisablied = true;
    if (!this.profileUpdate.valid) {
      this.isDisablied = false;
      return false;
    } else {
      let data = JSON.parse(JSON.stringify(this.profileUpdate.value));
      if(data.dob === this.profile.dateofbirth)
      {
        delete data.dob
      }
      if(this.imageUrl !== this.profile.picture)
      {
        data.picture = this.imageUrl;
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
        delete data.fullname
      }
      if(data)
      {
        this.fetch.updateUser(this.profile.user_id,data).then((response) => {
          const json = JSON.parse(response.data);
          // if(json.code === 'ER_DUP_ENTRY')
          // {
          //   this.alertMessage('Error: #12','Email exisits, did you forget your password? <a href=\'/forgot\'>click here </a>','');
          //   this.isDisablied = false;
          // }
          // else if(json.id){
          //   this.alertMessage('Welcome','Your account has been created <br /> check your email to confirm your account','login');
          // }
        }).catch((error) => {
          //this.alertMessage('Error: #1','Service seems offline or unavailable at the moment','');
          this.alertMessage("Nothing","Nothing to be updated!")
          this.isDisablied = false;
       });
      }else{
        this.isDisablied = false;
        return false;
      }
    }
  }
  selectPicture = async () => {

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    });
    this.imageUrl = image.webPath;
  }
  ionViewDidLeave() {
    this.util.refreshUserData();
  }
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
