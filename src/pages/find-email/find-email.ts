import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppServices } from '../../services/app.services';
import { FindEmailForm, ValidMsgs } from './find-email.form'
import { contact } from '../../services/global';

/**
 * Generated class for the FindEmailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-find-email',
  templateUrl: 'find-email.html',
  providers: [FindEmailForm,]
})
export class FindEmailPage {
  public validMsg = new ValidMsgs();
  public resultMsg = {
    header:'',
    list:[],
    footer:'',
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fm: FindEmailForm,
    public serv: AppServices,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindEmailPage');
  }

  onFindEmail() {
    let data = new FormData()
    if(this.fm.fg.valid) {
      data.append('name', this.name.value);
      data.append('gender', this.gender.value);
      data.append('birth', this.birth.value);
      if(this.phone.value.length !== 0) { data.append('phone', this.phone.value); }
      this.serv.onFindEmail(data)
      .then(result=>{
      this.resultMsg = { header:'', list:[], footer:'', };
        if(result.length === 0) {
          this.resultMsg.header = ' 조건을 만족하는 E-mail을 찾을 수 없습니다.'
        } else if(result.length === 1){
          this.resultMsg.header = ' 조건을 만족하는 E-mail을 찾았습니다.'
          this.resultMsg.list[0] = result[0].email;
        } else {
          this.resultMsg.header = ' 조건을 만족하는 E-mail을 '+ result.length +'개 찾았습니다. '
          result.forEach(obj =>{
            let emailParsed = obj.email.split('@')
            this.resultMsg.list.push(emailParsed[0].slice(0, emailParsed[0].length-2) + '**@' +  emailParsed[1]);
          })
          this.resultMsg.footer = ' 완전한 이메일을 찾고 싶으시면 휴대폰 번호를 넣어 검색하시거나, 관리자 번호 (' + contact.phone + ') 로 연락바랍니다. '
        }
      })
      .catch(msg => {
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
  get gender() {
    return this.fm.fg.get('gender');
  }
  get phone() {
    return this.fm.fg.get('phone');
  }
  get birth() {
    return this.fm.fg.get('birth');
  }

}
