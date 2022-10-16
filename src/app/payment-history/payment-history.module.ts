import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentHistoryPageRoutingModule } from './payment-history-routing.module';

import { PaymentHistoryPage } from './payment-history.page';

@NgModule({
  imports: [
    CommonModule,
TranslateModule.forChild(),
    FormsModule,
    IonicModule,
    PaymentHistoryPageRoutingModule
  ],
  declarations: [PaymentHistoryPage]
})
export class PaymentHistoryPageModule {}
