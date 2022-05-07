import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { StorageService } from './../storage/storage.service';


@Injectable()
export class AuthGuardService implements CanActivate {
    subscribe(arg0: (state: any) => void) {
      throw new Error('Method not implemented.');
    }
    constructor(
      public storage: StorageService
        ) {}
    async isAuthenicated(){
      const email = await this.storage.get("email");
      return email
    }
    canActivate(): boolean {
     
      if(this.isAuthenicated())
      {
        return true;
      }else{
        return false;
      }
      
    }

}