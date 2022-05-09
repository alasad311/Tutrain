import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UsersService } from './../service/api/users.service';
import { StorageService } from './../service/storage/storage.service';
import { AlertController } from '@ionic/angular';
import { EventService } from ".././service/event.service"

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
  constructor(private router: Router,private event:EventService, private navCtrl: NavController,private userApi: UsersService,public alertController: AlertController, private storage : StorageService) { }

  ngOnInit() {}
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
        console.log(json)
        if(json.response.results === false)
        {
          this.alertMessage("Error: #11","Email or password incorrect, did you forget your password? <a href='/forgot'>click here </a>","","");
          this.isDisablied = false;
        }
        else if(json.response.results === true && json.response.is_confirmed === true){
         await this.storage.set("id",json.response.user[0].id);
         await this.storage.set("email",json.response.user[0].email);
         await this.storage.set("fullname",json.response.user[0].fullname);
         await this.storage.set("dateofbirth",json.response.user[0].dateofbirth);
         await this.storage.set("type",json.response.user[0].type);
         await this.storage.set("country",json.response.user[0].country);
         await this.storage.set("phone",json.response.user[0].phone);
         await this.storage.set("picture",json.response.user[0].picture);
         await this.storage.set("degree",json.response.user[0].degree);
         await this.storage.set("specialization_id",json.response.user[0].specialization_id);
         await this.storage.set("governorate_id",json.response.user[0].governorate_id);
         await this.storage.set("wilayat_id",json.response.user[0].wilayat_id);
         await this.storage.set("id_card",json.response.user[0].id_card);
         await this.storage.set("about",json.response.user[0].about);
         await this.storage.set("membership",json.response.user[0].membership);
         await this.storage.set("is_active",json.response.user[0].is_active);
         this.event.publishSomeData(json.response.user[0])
          this.router.navigate(['/home']);
        }else if(json.response.results === true && json.response.is_confirmed === false)
        {
          await this.storage.set("id",json.response.user[0].id);
          await this.storage.set("email",json.response.user[0].email);
          await this.storage.set("fullname",json.response.user[0].fullname);
          await this.storage.set("dateofbirth",json.response.user[0].dateofbirth);
          await this.storage.set("type",json.response.user[0].type);
          await this.storage.set("country",json.response.user[0].country);
          await this.storage.set("phone",json.response.user[0].phone);
          await this.storage.set("picture",json.response.user[0].picture);
          await this.storage.set("degree",json.response.user[0].degree);
          await this.storage.set("specialization_id",json.response.user[0].specialization_id);
          await this.storage.set("governorate_id",json.response.user[0].governorate_id);
          await this.storage.set("wilayat_id",json.response.user[0].wilayat_id);
          await this.storage.set("id_card",json.response.user[0].id_card);
          await this.storage.set("about",json.response.user[0].about);
          await this.storage.set("membership",json.response.user[0].membership);
          await this.storage.set("is_active",json.response.user[0].is_active);
          this.alertMessage("Error: #9","Your email has been confirmed yet, to use the app full feature you need to confirm your email","","Resend").then(() => {
            this.router.navigate(['/home']);
          });
            
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
  test(){
    console.log("Clicked now we can reset password from app")
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
