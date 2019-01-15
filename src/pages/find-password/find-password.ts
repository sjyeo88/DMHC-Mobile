import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App} from 'ionic-angular';
import { FindPasswordForm, ValidMsgs } from './find-password.form'
import { HomePage } from '../home/home'
import { AppServices } from '../../services/app.services';

/**
 * Generated class for the FindPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-find-password',
  templateUrl: 'find-password.html',
  providers: [FindPasswordForm]
})
export class FindPasswordPage {
  public validMsg = new ValidMsgs();
  public isPasswordQuest:boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fm: FindPasswordForm,
    public serv: AppServices,
    public app: App,
    public alertCtrl:AlertController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindPasswordPage');
  }

  getPasswordQuest() {
    if(this.email.valid && this.name.valid && this.phone.valid ) {
      let data = new FormData()
      data.append('email', this.email.value);
      data.append('name', this.name.value);
      data.append('phone', this.phone.value);
      this.serv.getPasswordQuest(data)
      .then(result=>{
        if(result.length !== 0) {
          this.password_q.patchValue(result[0].password_q)
          this.isPasswordQuest = true;
        } else {
          this.serv.msgServ({
            severity:'error',
            message: '입력하신 기본정보로 사용자 계정을 찾을 수 없습니다. 다시 한번 확인해 주세요.',
          });
        }
      })
      .catch(msg=>{
        this.serv.msgServ(msg);
      })
    } else {
      this.serv.msgServ({
        severity:'error',
        message:'입력이 완료되지 않은 항목이 있습니다.'
      });
    }
  }

  onFindPassword() {
    if(this.fm.fg.valid) {
      let data = new FormData()
      data.append('email', this.email.value);
      data.append('name', this.name.value);
      data.append('phone', this.phone.value);
      data.append('password_q', this.password_q.value);
      data.append('password_a', this.password_a.value);
      this.serv.onFindPassword(data)
      .then(result=>{
        switch(result.success) {
          case 0:
            let alert = this.alertCtrl.create({
              title: '임시비밀번호가 발급되었습니다.',
              subTitle: '회원님의 메일계정으로 임시 비밀번호가 발송되었습니다. 로그인 후 앱 내 설정 -> 계정정보 확인 및 변경에서 새 비밀번호로 변경바랍니다.',
              buttons: [{
                text:'로그인 화면으로 이동',
                handler:() =>{
                  (this.app.getRootNavById('n4') as any).setRoot(HomePage);
                }
              }]
            });
    alert.present();
          break;
          case 1:
            this.serv.msgServ({
              severity:'error',
              message: '입력하신 기본정보로 사용자 계정을 찾을 수 없습니다. 다시 한번 확인해 주세요.',
            });
          break;
          case 2:
            this.serv.msgServ({
              severity:'error',
              message: '비밀번호 질문/답변이 올바르지 않습니다. 다시 한번 확인해 주세요.',
            });
          break;
        }
      })
      .catch(msg=>{
        this.serv.msgServ(msg);
      })
    } else {
      this.serv.msgServ({
        severity:'error',
        message:'입력이 완료되지 않은 항목이 있습니다.'
      });
    }
  }

  get name() {
    return this.fm.fg.get('name');
  }
  get email() {
    return this.fm.fg.get('email');
  }
  get phone() {
    return this.fm.fg.get('phone');
  }
  get password_q() {
    return this.fm.fg.get('password_q');
  }
  get password_a() {
    return this.fm.fg.get('password_a');
  }
}
