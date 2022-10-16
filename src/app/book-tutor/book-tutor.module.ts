import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookTutorPageRoutingModule } from './book-tutor-routing.module';

import { BookTutorPage } from './book-tutor.page';

@NgModule({
  imports: [
    CommonModule,
TranslateModule.forChild(),
    FormsModule,
    IonicModule,
    BookTutorPageRoutingModule
  ],
  declarations: [BookTutorPage]
})
export class BookTutorPageModule {}
