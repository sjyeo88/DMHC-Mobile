import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AppServices } from '../../services/app.services'
import { App } from 'ionic-angular'
import { HomePage } from '../home/home'
import { AboutPage } from '../about/about'
import { UserPage } from '../user/user'
import { PersonInfoPage } from '../person-info/person-info'
import { UsecasePage } from '../usecase/usecase'
import { Diagnostic } from '@ionic-native/diagnostic'

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  public isNativeNotificaiton:boolean = true;
  public isNotificaiton:boolean = true;
  public isPushLoaded = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public serv: AppServices,
    public app: App,
    public alertCtrl:AlertController,
    private diagnostic:Diagnostic,
  ) {
  }

  ionViewDidLoad() {
    // this.setPushNotification();
    // this.getNativePushNotification()
  }

  ionViewDidEnter() {
    this.setPushNotification();
    this.getNativePushNotification()
  }

  getNativePushNotification() {
    return this.diagnostic.isRemoteNotificationsEnabled()
    .then(value => { return this.isNativeNotificaiton = value })
    .catch(err => { console.error(err) })
  }

  setPushNotification() {
    Promise.all([this.serv.getPushConfig(), this.getNativePushNotification()])
    .then(values=>{
      if(values[0].push === 1 && values[1]) {
        return true;
      } else {
        return false;
      }
    })
    .then(obj=>{
      this.isNotificaiton = obj;
      this.isPushLoaded = true;
    })
    .catch(err=>{ this.serv.msgServ(err) })
  }

  togglePushNotification() {
    if(this.isPushLoaded) {
      if(!this.isNotificaiton) {
        this.serv.offPushConfig()
        .catch(err=>{ this.serv.msgServ(err) })
      } else {
        this.getNativePushNotification()
        .then(value =>{
          if(value) {
            this.serv.onPushConfig()
            .catch(err=>{ this.serv.msgServ(err) })
          } else {
            let alert = this.alertCtrl.create({
              title: '알림이 허용되지 않았습니다.',
              subTitle: '폰 환경설정에서 매일마음관리 앱의 알림을 허용해주세요.',
              buttons: ['OK']
            });
            alert.present();
            this.isNotificaiton = false;
          }

        })
      }
    }
  }

  onLogOut() {
    this.serv.offPushConfig()
    .catch(err=>{ this.serv.msgServ(err) })
    this.serv.destroyUserCredentials()
    .then(()=>{
      (this.app.getRootNavById('n4') as any).setRoot(HomePage);
    })

  }


  confirmSignOut() {
    let confirm = this.alertCtrl.create({
      title: '탈퇴 확인',
      message: '매일마음관리 탈퇴 시 수행 하셨던 과제, 미수행 과제 및 설문 결과 등이 모두 삭제됩니다 탈퇴하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel'
        },
        {
          text: '탈퇴하기',
          handler: () => {
            this.onSignOut()
          }
        }
      ]
    });
    confirm.present();
  }

  onSignOut() {
    this.serv.onSignOut()
    .then(()=>{
      (this.app.getRootNavById('n4') as any).setRoot(HomePage);
      this.serv.destroyUserCredentials()
    })
    .catch(err=>{ this.serv.msgServ(err) })
  }

  onMoveAbout() {
    this.navCtrl.push(AboutPage);
  }
  onPersonalPage() {
    this.navCtrl.push(UserPage);
  }
  onMovePersonInfo() {
    this.navCtrl.push(PersonInfoPage);
  }
  onMoveUsecase() {
    this.navCtrl.push(UsecasePage);
  }

}
