import { Injectable } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Injectable()
export class UserForm {
  public reg;
  public valider = new RegexValidators();
  constructor(
    private fb: FormBuilder,
  ) {

    this.reg = this.fb.group({
      userInfoGroup: this.fb.group({
        email: ['', [Validators.required, Validators.pattern(this.valider.pureEmail)]],
        name: [{value:'', disabled: true}, [
          Validators.required,
          Validators.maxLength(this.valider.usernameMax),
          Validators.minLength(this.valider.usernameMin),
        ]],
        gender: [{value:0}, []],
        birth: [{value:null}, [Validators.required]],
        phone: ['', [
          Validators.required,
          Validators.maxLength(this.valider.phoneNumMax),
          Validators.minLength(this.valider.phoneNumMin),
          Validators.pattern(this.valider.purePhoneNumber),
        ]],
      }),

      passwordGroup: this.fb.group({
        newPassword: ['', [
          Validators.required,
          Validators.pattern(this.valider.purePassword),
          Validators.maxLength(this.valider.passwordMax),
          Validators.minLength(this.valider.passwordMin),
        ]],
        passwordCheck: ['', [Validators.required]]
      }, {validator: PasswordValid.match }),
      password_q: [{value:0}, [Validators.required]],
      password_a: ['', [Validators.required]],

      expertGroup: this.fb.group({
        expert_name: ['', []],
        expert_dept: [null, []],
        expert_job: [null, []],
      }, {validator: ExpertValid.match }),
    })
  }
}

export class RegexValidators {
  usernameMin:number = 1;
  usernameMax:number = 20;
  passwordMin:number = 8;
  passwordMax:number = 16;
  phoneNumMin:number = 10;
  phoneNumMax:number = 11;

  pureEmail =/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  purePassword = /^(?=.*[a-zA-Z])(?=.*[!@#%^&*+=-]).*$/;
  purePhoneNumber = /^0(?=.*[0-9]).*$/;
};

export class ValidatorMSG {
  value: string;
  dirty: string;
  invalid: string;
  valid: string;
  invalidMin: string;
  invalidMax: string;
  invalidPattern: string;
  require: string;


  constructor() {
    this.value= '';
    this.dirty= '';
    this.invalid= '';
    this.valid= '';
    this.invalidMin= '';
    this.invalidMax= '';
    this.invalidPattern= '';
    this.require= '입력이 되지 않았습니다';
  }
}

export class ValidMsgs {

  valider: RegexValidators
  usernameLabel: ValidatorMSG;
  emailLabel: ValidatorMSG;
  passwordLabel: ValidatorMSG;
  passwordCheckLabel: ValidatorMSG;
  birthLabel: ValidatorMSG;
  phoneNumLabel : ValidatorMSG;
  jobLabel: ValidatorMSG;
  deptLabel: ValidatorMSG;
  fileLabel: ValidatorMSG;

  constructor() {
    this.valider= new RegexValidators();
    this.usernameLabel = new ValidatorMSG();
    this.emailLabel = new ValidatorMSG();
    this.passwordLabel = new ValidatorMSG();
    this.passwordCheckLabel = new ValidatorMSG();
    this.birthLabel = new ValidatorMSG();
    this.phoneNumLabel =  new ValidatorMSG();
    this.jobLabel =   new ValidatorMSG();
    this.deptLabel =  new  ValidatorMSG();
    this.fileLabel = new ValidatorMSG();

    this.usernameLabel.value = '치료자님의 이름을 입력해주세요.';
    this.usernameLabel.invalidMin = "길이가 너무 짧습니다! (" + this.valider.usernameMin + "자 이상)";
    this.usernameLabel.invalidMax = "길이가 너무 깁니다! (" + this.valider.usernameMax + "자 이하)";

    this.emailLabel.value = '치료자님의 이메일을 입력해주세요, ID가 되오니 정확하게 입력바랍니다.';
    this.emailLabel.invalid = '적절한 E메일 주소가 아닙니다!';
    this.emailLabel.invalidPattern = '이미 가입된 메일입니다!';

    this.passwordLabel.value = '비밀번호를 입력해주세요.';
    this.passwordLabel.invalidPattern = '적절한 비밀번호가 아닙니다!';
    this.passwordLabel.invalidMin = "길이가 너무 짧습니다! (" + this.valider.passwordMin + "자 이상)";
    this.passwordLabel.invalidMax = "길이가 너무 깁니다! (" + this.valider.passwordMax + "자 이하)";

    this.passwordCheckLabel.value = '비밀번호를 한번 더 입력해주세요.';
    this.passwordCheckLabel.invalid = '비밀번호가 일치하지 않습니다. 다시한번 확인해주세요.';
    this.passwordCheckLabel.valid = '비밀번호가 일치합니다.';

    this.birthLabel.value = '치료자님의 생년월일을 입력해주세요.';

    this.phoneNumLabel.value = '치료자님의 휴대전화 번호를 "-" 없이 입력해주세요.';
    this.phoneNumLabel.valid = this.phoneNumLabel.value;
    this.phoneNumLabel.invalidPattern = '적절한 핸드폰 번호가 아닙니다.';
    this.phoneNumLabel.invalidMin = "길이가 너무 짧습니다! (" + this.valider.phoneNumMin + "자 이상)";
    this.phoneNumLabel.invalidMax = "길이가 너무 깁니다! (" + this.valider.phoneNumMax + "자 이하)";

    this.jobLabel.value = '치료자님께서 현재 종사하고 있는 직종을 입력하세요';

    this.deptLabel.value = '치료자님께서 현재 소속되어 있는 소속기관을 입력하세요';

    this.fileLabel.value = '치료자님의 전문가 자격증 사본(jpeg, jpg, png, gif)을 업로드 해주세요.';
    this.fileLabel.valid = this.fileLabel.value;
    this.fileLabel.invalid = '업로드 할 파일이 없습니다!';
  }

}

export class PasswordValid {
    static match(form: AbstractControl) {
      const newPassword = form.get('newPassword').value;
      const passwordCheck = form.get('passwordCheck').value;
      if(newPassword !== passwordCheck) {
        return {match: {newPassword, passwordCheck}};
      } else {
        return null;
      }
    }
}

export class ExpertValid {
    static match(form: AbstractControl) {
      const expertName = form.get('expert_name').value;
      const expertDept = form.get('expert_dept').value;
      const expertJob = form.get('expert_job').value;
      if(expertName === '' || !expertDept || !expertJob) {
        return {match: {expertName, expertDept, expertJob}};
      }
      return null
    }
}
