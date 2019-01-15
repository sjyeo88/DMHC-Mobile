import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';

@Injectable()
export class AssignForm {
  public fg:FormGroup ;
  public survey:FormArray ;
  constructor(public fb:FormBuilder) {
    this.fg = this.fb.group({
      simpleAnswer: ['', [Validators.required]],
    })
    this.survey = this.fb.array([]);
  }

  emotion = [
    '기쁨(+10)',
    '기쁨(+9)',
    '기쁨(+8)',
    '기쁨(+7)',
    '기쁨(+6)',
    '기쁨(+5)',
    '기쁨(+4)',
    '기쁨(+3)',
    '기쁨(+2)',
    '기쁨(+1)',
    '보통(0)', 
    '슬픔(-1)',
    '슬픔(-2)',
    '슬픔(-3)',
    '슬픔(-4)',
    '슬픔(-5)',
    '슬픔(-6)',
    '슬픔(-7)',
    '슬픔(-8)',
    '슬픔(-9)',
    '슬픔(-10)',
  ];
  activity = ['자기', '먹기'];
  trueFalse = ['O', 'X'];
}
