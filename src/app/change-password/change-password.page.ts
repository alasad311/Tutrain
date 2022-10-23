import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FetchService } from '../service/api/fetch.service';
import { StorageService } from '../service/storage/storage.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  contest: any;
  contestBadge: any;
  passwordChange: FormGroup;
  isSubmitted = false;
  isDisablied = false;
  user:any;
  constructor(private navCtrl: NavController,private storage: StorageService,private fetch: FetchService,
    public alertController: AlertController,public loadingController: LoadingController,public util: UtilService,
    private router: Router,public formBuilder: FormBuilder,public translate: TranslateService) { }

  async ngOnInit() {
   
    this.passwordChange = this.formBuilder.group({
        newpassword: ['',  [Validators.minLength(8),Validators.required]],
        confirmnewpassword: ['', [Validators.minLength(8),Validators.required]],
        oldpassword: ['', [Validators.required]],
      },
      {validator: ChangePasswordPage.confirmed('newpassword','confirmnewpassword')}
    );
    this.user = await this.storage.get('user');
  }
  goBackHome(){
    this.navCtrl.back();
  }
  async ionViewDidEnter() {
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
  changePassword(){
    this.isSubmitted = true;
    this.isDisablied = true;
    if (!this.passwordChange.valid) {
      this.isDisablied = false;
      return false;
    } else {
      let data = JSON.parse(JSON.stringify(this.passwordChange.value));
      this.alertMessageWithBtn(this.translate.instant('message.areyousure'),"",data)

    }
    
  }
  get errorControl() {
    return this.passwordChange.controls;
  }
  static confirmed = (controlName: string, matchingControlName: string) => (control: AbstractControl): ValidationErrors | null => {
    const input = control.get(controlName);
    const matchingInput = control.get(matchingControlName);

    if (input === null || matchingInput === null) {
        return null;
    }

    if (matchingInput?.errors && !matchingInput.errors.confirmedValidator) {
        return null;
    }

    if (input.value !== matchingInput.value) {
        matchingInput.setErrors({ confirmedValidator: true });
        return ({ confirmedValidator: true });
    } else {
        matchingInput.setErrors(null);
        return null;
    }
  };
  async alertMessageWithBtn(header,message,data) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: [
        {
          text: this.translate.instant('message.ok'),
          id: 'confirm-button',
          handler: async () => {
            this.fetch.changeUserPassword(this.user.user_id,data).then(async (response) => {
              const result = JSON.parse(response.data).response;
              if(result)
              {
                this.isDisablied = false;
               this.alertMessageWithoutBtn(this.translate.instant('message.changed'),this.translate.instant('message.passwordupdated'));
               this.goBackHome();
              }else{
                this.isDisablied = false;
                this.alertMessageWithoutBtn(this.translate.instant('message.error'),this.translate.instant('message.passworddoesntmatch'));
              }
      
            }).catch((error) => {
              this.isDisablied = false;
              this.alertMessageWithoutBtn(this.translate.instant('message.error'),this.translate.instant('message.couldntprocess'));
            });
            
          }
        },{
          text: this.translate.instant('message.cancel'),
          id: 'cancel-button',
          handler: () => {
            alert.dismiss();
            this.isDisablied = false;
          }
        }
      ]
    });

    await alert.present();
  }
  async alertMessageWithoutBtn(header,message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: [this.translate.instant('message.ok')]
    });

    await alert.present();
  }
}
