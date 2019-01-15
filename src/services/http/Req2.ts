import { YHttp } from  './yhttp.module';
import { environment } from '../environment';
// import {CookieService} from 'angular2-cookie/core';

export class Req2 extends YHttp {
  private apiUrl:string = environment.apiUrl;
  public cmsgs:any = {
    severity: 'error',
    title: '요청에 실패했습니다',
    message: '요청에 실패했습니다. 잠시 후 다시 시도해 주세요.'
  };
  public smsgs:any = {
    severity: 'error',
    title: '요청에 실패했습니다',
    message: '요청에 실패했습니다. 잠시 후 다시 시도해 주세요.'
  };
  public amsgs:any = {
    severity: 'error',
    title: '로그인에 실패했습니다.',
    message: '로그인에 실패했습니다. 이메일 및 비밀번호를 확인 후 다시 시도해 주세요.'
  };

  // constructor(method, url) {
  constructor(method, url, formData?:FormData) {
    super(method, url);
    this.url = this.apiUrl + url
  }
}
