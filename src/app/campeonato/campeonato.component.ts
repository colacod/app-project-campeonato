import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import 'rxjs';

import { AppService } from '../app.service';

@Component({
  selector: 'app-campeonato',
  templateUrl: './campeonato.component.html',
  styleUrls: ['./campeonato.component.scss']
})
export class CampeonatoComponent implements OnInit {

  campeonatos: any;
  campeonato: any;
  times: any;
  campeonatoControl = new FormControl('');
  campeonatoFormGroup: FormGroup;

  constructor(private appService: AppService, private fb: FormBuilder) {

    this.campeonatoFormGroup = this.fb.group({
      campeonatoNome: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])],
      limiteTimes: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])]
    });
  }

  ngOnInit() {
    this.getCampeonatos();

    this.campeonatoControl.valueChanges.subscribe(r => {
      this.campeonato = r;
      this.appService.getTimesCampeonato(r.idCampeonato).subscribe(
        rs => this.times = rs,
        error => {
          console.log(error);
          this.times = [];
        }
      );
    });
  }

  onSubmit(value) {
    this.appService.setCampeonato(value).subscribe(r => {
      this.getCampeonatos();
      this.campeonatoFormGroup.reset();
    });
  }

  getCampeonatos() {
    this.appService.getCampeonatos().subscribe(r => {
      this.campeonatos = r;
    });
  }
}
