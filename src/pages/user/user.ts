import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserForm, ValidMsgs } from './user.form';
import { AppServices } from '../../services/app.services';


/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

enum ChangeContent {
    email,
    gender,
    birth,
    phone,
    password,
    passwordQa,
    expert,
}

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
  providers: [UserForm,]
})
export class UserPage {
  public validMsg = new ValidMsgs();
  public jobs = [];
  public dept = [];
  public isUser:boolean = true;
  public applyType = ChangeContent;
  public isPreDefinedExpert:boolean = false;
  public dupEXPERT:boolean = false;
  public foundExpert:boolean = false;
  public idEXPERT_USER:number
  public idEXPERT_USER_Origin:number
  public isGettingExpert:boolean = false;
  public isChangedExpertUser:boolean = false;



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fm: UserForm,
    public serv:AppServices,
    public alertCtrl:AlertController,
  ) {
  }

  ionViewDidLoad() {
    this.getUserInform();
  }


  getUserInform() {
    Promise.all([
      this.serv.getJobList(),
      this.serv.getDeptList(),
      this.serv.getUserInform()
    ])
    .then(values => {
      this.jobs = values[0];
      this.dept = values[1];
      console.log(values)
      return values[2]
    })
    .then(user => {
      this.email.patchValue(user.email);
      this.password_q.patchValue(user.password_q);
      this.password_a.patchValue(user.password_a);
      this.email.patchValue(user.email);
      this.name.patchValue(user.name);
      this.gender.patchValue(user.gender);
      this.birth.patchValue(user.birth);
      this.phone.patchValue(user.phone);
      this.expert_name.patchValue(user.e_name);
      this.expert_dept.patchValue(user.idDEPT);
      this.expert_job.patchValue(user.idJOBS);
      this.idEXPERT_USER_Origin = user.idEXPERT_USER;
    })

    this.email.valueChanges
    .debounceTime(500)
    .subscribe(data=>{
      this.serv.getPatientList(data)
      .then(data=>{
        if(data.length > 0) {
          this.isUser = true;
        } else {
          this.isUser = false;
        }
      })
    });

    this.expertGroup.valueChanges
    .subscribe(data=>{
      this.isGettingExpert = true;
    })
    this.expertGroup.valueChanges
    .debounceTime(500)
    .subscribe(data=>{
      this.isGettingExpert = false;
      let postData = new FormData();
      postData.append('name', data.expert_name)
      postData.append('idJOBS', data.expert_job)
      postData.append('idDEPT', data.expert_dept)
      this.serv.getExpertList(postData)
      .then(data => {
        if(data.length === 0) {
          this.foundExpert = false;
        } else if(data.length > 1) {
          this.foundExpert = true;
          this.dupEXPERT = true;
        } else {
          this.foundExpert = true;
          this.dupEXPERT = false;
          this.idEXPERT_USER = data[0].idEXPERT_USER;
          console.log('origin', this.idEXPERT_USER_Origin)
          if(data[0].idEXPERT_USER === this.idEXPERT_USER_Origin) {
            this.isChangedExpertUser = false;
          } else {
            this.isChangedExpertUser = true;
          }
        }
      })
      .catch(msg => {
        this.serv.msgServ(msg);
      })
    })
  }

  checkPassword(data) {
    return new Promise((resolve, reject) => {
      let password = new FormData()
      password.append('password', data)
      this.serv.checkPassword(password)
      .then(data=>{
        resolve(data ? true : false)
      })
      .catch(err =>{
        this.serv.msgServ(err);
      })
    })
  }

  confirmAlert(type) {
    let placeHoder = '비밀번호를 입력해주세요'
    let apply:Function;
    let form
    let errMsg = '입력이 모두 완료되지 않았습니다.'
    switch(type) {
      case this.applyType.email:
        form = this.email;
        apply = ()=>{ this.putEmail() };
      break;
      case this.applyType.gender:
        form = this.gender;
        apply = ()=>{ this.putGender() };
      break;
      case this.applyType.birth:
        form = this.birth;
        apply = ()=>{ this.putBirth() };
      break;
      case this.applyType.phone:
        form = this.phone;
        apply = ()=>{ this.putPhone() };
      break;
      case this.applyType.password:
        form = this.passwordGroup;
        apply = ()=>{ this.putNewPassword() };
        placeHoder = '기존 비밀번호를 입력해주세요'
      break;
      case this.applyType.passwordQa:
        form = this.password_a;
        apply = ()=>{ this.putPasswordQA() };
      break;
      case this.applyType.expert:
        form = this.expertGroup;
        apply = ()=>{ this.putExpert() };
      break;
    }

    let alert = this.alertCtrl.create({
      title: '비밀번호 확인',
      inputs: [
        {
          name: 'password',
          placeholder: placeHoder,
          type: 'password'
        }
      ],
      buttons: [
        {
          text: '취소',
          role: 'cancel',
        },
        {
          text: '확인',
          handler: data => {
            this.checkPassword(data.password)
            .then(result=>{
              if(result) {
                apply();
              } else {
                this.serv.msgServ({severity:'error', message:'비밀번호가 올바르지 않습니다. '});
              }
            })
          }
        }]
    });

    if(form.valid) {
      console.log(form);
      if(type === this.applyType.email && this.isUser) {
        this.serv.msgServ({severity:'error', message:'이미 가입된 메일입니다'});
      } else if(type === this.applyType.expert && (!this.foundExpert || this.dupEXPERT)){
        this.serv.msgServ({severity:'error', message:'담당 선생님을 찾을 수 없습니다.'});
      } else if(type === this.applyType.expert && !this.isChangedExpertUser){
        this.serv.msgServ({severity:'error', message:'기존 담당선생님과 동일합니다.'});
      } else {
        alert.present();
      }
    } else {
      this.serv.msgServ({severity:'error', message:errMsg});
    }
  }

  putEmail() {
    let data = new FormData();
    data.append('email', this.email.value);
    this.serv.putUserEmail(data)
    .then(result=>{
      this.serv.msgServ({severity:'success', message:'이메일이 변경되었습니다.'})
    })
    .catch(err => { this.serv.msgServ(err)})
  }

  putGender() {
    let data = new FormData();
    data.append('gender', this.gender.value);
    this.serv.putUserGender(data)
    .then(result=>{
      this.serv.msgServ({severity:'success', message:'성별이 변경되었습니다.'})
    })
    .catch(err => { this.serv.msgServ(err)})
  }

  putBirth() {
    let data = new FormData();
    data.append('birth', this.birth.value);
    this.serv.putUserBirth(data)
    .then(result=>{
      this.serv.msgServ({severity:'success', message:'생년월일이 변경되었습니다.'})
    })
    .catch(err => { this.serv.msgServ(err)})
  }

  putPhone() {
    let data = new FormData();
    data.append('phone', this.phone.value);
    this.serv.putUserPhone(data)
    .then(result=>{
      this.serv.msgServ({severity:'success', message:'휴대폰 번호가 변경되었습니다.'})
    })
    .catch(err => { this.serv.msgServ(err)})
  }

  putNewPassword () {
    let data = new FormData();
    // data.append('name', this.name.value);
    data.append('newPassword', this.newPassword.value);
    this.serv.putNewPassword(data)
    .then(result=>{
      this.serv.msgServ({severity:'success', message:'비밀번호가 변경되었습니다.'})
    })
    .catch(err => { this.serv.msgServ(err)})
  }

  putPasswordQA () {
    let data = new FormData();
    data.append('password_q', this.password_q.value);
    data.append('password_a', this.password_a.value);
    this.serv.putPasswordQA(data)
    .then(result=>{
      this.serv.msgServ({severity:'success', message:'비밀번호 질문/답변이 변경되었습니다.'})
    })
    .catch(err => { this.serv.msgServ(err)})
  }

  putExpert() {
    this.serv.putExpert(this.idEXPERT_USER)
    .then(result=>{
      this.serv.msgServ({
        severity:'success',
        message:'담당 선생님이 변경되었습니다. 담당 선생님이 회원님의 과제를 선택한 후 부터 과제가 제시됩니다.'
      })
    })
    .catch(err => { this.serv.msgServ(err) })
  }

  get userInfoGroup() {
    return this.fm.reg.get('userInfoGroup');
  }
  get email() {
    return this.userInfoGroup.get('email');
  }
  get name() {
    return this.userInfoGroup.get('name');
  }
  get gender() {
    return this.userInfoGroup.get('gender');
  }
  get birth() {
    return this.userInfoGroup.get('birth');
  }
  get phone() {
    return this.userInfoGroup.get('phone');
  }

  get passwordGroup() {
    return this.fm.reg.get('passwordGroup');
  }
  get password() {
    return this.passwordGroup.get('password');
  }
  get newPassword() {
    return this.passwordGroup.get('newPassword');
  }
  get passwordCheck() {
    return this.passwordGroup.get('passwordCheck');
  }
  get password_q() {
    return this.fm.reg.get('password_q');
  }
  get password_a() {
    return this.fm.reg.get('password_a');
  }

  get expertGroup() {
    return this.fm.reg.get('expertGroup');
  }
  get isExpert() {
    return this.fm.reg.get('isExpert');
  }
  get expert_name() {
    return this.expertGroup.get('expert_name');
  }
  get expert_dept() {
    return this.expertGroup.get('expert_dept');
  }
  get expert_job() {
    return this.expertGroup.get('expert_job');
  }
}
