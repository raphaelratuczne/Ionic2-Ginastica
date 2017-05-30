import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, Events } from 'ionic-angular';

import { GymDataService } from '../../providers/gym-data.service';
import { IGymData, IDataGymList } from '../../providers/IGymData';
import { AddPage } from '../add/add';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage implements OnInit, OnDestroy {

  /** lista de variaveis no html */
  @ViewChildren('item') private item: QueryList<ElementRef>;
  /** lista de datas salvas no banco */
  arrDates: Array<string>;
  /** ultima data procurada */
  lastDate: number = 0;
  /** lista de itens */
  itens: IDataGymList[] = [];
  /** referencia da pagina AddPage */
  addPage: any = AddPage;
  /** lista de ids selecionados para encluir */
  private arrDel: Array<number> = [];
  /** exibe/esconde botao excluir */
  public showDel: boolean = false;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private gymDataService: GymDataService,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private events: Events) {}

  // ionViewDidLoad() {
  //   // console.log('ionViewDidLoad ListPage');
  // }

  ngOnInit() {

    // pega todas as datas do banco
    this.gymDataService.getDates()
      .then( datas => {
        this.arrDates = datas;
        // console.log('array de datas:', this.arrDates);
        // busca dados pelas ultima data, pelo menos 10 resultados
        this.getGymDatas(10);
      });

      // espera por eventos de alteração de dados
      this.events.subscribe('gymData:updated', data => {
        this.presentToast('Dados alterados com sucesso.');
        for(let i in this.itens) {
          for(let j in this.itens[i].values) {
            if ( this.itens[i].values[j].id == data.id ) {
              this.itens[i].values[j].area =          data.area;
              this.itens[i].values[j].potential =     data.potential;
              this.itens[i].values[j].participants =  data.participants;
              this.itens[i].values[j].absence =       data.absence;
            }
          }
        }
        // limpa os itens seleciondos
        this.clearSelecteds();
      });

  }

  ngOnDestroy() {
    // cancela a espera por eventos de alteração
    this.events.unsubscribe('gymData:updated');
  }

  /**
   * traz novos dados do banco
   * @param {number} minLen numero minimo de resultados
   * @param {Array<any>} tmpDatas dados de buscas anteriores
   * @param {any} infiniteScroll infiniteScroll
   */
  private getGymDatas(minLen:number, tmpDatas:Array<any> = null, infiniteScroll:any = null): void {
    if ( typeof(this.arrDates[this.lastDate]) != 'undefined' ) {
      this.gymDataService.getGymDatas( this.arrDates[this.lastDate] )
      .then(resp => {
        this.lastDate++;
        let result = tmpDatas ? tmpDatas : [];

        result = result.concat(resp);

        if (result.length < minLen && typeof(this.arrDates[this.lastDate]) != 'undefined') {
          this.getGymDatas(minLen, result, infiniteScroll);
        } else {
          this.itens = this.itens.concat(this.convertData(result));
          // console.log(this.itens);
          if (infiniteScroll) {
            console.log('terminou busca');
            infiniteScroll.complete();
          }
        }
      });
    } else {
      if (infiniteScroll) {
        console.log('terminou busca e não ha mais dados');
        infiniteScroll.complete();
        infiniteScroll.enable(false);
      }
    }
  }

  /**
   * carrega mais dados ao chegar no final da pagina
   * @param  {[type]} infiniteScroll infiniteScroll
   */
  doInfinite(infiniteScroll): void {
    console.log('Começou busca por dados');
    setTimeout( () => {
      this.getGymDatas(10, null, infiniteScroll);
    },800);
  }

  /**
   * converte a lista retornada para o formato de exibicao
   * @param  {Array<IGymData>}     data lista retornada
   * @return {Array<IDataGymList>}      lista formatada
   */
  private convertData(data:Array<IGymData>): Array<IDataGymList> {
    return data.map((elem, i, arr) => {
          return {
            date: elem.date,
            company: elem.company,
            city: elem.city,
            values: arr.filter(el => { /* filtra elementos da mesma data, empresa e cidade */
              return el.date == elem.date && el.company == elem.company && el.city == elem.city;
            }, elem)
              .map(el => { /* converte o formato */
                return {
                  id: el.id,
                  area: el.area,
                  potential: el.potential,
                  participants: el.participants,
                  absence: el.absence
                }
              })
          }
        }).filter((elem, i, arr) => { /* filtra elementos repetidos */
          if (i === 0)
            return true;
          else /* compara com umelemento aterior */
            return elem.date != arr[i - 1].date || elem.company != arr[i - 1].company || elem.city != arr[i - 1].city;
        });
  }

  /**
   * vai para a pagina de formulario para editar
   * @param {number} id id do item
   */
  gotToAddPage(id:number): void {
    console.log(id);
    this.navCtrl.push(this.addPage, {id:id});
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
              this.gymDataService.deleteGymDatas(this.arrDel)
                .then( b => {
                  // remove o item
                  for(let i of this.arrDel) {
                    for(let j in this.itens) {
                      for(let k in this.itens[j].values) {
                        if (this.itens[j].values[k].id == i) {
                          this.itens[j].values.splice(parseInt(k), 1);
                        }
                      }
                    }
                  }
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
