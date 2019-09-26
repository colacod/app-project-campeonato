import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppService } from '../app.service';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.scss']
})
export class GrupoComponent implements OnInit {

  campeonatos: any;
  campeonato: any;
  campeonatoControl = new FormControl('');
  grupos: any;
  grupoControl = new FormControl('');
  timesGrupo: any;
  resultados: any;

  resultadoFormGroup: FormGroup;
  timesResultadoGrupo: any;

  grupoForm: FormGroup;

  constructor(private appService: AppService, private fb: FormBuilder) {

    this.grupoForm = this.fb.group({
      campeonato: ['', Validators.required]
    });

    this.resultadoFormGroup = this.fb.group({
      campeonato: ['', Validators.required],
      grupo: ['', Validators.required],
      idTimeUm: ['', Validators.required],
      resultadoTimeUm: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])],
      idTimeDois: ['', Validators.required],
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
      this.appService.getTimesGrupo(r.idGrupo, this.campeonato.idCampeonato).subscribe(rs => {
        this.timesGrupo = rs;
        this.resultados = [];
        this.appService.getResultadoPorGrupoCampeonato(r.idGrupo, this.campeonato.idCampeonato).subscribe(rss => {
          this.resultados = rss;
        });
      }, error => {
        this.timesGrupo = [];
      });
    });

    this.resultadoFormGroup.get('grupo').valueChanges.subscribe(r => {
      const campeonato = this.resultadoFormGroup.get('campeonato').value;
      this.appService.getTimesGrupo(r.idGrupo, campeonato.idCampeonato).subscribe(rs => {
        this.timesResultadoGrupo = rs;
      });
    });
  }

  getCampeonatos() {
    this.appService.getCampeonatos().subscribe(r => {
      this.campeonatos = r;
    });
  }

  getGrupos() {
    this.appService.getGrupos().subscribe(r => {
      this.grupos = r;
    });
  }

  onSubmitResultado(value) {
    const resultado = {
      resultadoTimeUm: Number(value.resultadoTimeUm),
      resultadoTimeDois: Number(value.resultadoTimeDois),
      idCampeonatoResultado: value.campeonato.idCampeonato,
      idTimeUm: value.idTimeUm,
      idTimeDois: value.idTimeDois,
      idTimeVencedor: value.idTimeVencedor,
      idGrupo: value.grupo.idGrupo
    };

    this.appService.setResultado(resultado).subscribe(r => {
      console.log(r);
    });
  }

  onSubmitGrupo(value) {
    this.appService.criarFaseGrupo(value.campeonato.idCampeonato).subscribe(r => {
      console.log(r);
    });
  }

  atualizar() {
    this.getCampeonatos();
    this.getGrupos();
  }
}
