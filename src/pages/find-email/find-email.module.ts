import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindEmailPage } from './find-email';

@NgModule({
  declarations: [
    FindEmailPage,
  ],
  imports: [
    IonicPageModule.forChild(FindEmailPage),
  ],
})
export class FindEmailPageModule {}
