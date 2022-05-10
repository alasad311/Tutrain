import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { StorageService } from './../storage/storage.service';


@Injectable()
export class AuthGuardService implements CanActivate {
    user:any;
    subscribe(arg0: (state: any) => void) {
      throw new Error('Method not implemented.');
    }
    constructor(
      public storage: StorageService
        ) {}
    async isAuthenicated(){
      const user = await this.storage.get("user");
      if(user)
        return true
      else
        return false;
    }
    canActivate(): boolean {
      if(this.isAuthenicated())
      {
        return true
      }else{
        return false;
      }
      
    }

}