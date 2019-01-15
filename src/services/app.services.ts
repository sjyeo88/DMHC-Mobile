import { Req2 } from './http/Req2'
import { Injectable } from '@angular/core'
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular'
import { NativeStorage } from '@ionic-native/native-storage'


@Injectable()
export class AppServices {
  public token:string
  public fcm_token:string
  constructor(
    public toast:ToastController,
    public platform:Platform,
    public storage:NativeStorage,
  ) {
  }
  request(method, url, data?:FormData):Promise<any>{
    return new Promise((resolve, reject)=>{
    let http = new Req2(method, url)
    if (!this.platform.is('cordova')) {
      let token = window.localStorage.getItem('auth')
      this.token = token;
      if(data) {
        http.send(data, token ? {key:'cred', value: token} : {key:'cred', value: null});
      } else {
        http.send(null,  token ? {key:'cred', value: token} :  {key:'cred', value: null});
      }
    } else {
       this.storage.getItem('auth')
       .then(token => {
         this.token = token
         http.send(data ? data : null, token ? {key:'cred', value: token} : null);
      })
      .catch(msg=>{
        http.send(data ? data : null, {key:'cred', value: null});
      })
    }
    http.Complete = ()=> {
      resolve(http.response);
    }
    http.AuthErr = () =>{ reject(http.amsgs)}
    http.ServErr = () =>{ reject(http.smsgs)}
    http.ConErr = () =>{ reject(http.cmsgs)}
    })
  }

  getPatientList(email):Promise<{idPATIENT_USER:string}[]>{
      return new Promise((resolve, reject)=>{
        if(email !== '') {
          this.request('post', '/data/register/patient/' + email)
          .then(data=>{ resolve(JSON.parse(data)); })
          .catch(msg=>{ reject(msg); });
        } else {
          resolve([]);
        }
      });
  }


  getExpertList(data:FormData):Promise<{idEXPERT_USER:number, email:string}[]>{
    return new Promise((resolve, reject)=>{
      this.request('post', '/data/register/experts', data)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    });
  }

  getDeptList():Promise<{idDEPT:number, name:string}[]>{
    return new Promise((resolve, reject)=>{
      this.request('get', '/data/register/depts')
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    });
  }

  getJobList():Promise<{idJOBS:number, name:string}[]>{
    return new Promise((resolve, reject)=>{
      this.request('get', '/data/register/jobs')
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    });
  }

  postRegister(data:FormData):Promise<any>{
    return new Promise((resolve, reject)=>{
      this.request('post', '/auth/register', data)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    });
  }

  postLogin(data:FormData):Promise<any>{
    return new Promise((resolve, reject)=>{
      this.request('post', '/auth/local', data)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    });
  }

  setFcmToken(token):Promise<any>{
    return new Promise((resolve, reject)=>{
      let data = new FormData()
      data.append('fcm_token', token)
      console.log(token)
      this.request('put', '/auth/fcm', data)
      .then(data=>{ resolve(data); })
      .catch(msg=>{ reject(msg); });
    });
  }

  chkAuth():Promise<any>{
    return new Promise((resolve, reject)=>{
      this.request('get', '/auth/check')
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    });
  }

  getAssignByDate(date:Date):Promise<any>{
    return new Promise((resolve, reject)=>{
      this.request('get', '/data/assign/date/' + date.toISOString())
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    });
  }

  putRepushAssign(idSBJTS, status):Promise<any>{
    return new Promise((resolve, reject)=>{
      this.request('put', '/data/assign/repush/' + idSBJTS + '/' + status)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    });
  }

  putSimpleAnswer(data: FormData):Promise<any>{
    return new Promise((resolve, reject)=>{
      this.request('put', '/data/assign/simple', data)
      // .then(data=>{ resolve(JSON.parse(data)); })
      .then(data=>{ resolve(data); })
      .catch(msg=>{ reject(msg); });
    });
  }

  getSimpleAnswer(idSBJTS):Promise<any>{
    return new Promise((resolve, reject)=>{
      this.request('get', '/data/assign/simple/' + idSBJTS)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    });
  }

  getAssign(idSBJTS):Promise<any>{
    return new Promise((resolve, reject)=>{
      this.request('get', '/data/assign/' + idSBJTS)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    });
  }



  getSurveyUnit(idSB_SBJT_CONF):Promise<any>{
    return new Promise((resolve, reject)=>{
      this.request('get', '/data/assign/survey/' + idSB_SBJT_CONF)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    });
  }

  postSurveyResult(data:FormData):Promise<any>{
    return new Promise((resolve, reject)=>{
      this.request('post', '/data/assign/survey', data)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    });
  }

  putAssignResult(data:FormData, idSBJTS):Promise<any>{
    return new Promise((resolve, reject)=>{
      this.request('put', '/data/assign/normal/'+ idSBJTS, data)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    });
  }

  putLectureResult(idSBJTS):Promise<any>{
    return new Promise((resolve, reject)=>{
      this.request('put', '/data/assign/lecture/'+ idSBJTS)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    });
  }

