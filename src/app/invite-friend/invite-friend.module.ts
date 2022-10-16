import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InviteFriendPageRoutingModule } from './invite-friend-routing.module';

import { InviteFriendPage } from './invite-friend.page';

@NgModule({
  imports: [
    CommonModule,
TranslateModule.forChild(),
    FormsModule,
    IonicModule,
    InviteFriendPageRoutingModule
  ],
  declarations: [InviteFriendPage]
})
export class InviteFriendPageModule {}
