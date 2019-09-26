import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { AppService } from '../app.service';

@Component({
  selector: 'app-playoff',
  templateUrl: './playoff.component.html',
  styleUrls: ['./playoff.component.scss']
})
export class PlayoffComponent implements OnInit {

  campeonatos: any;
  campeonato: any;
  campeonatoControl = new FormControl('');
  grupos: any;
  grupoControl = new FormControl('');
  timesGrupo: any;
  resultados: any;

  resultadoFormGroup: FormGroup;
  jogos: any;
  times: any;

  playoffSequenceFormGroup: FormGroup;
  playoffFormGroup: FormGroup;

  constructor(private appService: AppService, private fb: FormBuilder) {

    this.playoffSequenceFormGroup = this.fb.group({
      campeonato: ['', Validators.required],
      grupo: ['', Validators.required],
      grupoProximo: ['', Validators.required],
      limite: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])],
    });

    this.playoffFormGroup = this.fb.group({
      campeonato: ['', Validators.required],
      grupoProximo: ['', Validators.required],
      limite: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])],
    });

    this.resultadoFormGroup = this.fb.group({
      campeonato: ['', Validators.required],
      grupo: ['', Validators.required],
      jogo: ['', Validators.required],
      nmTimeUm: [{ value: '', disabled: true }, Validators.required],
      timeUm: ['', Validators.required],
      resultadoTimeUm: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])],
      nmTimeDois: [{ value: '', disabled: true }, Validators.required],
      timeDois: ['', Validators.required],
      resultadoTimeDois: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])],
      idTimeVencedor: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getCampeonatos();
    this.getGrupos();

    this.campeonatoControl.valueChanges.subscribe(r => {
      this.campeonato = r;
      this.timesGrupo = [];
      this.resultados = [];
    });

    this.grupoControl.valueChanges.subscribe(r => {
      this.appService.getTimesPlayoff(r.idGrupo, this.campeonato.idCampeonato).subscribe(rs => {
        this.timesGrupo = rs;
        this.resultados = [];
        this.appService.getResultadoPorGrupoCampeonato(r.idGrupo, this.campeonato.idCampeonato).subscribe(rss => {
          this.resultados = rss;
          this.timesGrupo.forEach(time => {
            const resultadoJogo = this.resultados.filter(resultado =>
              resultado.timeDois.idTime === time.timeDois.idTime && resultado.timeUm.idTime === time.timeUm.idTime
            );
            time.resultado = resultadoJogo[0];
          });
        });
      }, error => {
        this.timesGrupo = [];
      });
    });

    this.resultadoFormGroup.get('grupo').valueChanges.subscribe(r => {
      const campeonato = this.resultadoFormGroup.get('campeonato').value;
      this.appService.getTimesPlayoff(r.idGrupo, campeonato.idCampeonato).subscribe(rs => {
        this.jogos = rs;
      });
    });

    this.resultadoFormGroup.get('jogo').valueChanges.subscribe(r => {
      this.resultadoFormGroup.get('timeUm').setValue(r.timeUm);
      this.resultadoFormGroup.get('timeDois').setValue(r.timeDois);
      this.resultadoFormGroup.get('nmTimeUm').setValue(r.timeUm.timeNome);
      this.resultadoFormGroup.get('nmTimeDois').setValue(r.timeDois.timeNome);
      this.times = [r.timeUm, r.timeDois];
    });
  }

  getCampeonatos() {
    this.appService.getCampeonatos().subscribe(r => {
      this.campeonatos = r;
    });
  }

  getGrupos() {
    this.appService.getGruposPlayoff().subscribe(r => {
      this.grupos = r;
    });
  }

  onSubmitResultado(value) {

    const resultado = {
      resultadoTimeUm: Number(value.resultadoTimeUm),
      resultadoTimeDois: Number(value.resultadoTimeDois),
      idCampeonatoResultado: value.campeonato.idCampeonato,
      idTimeUm: value.timeUm.idTime,
      idTimeDois: value.timeDois.idTime,
      idTimeVencedor: value.idTimeVencedor,
      idGrupo: value.grupo.idGrupo
    };

    this.appService.setResultado(resultado).subscribe(r => {
      console.log(r);
    });
  }

  onSubmitPlayoff(value) {
    this.appService.setPlayoff(
      value.campeonato.idCampeonato, value.grupoProximo.idGrupo, value.limite
    ).subscribe(r => {
      console.log(r);
    });
  }

  onSubmitPlayoffSequence(value) {
    this.appService.setPlayoffSequence(
      value.campeonato.idCampeonato, value.grupo.idGrupo, value.grupoProximo.idGrupo, value.limite
    ).subscribe(r => {
      console.log(r);
    });
  }

  atualizar() {
    this.getCampeonatos();
    this.getGrupos();
  }
}
