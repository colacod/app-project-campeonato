import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppService } from '../app.service';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit {

  times: any;
  timeFormGroup: FormGroup;

  constructor(private appService: AppService, private fb: FormBuilder) {

    this.timeFormGroup = this.fb.group({
      timeNome: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])],
      timeAbreviado: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(5)
      ])]
    });
  }

  ngOnInit() {
    this.getTimes();
  }

  onSubmit(value) {
    this.appService.setTime(value).subscribe(r => {
      this.getTimes();
      this.timeFormGroup.reset();
    });
  }

  getTimes() {
    this.appService.getTimes().subscribe(r => {
      this.times = r;
    });
  }
}
