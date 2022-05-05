import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UsersService } from './../service/api/users.service';
import { AlertController } from '@ionic/angular';

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
  constructor(private router: Router,private navCtrl: NavController,private userApi: UsersService,public alertController: AlertController) { }

  ngOnInit() {
  }
  goToHome() {
    if(this.email && this.password)
    {
      this.userApi.siginUser(this.email,this.password).then((response) => {
        var json = JSON.parse(response.data);
        if(json.results === "false")
        {
          this.alertMessage("Error: #11","Email or password incorrect, did you forget your password? <a href='/forgot'>click here </a>","");
          this.isDisablied = false;
        }
        else if(json.id){
          this.router.navigate(['/home']);
        }
      }).catch((error) => {
        this.alertMessage("Error: #1","Service seems offline or unavailable at the moment","");
        this.isDisablied = false;
     });
     
    }else{
      
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
  async alertMessage(header,message,location) {
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
