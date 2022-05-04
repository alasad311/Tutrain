import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from './../service/api/users.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
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
  public type = "student";
  isSubmitted = false;
  isDisablied = false;
  userRegistration: FormGroup;
  public confirm_password;
  internationalCode = "+968";
  constructor(private router: Router,private userApi: UsersService,public formBuilder: FormBuilder) { 
    
  }  
  ngOnInit() {
    this.userRegistration = this.formBuilder.group({
      fullname: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      password: ['', Validators.compose([Validators.minLength(8),Validators.required,
     ])],
     confirm_password: ['', Validators.required],
     type : ['',Validators.required]
    },
    {validator: RegisterPage.confirmed('password','confirm_password')}
    );
    this.userRegistration.controls['type'].setValue('student');
  }
  static confirmed = (controlName: string, matchingControlName: string) => {
    return (control: AbstractControl): ValidationErrors | null => {
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
  }
  goToLogin(){
    this.router.navigate(['/login']);
  }
  goToAddress(){
    this.router.navigate(['/address']);
  }
  get errorControl() {
    return this.userRegistration.controls;
  }
  getSelectCountry(e){
    this.flagImage = '/assets/flag/'+e.target.value+'.svg'
    
    if(e.target.value == "om"){
      this.internationalCode = "+968";
    }else if(e.target.value == "kw"){
      this.internationalCode = "+965";
    }else if(e.target.value == "sa"){
      this.internationalCode = "+966";
    }else if(e.target.value == "qa"){
      this.internationalCode = "+974";
    }else if(e.target.value == "iq"){
      this.internationalCode = "+964";
    }else if(e.target.value == "bh"){
      this.internationalCode = "+973";
    }else if(e.target.value == "ae"){
      this.internationalCode = "+971";
    }
  }
  createAccount(){
    this.isSubmitted = true;
    this.isDisablied = true;
    if (!this.userRegistration.valid) {
      this.isDisablied = false;
      return false;
    } else {
      var data = JSON.stringify(this.userRegistration.value);
      console.log(data);
      this.userApi.createUser(data).subscribe(
        Response => {
          if(Response) {
          console.log(Response.id)
          }
        },
        error => {
          alert(error.status)
          this.isDisablied = false;
          // always good practice to handle errors from HTTP observables
        }
      );
    }
  
  }
  setHiddenValue(type){
    this.userRegistration.controls['type'].setValue(type)
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
