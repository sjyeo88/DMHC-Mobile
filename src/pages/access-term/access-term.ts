import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AccessTermForm } from './access-term.form';
import { PersonInfoPage } from '../person-info/person-info'
import { UsecasePage } from '../usecase/usecase'
import { RegisterPage } from '../register/register'
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the AccessTermPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-access-term',
  templateUrl: 'access-term.html',
  providers: [ AccessTermForm ],
})
export class AccessTermPage {

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public fm: AccessTermForm,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccessTermPage');
  }

  onAllAgree() {
    if(this.allAgree.value) {
      this.usecase.patchValue(true);
      this.personInfo.patchValue(true);
    } else {
      this.usecase.patchValue(false);
      this.personInfo.patchValue(false);
    }
  }

  goPersonDetail() {
    this.navCtrl.push(PersonInfoPage);
  }
  goUseDetail() {
    this.navCtrl.push(UsecasePage);
  }
  goRegister() {
    if(this.usecase.value && this.personInfo.value) {
      this.navCtrl.push(RegisterPage);
    } else {
      let alert = this.alertCtrl.create({
        title: '이용약관 미동의',
        subTitle: '이용약관에 동의하지 않으셨습니다.',
        buttons: ['OK'],
      })
      alert.present();
    }
  }


  chkTermsAgree() {
    if(this.usecase.value && this.personInfo.value) {
      this.allAgree.patchValue(true);
    } else {
      this.allAgree.patchValue(false);
    }
  }

  get usecase() {
    return this.fm.termAgree.get('usecase')
  }
  get allAgree() {
    return this.fm.termAgree.get('allAgree')
  }

  get personInfo() {
    return this.fm.termAgree.get('personInfo')
  }
}
