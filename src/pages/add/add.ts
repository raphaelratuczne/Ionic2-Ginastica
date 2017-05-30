import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController, Events } from 'ionic-angular';

import { OptionsDataService } from '../../providers/options-data.service';
import { GymDataService } from '../../providers/gym-data.service';
import { IGymData } from '../../providers/IGymData';

@Component({
  selector: 'page-add',
  templateUrl: 'add.html'
})
export class AddPage implements OnInit {

  /** objeto de dados */
  public data: IGymData;
  /** lista de empresas empresas */
  public companies: any;
  /** lista de cidades */
  public cities: any;
  /** lista de areas */
  public areas: any;
  /** lista de faltas */
  public absences: any;
  /** id de dado salvo */
  public id: number;
  /** texto do cabecalho */
  public head: string;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private optionsDataService: OptionsDataService,
              private gymDataService: GymDataService,
              private toastCtrl: ToastController,
              private events: Events) {

    this.id = this.navParams.get('id');

    if (this.id) {
      this.head = 'Alterar dados';
    } else {
      this.head = 'Coletar dados';
    }
    // console.log('id:',id);
    // inicializa dados
    this.data = {
      id: null,
      date: this.getDate(),
      company: '',
      city: '',
      area: '',
      potential: 0,
      participants: 0,
      absence: '',
      observations: ''
    };
  }

  ngOnInit() {
    this.optionsDataService.getCompanies()
      .then( resp => this.companies = resp );

    this.optionsDataService.getCities()
      .then( resp => this.cities = resp );

    this.optionsDataService.getAreas()
      .then( resp => this.areas = resp );

    this.optionsDataService.getAbsences()
      .then( resp => this.absences = resp );

    // se passou um id, busca os dados no banco
    if (this.id) {
      this.gymDataService.getGymData(this.id)
        .then( r => {
          this.data.id =            r.id;
          this.data.date =          r.date;
          this.data.company =       r.company;
          this.data.city =          r.city;
          this.data.area =          r.area;
          this.data.potential =     r.potential;
          this.data.participants =  r.participants;
          this.data.absence =       r.absence;
          this.data.observations =  r.observations;
        });

    } else {
      // pega o nome da empresa e da cidada do ultimo resgistro
      this.gymDataService.getLastCompanyCity()
      .then( resp => {
        // console.log('resultado>>>',resp);
        if (typeof(resp) != 'undefined' && typeof(resp['company']) != 'undefined') {
          this.data.company = resp.company;
          this.data.city = resp.city;
        }
      } );
    }
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad AddPage');
  // }

  /**
   * retorna a data atual para autopreencher o campo de data
   * @return {string} data atual
   */
  getDate(): string {
    // return new Date() /* nova data */
    //           .toLocaleDateString() /* em formato local YYYY-M-D (2017-5-8) */
    //           .split('-') /* quebra em um array */
    //           .map(el => {return parseInt(el) < 10 ? '0' + el : el;}) /* adiciona 0 antes dos numeros */
    //           .join('-'); /* junta em YYYY-MM-DD (2017-05-08) */

    // se retornar a data pelo metodo acima comentado o angular/ionic
    // converte a data para dd/mm/yyyy e o elemento ion-datetime não reconhece a data
    let d = new Date();
    return d.getFullYear() +
            '-' +
            (d.getMonth() + 1 < 10 ? ('0' + (d.getMonth() + 1)) : d.getMonth() + 1 ) +
            '-' +
            (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
  }

  /**
   * ao selecionar uma area, busca o potencial e participantes do ultimo registro
   * @param {string} area area selecionada
   */
  onAreaSelected(area:string): void {
    this.gymDataService.getLastPotentialParticipants(area, this.data.company, this.data.city)
      .then(resp => {
        if (typeof(resp) != 'undefined' && typeof(resp['potential']) != 'undefined') {
          this.data.potential = resp.potential;
          this.data.participants = resp.participants;
        }
      });
  }

  /**
   * seleciona todos os dados do campo
   * @param {any} event evento de foco
   */
  selectAll(event): void {
    event.target.select();
  }

  /**
   * salva dados
   */
  save(): void {
    // console.log(this.data);
    let data = this.data;
    this.gymDataService.addGymData(this.data)
      .then(() => {
        this.data = {
          date: new Date().toISOString().slice(0,10),
          company: data.company,
          city: data.city,
          area: '',
          potential: 0,
          participants: 0,
          absence: '',
          observations: ''
        };
        this.presentToast('Dados salvos com sucesso.');
      });
  }

  /**
   * atualiza dados
   */
  update(): void {
    this.gymDataService.updateGymData(this.data)
      .then( b => {
        this.navCtrl.pop();
        this.events.publish('gymData:updated', this.data);
      } );
  }

  /**
   * cancela edição de dados
   */
  back(): void {
    this.navCtrl.pop();
  }

  /**
   * exibe mensagem toast
   * @param {string} msg texto da mensagem
   */
  presentToast(msg:string): void {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
}