  getLectureInform(idSB_SBJT_CONF):Promise<any>{
    return new Promise((resolve, reject)=>{
      this.request('get', '/data/assign/lecture/' + idSB_SBJT_CONF)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    });
  }

  getLecturePDF(title):Promise<any>{
    return new Promise((resolve, reject)=>{
      this.request('get', '/data/assign/lecture/pdf/' + title)
      .then(data=>{ resolve(data); })
      .catch(msg=>{ reject(msg); });
    });
  }

  getLectureHTML(idLECTURE):Promise<any>{
    return new Promise((resolve, reject)=>{
      this.request('get', '/data/assign/lecture/html/' + idLECTURE)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    });
  }

  getAssignResult():Promise<any>{
    return new Promise((resolve, reject)=>{
      this.request('get', '/data/assign/result/all')
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    });
  }

  getSurveyResult(year):Promise<any>{
    return new Promise((resolve, reject)=>{
      this.request('get', '/data/survey/result/all/' + year)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    });
  }

  getPushConfig():Promise<any> {
    return new Promise((resolve, reject)=>{
      this.request('get', '/data/push')
      .then(data=>{ resolve(JSON.parse(data)[0]); })
      .catch(msg=>{ reject(msg); });
    });
  }

  onPushConfig():Promise<string> {
    return new Promise((resolve, reject) =>{
      this.request('put', '/data/push/on')
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    })
  }

  offPushConfig():Promise<string> {
    return new Promise((resolve, reject) =>{
      this.request('put', '/data/push/off')
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    })
  }

  getUserInform():Promise<any>{
    return new Promise((resolve, reject)=>{
      this.request('get', '/data/user')
      .then(data=>{ resolve(JSON.parse(data)[0]); })
      .catch(msg=>{ reject(msg); });
    });
  }

  putUserEmail(data):Promise<string> {
    return new Promise((resolve, reject) =>{
      this.request('put', '/data/user/email', data)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    })
  }


  putUserGender(data):Promise<string> {
    return new Promise((resolve, reject) =>{
      this.request('put', '/data/user/gender', data)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    })
  }

  putUserBirth(data):Promise<string> {
    return new Promise((resolve, reject) =>{
      this.request('put', '/data/user/birth', data)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    })
  }

  putUserPhone(data):Promise<string> {
    return new Promise((resolve, reject) =>{
      this.request('put', '/data/user/phone', data)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    })
  }

  putNewPassword(data):Promise<string> {
    return new Promise((resolve, reject) =>{
      this.request('put', '/auth/new_password', data)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    })
  }

  putPasswordQA(data):Promise<string> {
    return new Promise((resolve, reject) =>{
      this.request('put', '/data/user/password/qa', data)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    })
  }

  putExpert(idEXPERT_USER):Promise<string> {
    return new Promise((resolve, reject) =>{
      this.request('put', '/data/user/expert/' + idEXPERT_USER)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    })
  }

  checkPassword(data):Promise<string> {
    return new Promise((resolve, reject) =>{
      this.request('post', '/auth/password', data)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    })
  }


  onSignOut():Promise<string> {
    return new Promise((resolve, reject) =>{
      this.request('delete', '/auth/signout')
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    })
  }

  onFindEmail(data):Promise<Array<{email:string}>> {
    return new Promise((resolve, reject) =>{
      this.request('post', '/auth/email', data)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    })
  }

  getPasswordQuest(data):Promise<any> {
    return new Promise((resolve, reject) =>{
      this.request('post', '/auth/password/quest', data)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    })
  }

  onFindPassword(data):Promise<{success:number}> {
    return new Promise((resolve, reject) =>{
      this.request('post', '/auth/reconfig/password', data)
      .then(data=>{ resolve(JSON.parse(data)); })
      .catch(msg=>{ reject(msg); });
    })
  }

  msgServ(msg) {
      let toast = this.toast.create({
        message: msg.message,
        duration: 2000,
        position:'top',
        cssClass: msg.severity == 'error' ? 'toast-error' : 'toast-success'
      })
      toast.present();
  }


  storeUserCredentials(token):void  {
    this.token = token;
    if (!this.platform.is('cordova')) {
      window.localStorage.setItem('auth', token);
    } else {
      this.storage.setItem('auth', token)
      .then(
        () => { console.log('stored'); },
        error => console.error('Error storing item', error)
      )
    }
  }

  storeFcmToken(token):void {
    if (!this.platform.is('cordova')) {
      window.localStorage.setItem('fcm_token', token);
    } else {
      this.storage.setItem('fcm_token', token)
      .then(
        () => { console.log('stored'); },
        error => console.error('Error storing item', error)
      )
    }
  }



  loadFcmToken():Promise<any>{
    return new Promise(resolve => {
      if (this.platform.is('cordova')) {
        this.storage.getItem('fcm_token')
        .then(
          data => { this.fcm_token = data },
          error => { resolve(false) }
        )
      }
    })
  }

  destroyUserCredentials():Promise<any> {
    return new Promise((resolve, reject)=>{
      if (!this.platform.is('cordova')) {
        window.localStorage.clear()
      } else {
        this.storage.clear();
      };
      resolve(true);
    })

  }

}
