import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsecasePage } from './usecase';

@NgModule({
  declarations: [
    UsecasePage,
  ],
  imports: [
    IonicPageModule.forChild(UsecasePage),
  ],
})
export class UsecasePageModule {}
