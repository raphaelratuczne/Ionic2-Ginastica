import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

import { OptionsDataService } from '../../providers/options-data.service';
import { IOptions } from '../../providers/IOption';

@Component({
  selector: 'page-options',
  templateUrl: 'options.html'
})
export class OptionsPage implements OnInit {

  /** lista de variaveis no html */
  @ViewChildren('item') private item: QueryList<ElementRef>;

  /** aba atual */
  public segment: string = 'Empresas';
  // public company: string;
  /** lista de empresas */
  public companies: IOptions[];
  // public city: string;
  /** lista de cidades */
  public cities: IOptions[];
  // public area: string;
  /** lista de grupos */
  public areas: IOptions[];
  // public absence: string;
  /** lista de faltas */
  public absences: IOptions[];
  /** lista de ids selecionados para encluir */
  private arrDel: Array<number> = [];
  /** exibe/esconde botao excluir */
  public showDel: boolean = false;

  /** instancia dependencias */
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private optionsDataService: OptionsDataService,
              private toastCtrl: ToastController) {}

  ionViewDidLoad() {
    // console.log('ionViewDidLoad OptionsPage');
  }

  /**
   * ao carregar, carrega todos os dados
   */
  ngOnInit(): void {
    this.optionsDataService.getCompanies()
      .then( resp => this.companies = resp );

    this.optionsDataService.getCities()
      .then( resp => this.cities = resp );

    this.optionsDataService.getAreas()
      .then( resp => this.areas = resp );

    this.optionsDataService.getAbsences()
      .then( resp => this.absences = resp );
  }

  /**
   * exibe quadro adicionar/editar empresa
   * @param {IOptions = null} company objet (id,empresa,usuario)
   */
  showAddCompany(company:IOptions = null): void {
    let prompt = this.alertCtrl.create({
      title: (company ? 'Alterar empresa' : 'Adicionar nova empresa'),
      // message: "Adicionar nova empresa",
      inputs: [
        { name: 'empresa',
          placeholder: 'Empresa',
          value: (company ? company.name : '') },
        { name: 'email',
          placeholder: 'E-mail',
          value: (company ? company.users.email : '') }
      ],
      buttons: [
        { text: 'Cancelar',
          // handler: data => console.log('Cancel clicked')
        }, {
          text: 'Salvar',
          handler: data => {
            let login = data.empresa.toLowerCase().replace(/\s/g,'');
            let pass = login + '@' + Math.floor((Math.random() * 1000) + 2000);
            // se enviou id, altera empresa
            if (company && data.empresa.length > 0 && data.email.length > 0) {
              this.optionsDataService.updateCompany({id:company.id, name: data.empresa, email:data.email, login: login, pass: pass})
                .then( resp => this.companies = resp );
            // se nao enviou id, adicona empresa
          } else if (data.empresa.length > 0 && data.email.length > 0){
              this.optionsDataService.addCompany({name: data.empresa, email: data.email, login: login, pass: pass})
                .then( resp => this.companies = resp );
            } else {
              this.presentToast('Os campos não podem ficar vazios.');
            }
            this.clearSelecteds();
          }
        }
      ]
    });
    prompt.present();
  }

  /**
   * exibe quadro adicionar/editar cidade
   * @param {IOptions = null} city objeto (id,cidade)
   */
  showAddCity(city:IOptions = null): void {
    let prompt = this.alertCtrl.create({
      title: (city ? 'Alterar ponto' : 'Adicionar novo ponto'),
      // message: "Adicionar novo ponto",
      inputs: [
        { name: 'cidade',
          placeholder: 'Ponto',
          value: (city ? city.name : '') }
      ],
      buttons: [
        {
          text: 'Cancelar',
          // handler: data => { console.log('Cancel clicked'); }
        }, {
          text: 'Salvar',
          handler: data => {
            // se enviou id, altera cidade
            if (city && data.cidade.length > 0) {
              this.optionsDataService.updateCity({id: city.id, name: data.cidade})
                .then( resp => this.cities = resp );
            // se nao enviou id, adiciona cidade
            } else if (data.cidade.length > 0) {
              this.optionsDataService.addCity(data.cidade)
                .then( resp => this.cities = resp );
            } else {
              this.presentToast('Os campos não podem ficar vazios.');
            }
            this.clearSelecteds();
          }
        }
      ]
    });
    prompt.present();
  }

  /**
   * exibe quadro adicionar/editar grupo
   * @param {IOptions = null} area objeto (id,grupo)
   */
  showAddArea(area:IOptions = null): void {
    let prompt = this.alertCtrl.create({
      title: (area ? 'Alterar grupo' : 'Adicionar novo grupo'),
      // message: "Adicionar novo grupo",
      inputs: [
        { name: 'grupo',
          placeholder: 'Grupo',
          value: (area? area.name : '') }
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: 'Salvar',
          handler: data => {
            // se enviou id, altera o grupo
            if (area && data.grupo.length > 0) {
              this.optionsDataService.updateArea({id: area.id, name: data.grupo})
                .then( resp => this.areas = resp );
            // se nao enviou id, adiciona grupo
            } else if (data.grupo.length > 0) {
              this.optionsDataService.addArea(data.grupo)
                .then( resp => this.areas = resp );
            } else {
              this.presentToast('Os campos não podem ficar vazios.');
            }
            this.clearSelecteds();
          }
        }
      ]
    });
    prompt.present();
  }

  /**
   * exibe quadro adicionar/excluir falta
   * @param {IOptions = null} absence objeto (id,falta)
   */
  showAddAbsence(absence:IOptions = null): void {
    let prompt = this.alertCtrl.create({
      title: (absence ? 'Alterar falta' : 'Adicionar nova falta'),
      // message: "Adicionar novo grupo",
      inputs: [
        { name: 'falta',
          placeholder: 'Falta',
          value: (absence? absence.name : '') }
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            // console.log('Cancel clicked');
          }
        }, {
          text: 'Salvar',
          handler: data => {
            // se enviou id, altera falta
            if (absence && data.falta.length > 0) {
              this.optionsDataService.updateAbsence({id: absence.id, name: data.falta})
                .then( resp => this.absences = resp );
            // se nao enviou id, adiciona falta
            } else if (data.falta.length > 0) {
              this.optionsDataService.addAbsence(data.falta)
                .then( resp => this.absences = resp );
            } else {
              this.presentToast('Os campos não podem ficar vazios.');
            }
            this.clearSelecteds();
          }
        }
      ]
    });
    prompt.present();
  }

  /**
   * seta class local como true e adiciona id na lista para excluir
   * @param {any}    item variavel local html
   * @param {number} id   id do item
   */
  setSelected(item:any, id:number): void {
    item.class = !item.class;
    if (item.class) {
      this.arrDel.push(id);
    } else {
      this.arrDel.splice(this.arrDel.indexOf(id), 1);
    }
    // se houver 1 ou mais itens na lista, exibe botao de exclir
    this.showDel = this.arrDel.length > 0 ? true : false;
  }

  /**
   * seta class local como true se algum outro item ja estiver selecionado
   * @param {any}    item variavel local html
   * @param {number} id   ide do item
   */
  setSelectedTap(item:any, id:number): void {
    if (this.arrDel.length > 0)
      this.setSelected(item, id);
  }

  /**
   * exibe janela de confirmacao e exclui itens
   */
  deleteItens(): void {
    if(this.arrDel.length > 0) {
      let prompt = this.alertCtrl.create({
        title: 'Excluir',
        message: "Tem certeza que deseja excluir?",
        buttons: [
          {
            text: 'Cancelar',
            handler: data => {
              // console.log('Cancel clicked');
            }
          }, {
            text: 'Excluir',
            handler: data => {
              // seta funcao e lista de acordo com a aba atual
              let fn = '', list = '';
              switch(this.segment) {
                case 'Empresas':  fn = 'deleteCompanies'; list = 'companies'; break;
                case 'Pontos':    fn = 'deleteCities';    list = 'cities';    break;
                case 'Grupos':    fn = 'deleteAreas';     list = 'areas';     break;
                case 'Faltas':    fn = 'deleteAbsences';  list = 'absences';  break;
              }
              this.optionsDataService[fn](this.arrDel)
                .then( resp => {
                  // atualiza os dados
                  this[list] = resp;
                  this.clearSelecteds();
                });
            }
          }
        ]
      });
      prompt.present();
    }
  }

  /**
   * limpa lista de ids para exclusao e lista de selecionados
   */
  clearSelecteds(): void {
    this.arrDel = [];
    this.showDel = false;
    for(let i in this.item.toArray()) {
      this.item.toArray()[i]['class'] = false;
    }
  }

  /**
   * verifica se mudou de aba e limpa ids selecionados
   * @param {string} aba nome da aba
   */
  changeAba(aba:string): void {
    if (aba !=  this.segment) {
      this.clearSelecteds();
    }
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
