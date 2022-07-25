import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController, NavController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from './storage/storage.service';
import { FetchService } from './api/fetch.service';
@Injectable({
  providedIn: 'root'
})
export class UtilService {
  loader: any;
  isLoading = false;
  contestCss = false;
  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public router: Router,
    private navCtrl: NavController,
    private menuController: MenuController,
    private storage: StorageService,
    private fetch: FetchService
  ) {
  }
  openMenu() {
    this.menuController.open();
  }
  async openContest(){
    const user = await this.storage.get('user');
    const contest = await this.checkContest();
    if(contest){
      if(user.membership){
      this.navCtrl.navigateForward(['/contest/'+contest.id]);
      }else{
        this.navCtrl.navigateForward(['/subscription']);
      }
    }else{
      this.navCtrl.navigateForward(['/winners']);
    }
  }
  /*
  Start Loader
  Call this method to Start your Loader
  */
  async show() {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      // duration: 5000,
      spinner: 'dots',
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }
  async refreshUserData(){
    const user = await this.storage.get('user');
    await this.fetch.getUserDetailByID(user.user_id).then(async (response) => {
      const checkUser = JSON.parse(response.data).response[0];
      if(checkUser.is_active == 0)
      {
        this.storage.clear();
        this.navCtrl.navigateForward(['/welcome']);
      }
    }).catch((error) => {
    });

  }
  async checkContest(){
    return await this.fetch.getContest().then(async (response) => {
      const contest = JSON.parse(response.data).response[0];
      return contest;
    }).catch((error) => {
    });

  }
  success_msg(title) {
    // Swal.fire({
    //   icon: 'success',
    //   title: title,
    //   showConfirmButton: false,
    //   timer: 1500
    // });
  }
  async hide() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }
  /*
    Show Warning Alert Message
    param : msg = message to display
    Call this method to show Warning Alert,
    */
  async showWarningAlert(header,msg) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: msg,
      buttons: ['ok']
    });
    await alert.present();
  }
  async showSimpleAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: 'warning',
      message: msg,
      buttons: ['ok']
    });
    await alert.present();
  }
  /*
   Show Error Alert Message
   param : msg = message to display
   Call this method to show Error Alert,
   */
  async showErrorAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: msg,
      buttons: ['ok']
    });
    await alert.present();
  }
  /*
     param : email = email to verify
     Call this method to get verify email
     */
  async getEmailFilter(email) {
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!(emailfilter.test(email))) {
      const alert = await this.alertCtrl.create({
        header: 'warning',
        message: 'Please enter valid email',
        buttons: ['ok']
      });
      await alert.present();
      return false;
    } else {
      return true;
    }
  }
  /*
    Show Toast Message on Screen
     param : msg = message to display, color= background
      color of toast example dark,danger,light. position  = position of message example top,bottom
     Call this method to show toast message
     */
  async showToast(msg, color, positon) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color,
      position: positon
    });
    toast.present();
  }
  async errorToast(msg, color?) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: color ? 'dark' : 'light'
    });
    toast.present();
  }
  apiErrorHandler(err) {

  }
}
