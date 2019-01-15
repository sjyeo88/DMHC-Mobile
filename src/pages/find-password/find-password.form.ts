import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';

@Injectable()
export class FindPasswordForm {
  public fg:FormGroup ;
  public survey:FormArray ;
  public valider = new RegexValidators();

  constructor(public fb:FormBuilder) {
    this.fg = this.fb.group({
      email:['', [
        Validators.required,
        Validators.pattern(this.valider.pureEmail),
      ]],
      name: ['', [
        Validators.required,
        Validators.maxLength(this.valider.usernameMax),
        Validators.minLength(this.valider.usernameMin),
      ]],
      phone: ['', [
        Validators.required,
        Validators.maxLength(this.valider.phoneNumMax),
        Validators.minLength(this.valider.phoneNumMin),
        Validators.pattern(this.valider.purePhoneNumber),
      ]],
      password_q:[0, [Validators.required]],
      password_a:['', [Validators.required]],
    })
    this.survey = this.fb.array([]);
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
  emailLabel: ValidatorMSG;
  usernameLabel: ValidatorMSG;
  phoneNumLabel : ValidatorMSG;

  constructor() {
    this.valider= new RegexValidators();
    this.usernameLabel = new ValidatorMSG();
    this.phoneNumLabel =  new ValidatorMSG();
    this.emailLabel =  new ValidatorMSG();

    this.emailLabel.invalid = '적절한 E메일 주소가 아닙니다!';

    this.usernameLabel.value = '치료자님의 이름을 입력해주세요.';
    this.usernameLabel.invalidMin = "길이가 너무 짧습니다! (" + this.valider.usernameMin + "자 이상)";
    this.usernameLabel.invalidMax = "길이가 너무 깁니다! (" + this.valider.usernameMax + "자 이하)";

    this.phoneNumLabel.valid = this.phoneNumLabel.value;
    this.phoneNumLabel.invalidPattern = '적절한 핸드폰 번호가 아닙니다.';
    this.phoneNumLabel.invalidMin = "길이가 너무 짧습니다! (" + this.valider.phoneNumMin + "자 이상)";
    this.phoneNumLabel.invalidMax = "길이가 너무 깁니다! (" + this.valider.phoneNumMax + "자 이하)";
  }

}
