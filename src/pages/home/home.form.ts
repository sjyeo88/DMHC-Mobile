import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Injectable()
export class LoginForm {
  public log;
  constructor(public fb:FormBuilder) {
    this.log = this.fb.group({
      email: [''],
      password: [''],
    })
  }
}
