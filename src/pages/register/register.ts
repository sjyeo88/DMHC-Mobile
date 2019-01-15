import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ResgiterForm, ValidMsgs } from './register.form';
import { WelcomePage } from '../welcome/welcome'
import { Jobs, Dept } from './register.model';
import { AppServices } from '../../services/app.services'
import { FCM } from '@ionic-native/fcm'

import 'rxjs/add/operator/debounceTime.js';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [ResgiterForm, FCM],
})
export class RegisterPage {
  public validMsg = new ValidMsgs();
  public jobs:Jobs[] = [];
  public dept:Dept[] = [];
  public isUser:boolean = false;
  public foundExpert:boolean = true;
  public isPreDefinedExpert:boolean = false;
  public dupEXPERT:boolean = false;
  public idEXPERT_USER:number = 1;
  public isGettingExpert:boolean = false;
  public token:string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fm: ResgiterForm,
    public serv: AppServices,
    public app: App,
    private platform: Platform,
    fcm:FCM,
  ) {
    // this.serv.msgServ({title: 'Test', message: 'Test', severity:'error'});
    this.getJobList();
    this.getDeptList();

    if(this.platform.is('cordova')) {
      fcm.getToken()
      .then(token=>{
        this.token = token;
      })
    }

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

    this.isExpert.valueChanges
    .subscribe(data=>{
      this.isPreDefinedExpert = data;
      if(data) {
        this.expertGroup.enable()
      } else {
        this.expertGroup.disable()
        this.foundExpert=true;
      }
    })

    this.expertGroup.valueChanges
    .subscribe(data=>{
      this.isGettingExpert = true;
    })

    this.expertGroup.valueChanges
    .debounceTime(500)
    .subscribe(data=>{
      this.isGettingExpert = false;
      if(this.expertGroup.enabled) {
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
            this.idEXPERT_USER = data[0].idEXPERT_USER;
          }
        })
        .catch(msg => {
          this.serv.msgServ(msg);
        })
    }
  })
}

  getJobList() {
    this.serv.getJobList()
    .then(data=>{
      this.jobs = data;
    })
    .catch(msg=>{
      this.serv.msgServ(msg);
    })
  }

  getDeptList() {
    this.serv.getDeptList()
    .then(data=>{
      this.dept = data;
    })
    .catch(msg=>{
      this.serv.msgServ(msg);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  submit() {
    if(this.fm.reg.valid && !this.isUser && this.foundExpert) {
      let data = new FormData();
      data.append('name', this.name.value);
      data.append('idSBJT_CONF_ALL', '1');
      data.append('email', this.email.value);
      data.append('password', this.password.value);
      data.append('password_q', this.password_q.value);
      data.append('password_a', this.password_a.value);
      data.append('birth', this.birth.value);
      data.append('gender', this.gender.value);
      data.append('phone', this.phone.value);
      data.append('idEXPERT_USER', this.idEXPERT_USER.toString());
      data.append('fcm_token', this.token);
      this.serv.postRegister(data)
      .then(obj=>{
        (this.app.getRootNavById('n4') as any).setRoot(WelcomePage);
      })
      .catch(err=>{ this.serv.msgServ(err)})
    } else {
      console.log(this.fm.reg.valid, this.isUser, this.foundExpert)
      this.serv.msgServ({severity:'error', message:'미작성된 항목 혹은 형식에 맞지 않는 입력이 있습니다.'})
    }
  }

  get email() {
    return this.fm.reg.get('email');
  }
  get passwordGroup() {
    return this.fm.reg.get('passwordGroup');
  }
  get password() {
    return this.passwordGroup.get('password');
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
  get name() {
    return this.fm.reg.get('name');
  }
  get gender() {
    return this.fm.reg.get('gender');
  }
  get birth() {
    return this.fm.reg.get('birth');
  }
  get phone() {
    return this.fm.reg.get('phone');
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
}
