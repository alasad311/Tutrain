import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public flagImage = '/assets/flag/om.svg';
  public viewPassword_1 = 'eye-outline';
  public viewPassword_2 = 'eye-outline';
  public showPassword_1 = false;
  public showPassword_2 = false;
  internationalCode = "+968";
  constructor(private router: Router) { 
    
  }  
  ngOnInit() {
  }
  goToLogin(){
    this.router.navigate(['/login']);
  }
  goToAddress(){
    this.router.navigate(['/address']);
  }
  getSelectCountry(countryCode){
    this.flagImage = '/assets/flag/'+countryCode+'.svg'
    
    if(countryCode == "om"){
      this.internationalCode = "+968";
    }else if(countryCode == "kw"){
      this.internationalCode = "+965";
    }else if(countryCode == "sa"){
      this.internationalCode = "+966";
    }else if(countryCode == "qa"){
      this.internationalCode = "+974";
    }else if(countryCode == "iq"){
      this.internationalCode = "+964";
    }else if(countryCode == "bh"){
      this.internationalCode = "+973";
    }else if(countryCode == "ae"){
      this.internationalCode = "+971";
    }
  }

  togglePassword(id){
    if(id == 1)
    {
      if(this.viewPassword_1 == 'eye-off-outline')
      {
        this.viewPassword_1 = 'eye-outline'
        this.showPassword_1 = false;
      }else
      {
        this.viewPassword_1 = 'eye-off-outline'
        this.showPassword_1 = true;
      }
    }else if(id == 2)
    {
      if(this.viewPassword_2 == 'eye-off-outline')
      {
        this.viewPassword_2 = 'eye-outline'
        this.showPassword_2 = false;
      }else
      {
        this.viewPassword_2 = 'eye-off-outline'
        this.showPassword_2 = true;

      }
    }
  }

}
