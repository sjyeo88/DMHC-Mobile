//Test
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Keyboard } from '@ionic-native/keyboard';

import { AssignForm } from './assign.form';
import { AppServices } from '../../services/app.services';
import { environment } from '../../services/environment'



/**
 * Generated class for the AssignPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-assign',
  templateUrl: 'assign.html',
  providers: [ AssignForm ]
})
export class AssignPage {
  public now = new Date();
  public cuDate = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());
  public today = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());
  public photoLoaded:boolean= true;
  public isPhoto:boolean = false;
  public cameraOption:CameraOptions = {
    quality: 50,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,
    targetWidth: 300,
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
  }

  public params = this.navParams.data
  public assign:any = {};
  public table = [];
  public tableResult = [];
  public emojiPickerView:boolean = false;
  public survey = {
    title:'',
    data:[],
    texts:[],
    result:[],
    score:0,
  }
  public answer = []
  public lecture;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public tts: TextToSpeech,
    public fm: AssignForm,
    public serv: AppServices,
    public sanitizer: DomSanitizer,
    private camera: Camera,
    private keyboard: Keyboard,
  ) {
  }

  ionViewDidLoad() {
    console.log(this.params);
    console.log('ionViewDidLoad AssignPage');
  }

  ionViewDidEnter() {
    switch(this.params.type) {
      case 0:
        this.getAssign();
        break;
      case 1:
        this.getSurveyUnit();
        break;
      case 2:
        this.getLectureInform();
        break;
    }
  }

  getElaspedDate(date:Date) {
    let elaspedDate = Math.floor((this.today.getTime() - date.getTime())/(1000*3600*24)) + 1;
    switch(elaspedDate) {
      case 0:
        return {icon:'custom-smile', msg:'오늘의 과제입니다'};
      case 1:
        return {icon:'custom-hesitate', msg:'1일이 지났네요'};
      case 2:
        return {icon:'custom-serious', msg:'2일이 지났네요'};
      default:
        return {icon:'custom-crying', msg:'3일 이상 지났네요'};
    }
  }


  getSimpleAnswer() {
    this.serv.getSimpleAnswer(this.params.idSBJTS)
    .then(data=>{
      console.log(data);
    })
    .catch(msg => {
      this.serv.msgServ(msg);
    })
  }

  getAssign() {
    this.serv.getAssign(this.params.idSBJTS)
    .then(data=>{
      this.assign = data[0];
      if(this.assign.type_input === 0) {
        this.genAnswerList(this.assign.conf_input_02)
        .then(table=>{
          this.answer = table;
          this.tableResult = JSON.parse(JSON.stringify(this.answer));
          for(let i = 1; i < this.table.length; i++) {
            for(let j = 1; j < this.table[0].length; j++) {
              this.tableResult[i][j] = ""
            }
          }
        })
      }
      if(this.assign.type_input === 3) {
        this.genTimeTable(this.assign.conf_input_03)
        .then(table=>{
          this.table = table
          this.tableResult = JSON.parse(JSON.stringify(table));
          for(let i = 1; i < this.table.length; i++) {
            for(let j = 1; j < this.table[0].length; j++) {
              this.tableResult[i][j] = ""
            }
          }
        })
      }
      if(this.assign.type_input === 2) {
        this.table = this.genWeekScheduleTable()
        this.tableResult = JSON.parse(JSON.stringify(this.table));
        for(let i = 1; i < this.table.length; i++) {
          for(let j = 1; j < this.table[0].length; j++) {
            this.tableResult[i][j] = ""
          }
        }
      }
      if(this.assign.type_input === 4) {
        this.table = this.genWeekResultTable()
        this.tableResult = JSON.parse(JSON.stringify(this.table));
        for(let i = 1; i < this.table.length; i++) {
          for(let j = 1; j < this.table[0].length; j++) {
            this.tableResult[i][j] = ""
          }
        }
      }
      if(this.assign.type_input === 5) {
        this.table = JSON.parse(this.assign.conf_input_04);
        this.tableResult = JSON.parse(this.assign.conf_input_04);
        for(let i = 1; i < this.table.length; i++) {
          for(let j = 1; j < this.table[0].length; j++) {
            this.tableResult[i][j] = ""
          }
        }
      }
      return data;
    })
    .then(data=>{
      if(this.params.status === 1) {
        this.tableResult = JSON.parse(this.params.result);
        console.log(JSON.parse(this.params.result));
        if(this.assign.conf_input_01 === 1) {
          setTimeout(()=>{
            let canvas = <HTMLCanvasElement> document.getElementById('assign-img');
            let ctx = canvas.getContext('2d')
            let image = new Image();
            image.src = environment.apiUrl + '/data/assign/normal/img/' + this.params.idSBJTS
            image.onload = ()=>{
              canvas.height = image.height*(canvas.width/image.width);
              ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
              this.isPhoto = true;
            }
          }, 200)
        }
      }
    })
    .catch(msg => {
      this.serv.msgServ(msg);
    })
  }

  getSurveyUnit() {
    this.serv.getSurveyUnit(this.params.idSB_SBJT_CONF)
    .then(data=>{
      console.log(data);
      this.survey.title = data[0].title;
      this.survey.data = data;
      for(let i=1; i <= data[0].measure; i++ ) {
        this.survey.texts.push(data[0]['text0' + i.toString()])
      }
      this.survey.data.map(obj=>{
        return obj.result = 1;
      })
      this.getSurveyScore()
      .then(score=>{
        this.survey.score = score;
      });
    })
    .catch(msg => {
      this.serv.msgServ(msg);
    })
  }


  getSurveyScore():Promise<number>{
    return new Promise((resolve)=>{
      let score = this.survey.data.reduce((prevObj, obj, idx)=>{
        if(obj.num === idx && obj.type === 1) {
          return prevObj + (obj.measure + 1) - obj.result
        }
        return prevObj + obj.result
      }, 0)
      resolve(score)
    })
  }

  postSurveyResult() {
    this.getSurveyScore()
    .then(score =>{
      let data = new FormData;
      data.append('idSBJTS', this.params.idSBJTS);
      data.append('idSURVEY', this.survey.data[0].idSURVEY);
      data.append('POINT', score.toString());
      this.serv.postSurveyResult(data)
      .then(data=>{
        this.serv.msgServ({
          severity:'success',
          message:'해당 과제가 작성 완료 되었습니다.',
        });
        this.navCtrl.pop(this.params);
      })
      .catch(msg => {
        this.serv.msgServ(msg);
      })
    });
  }

  putAssignResult() {
    let data = new FormData;
    if(this.assign.conf_input_01 === 1) {
      data.append('assignImg', (document.getElementById('assign-img') as HTMLCanvasElement).toDataURL('image/png', 1.0));
    }
    data.append('data', JSON.stringify(this.tableResult));
    this.serv.putAssignResult(data, this.params.idSBJTS)
    .then(data=>{
      this.serv.msgServ({
        severity:'success',
        message:'해당 과제가 작성 완료 되었습니다.',
      });
      this.navCtrl.pop(this.params);
    })
    .catch(msg => {
      this.serv.msgServ(msg);
    })
  }



  getLectureInform() {
    this.serv.getLectureInform(this.params.idSB_SBJT_CONF)
    .then(data=>{
      this.lecture = data[0];
      this.lecture.pages = [];
      this.lecture.htmls = [];
      for(let i = 0; i < this.lecture.page_no; i++) {
        this.lecture.pages.push(i+1);
      }
      if(this.lecture.type === 0) {
        this.serv.getLectureHTML(this.lecture.idLECTURE)
        .then(htmlData=>{
          this.lecture.htmls = htmlData.map(obj=>{
            return obj.html;
          });
        })
        .catch(msg => {
          this.serv.msgServ(msg);
        })
      } else if(this.lecture.type === 1) {
        this.lecture.src= {
          url: environment.apiUrl + '/data/assign/lecture/pdf/' + this.lecture.title,
          httpHeaders: {cred:this.serv.token},
        }
      }
    })
    .catch(msg => {
      this.serv.msgServ(msg);
    })
  }

  putLectureResult() {
    this.serv.putLectureResult(this.params.idSBJTS)
    .then(data=>{
      this.serv.msgServ({
        severity:'success',
        message:'해당 과제가 완료 되었습니다.',
      });
      this.navCtrl.pop(this.params);
    })
    .catch(msg => {
      this.serv.msgServ(msg);
    })
  }

  speechCommand(string) {
    this.tts.speak({
      text:string,
      locale: 'ko-KR',
      rate: 1.4,
    });
  }

  checkValue() {
    console.log(this.tableResult);
    console.log(JSON.stringify(this.tableResult));
  }

  emojiSelect(r, c, event) {
    this.tableResult[r][c] = event.char;
    this.emojiPickerView = false;
  }

  emojiFocus() {
    this.keyboard.close();
    this.emojiPickerView = !this.emojiPickerView;
  }

  //일일 활동 기록지
  genTimeTable(opt):Promise<any> {
    let result:any[] = [ ["시간", "활동", "감정"] ];
    let pushDate = new Date(this.params.PUSH_TIME);
    let date = new Date(pushDate.getFullYear(), pushDate.getMonth(), pushDate.getDate(), 0, 0, 0).getTime()
    let tommorow = date + (3600*1000*24);
    let unitTime:number;
    return new Promise((resolve)=>{
      switch(opt) {
        case 0:
          unitTime = (1800*1000)
        break;
        case 1:
          unitTime = (3600*1000)
        break;
        case 2:
          unitTime = (7200*1000)
        break;
        default:
          unitTime = (3600*1000)
        break;
      }

      while(date <= tommorow) {
        // console.log('date', date, 'tommorow', tommorow);
        result.push([new Date(date), 0, 2])
        date += unitTime;
      }
      resolve(result)
    })
  }

  genWeekResultTable(){
    let result:any[] = [
      ["활동", "목표 횟수", "달성률"],
      ['', 1, 1],
      ['', 1, 1],
      ['', 1, 1],
      ['', 1, 1],
      ['', 1, 1],
      ['', 1, 1],
      ['', 1, 1],
      ['', 1, 1],
      ['', 1, 1],
      ['', 1, 1],
    ];
    return result;
  }

  genWeekScheduleTable(){
    let result:any[] = [
      ["활동", "소요시간 (1회)", "목표횟수 1주간"],
      ['', 1, 1],
      ['', 1, 1],
      ['', 1, 1],
      ['', 1, 1],
      ['', 1, 1],
      ['', 1, 1],
      ['', 1, 1],
      ['', 1, 1],
      ['', 1, 1],
      ['', 1, 1],
      ['', 1, 1],
    ];
    return result;
  }

  genAnswerList(num):Promise<any>{
    return new Promise((resolve)=>{
      let result:any[] = []
      for(let i=0; i < num; i++) {
        result.push({idx:i+1, text:""});
      }
      resolve(result);
    })
  }

  openGallary() {
    setTimeout(()=>{
      this.photoLoaded = false;
    }, 1000)
    this.camera.getPicture(this.cameraOption)
    .then(imageData=>{
      let assignImgSrc = 'data:image/png;base64,'+ imageData;
      let canvas = <HTMLCanvasElement> document.getElementById('assign-img');
      let ctx = canvas.getContext('2d')
      let image = new Image();
      image.src = assignImgSrc;
      image.onload = ()=>{
        canvas.height = image.height*(canvas.width/image.width);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        this.isPhoto = true;
      }
      this.photoLoaded = true;
    }, err=>{
      this.photoLoaded = true;
      console.log(err);
    })

  }

  get simpleAnswer() {
    return this.fm.fg.get('simpleAnswer');
  }

}
