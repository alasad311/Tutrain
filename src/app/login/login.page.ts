import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UsersService } from './../service/api/users.service';
import { StorageService } from './../service/storage/storage.service';
import { AlertController } from '@ionic/angular';
import { EventService } from ".././service/event.service"
import { PushNotifications,Token } from '@capacitor/push-notifications';
import { FetchService } from '../service/api/fetch.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public viewPassword = 'eye-outline';
  public showPassword = false;
  public isDisablied = false;
  public email;
  public password;
  pushToken: any;
  constructor(private fetch:FetchService,private router: Router,private event:EventService, private navCtrl: NavController,private userApi: UsersService,public alertController: AlertController, private storage : StorageService) { }

  ngOnInit() {
    PushNotifications.addListener('registration', (token: Token) => {
      this.pushToken = token.value
     })
    
  }
  goToHome() {
    this.isDisablied = true;
    if(this.email && this.password)
    {
      var data = {
        email:this.email,
        password:this.password
      }
      this.userApi.siginUser(data).then(async (response) => {
        var json = JSON.parse(response.data);
        if(json.response.results === false)
        {
          this.alertMessage("Error: #11","Email or password incorrect, did you forget your password? <a href='/forgot'>click here </a>","","");
          this.isDisablied = false;
        }
        else if(json.response.results === true && json.response.is_confirmed === true){
         
          if(this.pushToken === json.response.user[0].pushtoken)
          {
            await this.storage.set("user",json.response.user[0])
            this.event.publishSomeData(json.response.user[0])
             this.router.navigate(['/home']);
          }else{
            this.fetch.updateUserToken({pushtoken: this.pushToken,user_id:json.response.user[0].user_id}).then(async (response) => {
              var json = JSON.parse(response.data);
              await this.storage.set("user",json.response[0])
              this.event.publishSomeData(json.response[0])
              this.router.navigate(['/home']);
            })
          }
        }else if(json.response.results === true && json.response.is_confirmed === false)
        {
          if(this.pushToken === json.response.user[0].pushtoken)
          {
            await this.storage.set("user",json.response.user[0])
            this.alertMessage("Error: #9","Your email has been confirmed yet, to use the app full feature you need to confirm your email","","Resend").then(() => {
              this.router.navigate(['/home']);
            });
          }else{
            this.fetch.updateUserToken({pushtoken: this.pushToken,user_id:json.response.user[0].user_id}).then(async (response) => {
              var json = JSON.parse(response.data);
              await this.storage.set("user",json.response[0])
              this.alertMessage("Error: #9","Your email has been confirmed yet, to use the app full feature you need to confirm your email","","Resend").then(() => {
                this.router.navigate(['/home']);
              });
            })
          }
          this.isDisablied = false;
        }
      }).catch((error) => {
        this.alertMessage("Error: #1","Service seems offline or unavailable at the moment","","");
        this.isDisablied = false;
     });
     
    }else{
      this.isDisablied = false;
    }
  }
  goToRegister(){
    this.router.navigate(['/register']);
  }
  goToForgotPassword(){
    this.router.navigate(['/forgot']);
  }
  togglePassword(){
    if(this.viewPassword == 'eye-off-outline')
    {
      this.viewPassword = 'eye-outline'
      this.showPassword = false;
    }else
    {
      this.viewPassword = 'eye-off-outline'
      this.showPassword = true;
    }
  }
  async alertMessage(header,message,location,btn) {
    if(btn === "Resend")
    {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: header,
        message: message,
        buttons: [
          {
            text: 'ok',
            id: 'confirm-button',
            handler: () => {
              if(location)
              {
                this.router.navigate([location]);
              }
            }
          },
          {
            text: btn,
            id: 'confirm-button',
            handler: () => {
              this.userApi.sendVerification({email: this.email}).then((response) => {
                var json = JSON.parse(response.data);
                
                if(json.response.sent === false)
                {
                  this.alertMessage("Error: #2","An issue has happened kindly contact us at support@oman-dev.com","","");
                }
                else if(json.response.sent === true ){
                  this.alertMessage("Sent","Email has been sent again","","");
                }
              }).catch((error) => {
                this.alertMessage("Error: #1","Service seems offline or unavailable at the moment","","");
             });
            }
          }
        ]
      });
      await alert.present();
    }else{
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: header,
        message: message,
        buttons: [
          {
            text: 'ok',
            id: 'confirm-button',
            handler: () => {
              if(location)
              {
                this.router.navigate([location]);
              }
            }
          }
        ]
      });
      await alert.present();
    }
   
  }
}
