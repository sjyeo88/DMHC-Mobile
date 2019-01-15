import { FormBuilder, FormGroup} from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class AccessTermForm {
  public termAgree:FormGroup;

  constructor(private fb:FormBuilder) {
    this.termAgree = this.fb.group({
      allAgree: [false, []],
      usecase: [false, []],
      personInfo: [false, []],
    });
  }
}
