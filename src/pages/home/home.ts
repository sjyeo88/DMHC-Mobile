import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AccessTermPage } from '../access-term/access-term'
import { MainPage } from '../main/main'
import { FindEmailPage } from '../find-email/find-email'
import { FindPasswordPage } from '../find-password/find-password'

import { LoginForm } from './home.form'
import { AppServices } from '../../services/app.services'
import { Platform } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm'
import { Diagnostic } from '@ionic-native/diagnostic'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [LoginForm],
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    public fm: LoginForm,
    public serv: AppServices,
    public platform: Platform,
    public alertCtrl:AlertController,
    private diagnostic:Diagnostic,
  ) {
    this.platform.ready()
    .then(()=>{
      this.checkAuth();
    })
  }

  ionViewDidLoad() {
  }

  goAccessTerm() {
    this.navCtrl.push(AccessTermPage);
  }

  goFindEmail() {
    this.navCtrl.push(FindEmailPage);
  }

  goFindPassword() {
    this.navCtrl.push(FindPasswordPage);
  }

  login() {
    let data = new FormData();
    data.append('email', this.email.value);
    data.append('password', this.password.value);
    this.serv.postLogin(data)
    .then(data=>{
      this.serv.storeUserCredentials(data.token);
      let fcm = new FCM()
      fcm.getToken()
      .then(token=>{
          token !== data.fcm_token ? this.serv.setFcmToken(token) : null;
      })
      this.navCtrl.push(MainPage);
    })
    .then(()=> {
      if(this.platform.is('cordova')) {
        this.serv.getPushConfig()
        .then(value=>{
          if(value.push === 0) {
            let alert1 = this.alertCtrl.create({
              title: '알림이 허용되지 않았습니다.',
              subTitle: '과제 알림을 허용하시겠습니까?',
              buttons: [
                {
                  text:'예',
                  handler: ()=>{
                    this.getNativePushNotification()
                    .then(value =>{
                      if(value) {
                        this.serv.onPushConfig()
                        .catch(err=>{ this.serv.msgServ(err) })
                      } else {
                        let alert2 = this.alertCtrl.create({
                          title: '알림이 허용되지 않았습니다.',
                          subTitle: '먼저 폰 환경설정에서 매일마음관리 앱의 알림을 허용 후 매일마음관리 설정 탭에서 다시 시도해주세요.',
                          buttons: [{ text:'OK'}]
                        });
                        alert2.present();
                      }
                    })
                  }
                },
                {
                  text:'아니오'
                }
              ]
            });
            alert1.present();
          }
        })
      }
    })
    .catch(msg=>{
      this.serv.msgServ(msg);
    })
  }

  checkAuth() {
    this.serv.chkAuth()
    .then(data =>{
      this.navCtrl.push(MainPage);
    })
    .catch(msg=>{
      console.log('not logedin')
      null
    })
  }

  getNativePushNotification() {
    return this.diagnostic.isRemoteNotificationsEnabled()
    .then(value => { return value })
    .catch(err => { console.error(err) })
  }

  get email() {
    return this.fm.log.get('email');
  }
  get password() {
    return this.fm.log.get('password');
  }
}
