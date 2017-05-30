import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { IGymData } from './IGymData';

@Injectable()
export class GymDataService {

  private db: SQLiteObject;
  private gymDatas: IGymData[];

  constructor(private platform: Platform,
              private sqlite: SQLite,
              private http: Http) {

    console.log('Hello GymDataService');

    this.platform.ready().then(() => {
      if ( this.platform.is('cordova') ) {

        // cria ou conecta ao banco de dados
        this.sqlite.create({
          name: 'data.db',
          location: 'default'
        })
        .then( (_db: SQLiteObject) => {
          this.db = _db;
          this.db.executeSql('CREATE TABLE IF NOT EXISTS gym (' +
                             'id INTEGER PRIMARY KEY, ' +
                             'date DATE, ' +
                             'company VARCHAR (100), ' +
                             'city VARCHAR (100), ' +
                             'area VARCHAR (100), ' +
                             'potential INTEGER (3), ' +
                             'participants INTEGER (3), ' +
                             'absence VARCHAR (160), ' +
                             'observations TEXT, ' +
                             'created_at DATETIME, ' +
                             'updated_at DATETIME, ' +
                             'synced BOOLEAN, ' +
                             'active BOOLEAN);', {})
            .then(() => console.log('Criou tabela gym') )
            .catch(e => console.log(e));
        });

      } else {
        this.gymDatas = [
          {id:1, date: '2017-03-05', company: 'Empresa de Teste', city: 'Navegantes', area: 'Secretaria', potential: 2, participants: 2, absence: '', observations: '', created_at: '2017-03-05 11:30:25', updated_at: '2017-03-05 11:30:25', synced: false, active: true},
          {id:2, date: '2017-03-05', company: 'Empresa de Teste', city: 'Navegantes', area: 'Atendimento', potential: 3, participants: 2, absence: 'Sessão Realizada', observations: '', created_at: '2017-03-05 11:30:25', updated_at: '2017-03-05 11:30:25', synced: false, active: true},
          {id:3, date: '2017-03-05', company: 'Empresa de Teste', city: 'Navegantes', area: 'Produção', potential: 8, participants: 7, absence: '', observations: '', created_at: '2017-03-05 11:30:25', updated_at: '2017-03-05 11:30:25', synced: false, active: true},

          {id:4, date: '2017-03-05', company: 'Empresa de Teste', city: 'Itajai', area: 'Secretaria', potential: 10, participants: 10, absence: '', observations: '', created_at: '2017-03-05 11:30:25', updated_at: '2017-03-05 11:30:25', synced: false, active: true},
          {id:5, date: '2017-03-05', company: 'Empresa de Teste', city: 'Itajai', area: 'Atendimento', potential: 5, participants: 4, absence: 'Sessão Realizada', observations: '', created_at: '2017-03-05 11:30:25', updated_at: '2017-03-05 11:30:25', synced: false, active: true},
          {id:6, date: '2017-03-05', company: 'Empresa de Teste', city: 'Itajai', area: 'Produção', potential: 6, participants: 4, absence: '', observations: '', created_at: '2017-03-05 11:30:25', updated_at: '2017-03-05 11:30:25', synced: false, active: true},

          {id:7, date: '2017-03-06', company: 'Teste de Empresa', city: 'Navegantes', area: 'Secretaria', potential: 8, participants: 5, absence: '', observations: '', created_at: '2017-03-05 11:30:25', updated_at: '2017-03-05 11:30:25', synced: false, active: true},
          {id:8, date: '2017-03-06', company: 'Teste de Empresa', city: 'Navegantes', area: 'Produção', potential: 7, participants: 7, absence: '', observations: '', created_at: '2017-03-05 11:30:25', updated_at: '2017-03-05 11:30:25', synced: false, active: true},
          {id:9, date: '2017-03-06', company: 'Teste de Empresa', city: 'Navegantes', area: 'Atendimento', potential: 4, participants: 4, absence: '', observations: '', created_at: '2017-03-05 11:30:25', updated_at: '2017-03-05 11:30:25', synced: false, active: true},

          {id:10, date: '2017-03-06', company: 'Teste de Empresa', city: 'Itajai', area: 'Secretaria', potential: 12, participants: 12, absence: '', observations: '', created_at: '2017-03-05 11:30:25', updated_at: '2017-03-05 11:30:25', synced: false, active: true},
          {id:11, date: '2017-03-06', company: 'Teste de Empresa', city: 'Itajai', area: 'Produção', potential: 14, participants: 12, absence: '', observations: '', created_at: '2017-03-05 11:30:25', updated_at: '2017-03-05 11:30:25', synced: false, active: true},
          {id:12, date: '2017-03-06', company: 'Teste de Empresa', city: 'Itajai', area: 'Atendimento', potential: 9, participants: 7, absence: '', observations: '', created_at: '2017-03-05 11:30:25', updated_at: '2017-03-05 11:30:25', synced: false, active: true},

          {id:13, date: '2017-03-10', company: 'Mais um teste', city: 'Navegantes', area: 'Secretaria', potential: 11, participants: 9, absence: '', observations: '', created_at: '2017-03-05 11:30:25', updated_at: '2017-03-05 11:30:25', synced: false, active: true},
          {id:14, date: '2017-03-10', company: 'Mais um teste', city: 'Navegantes', area: 'Atendimento', potential: 16, participants: 5, absence: '', observations: '', created_at: '2017-03-05 11:30:25', updated_at: '2017-03-05 11:30:25', synced: false, active: true},
          {id:15, date: '2017-03-10', company: 'Mais um teste', city: 'Navegantes', area: 'Produção', potential: 18, participants: 16, absence: '', observations: '', created_at: '2017-03-05 11:30:25', updated_at: '2017-03-05 11:30:25', synced: false, active: true},

          {id:16, date: '2017-03-10', company: 'Mais um teste', city: 'Itajai', area: 'Secretaria', potential: 5, participants: 4, absence: '', observations: '', created_at: '2017-03-05 11:30:25', updated_at: '2017-03-05 11:30:25', synced: false, active: true},
          {id:17, date: '2017-03-10', company: 'Mais um teste', city: 'Itajai', area: 'Atendimento', potential: 16, participants: 13, absence: '', observations: '', created_at: '2017-03-05 11:30:25', updated_at: '2017-03-05 11:30:25', synced: false, active: true},
          {id:18, date: '2017-03-10', company: 'Mais um teste', city: 'Itajai', area: 'Produção', potential: 17, participants: 12, absence: '', observations: '', created_at: '2017-03-05 11:30:25', updated_at: '2017-03-05 11:30:25', synced: false, active: true},
        ];
      }
    });
  }

  /**
   * extrai dados das consultas
   * @param  {any}    res resultado da consultas
   * @return {Array<IGymData>}     resultado extraido
   */
  private extractData(res: any): Array<IGymData> {
    // console.log('deu certo \\o/', res);
    let data = [];
    for (let i = 0; i < res.rows.length; i++) {
      data.push(res.rows.item(i));
    }
    return data;
  }

  /**
   * funcao de erro
   * @param  {any}    error objeto do erro
   * @return {any}       objeto de erro
   */
  private  handleError(error: any): any {
    console.log('deu erro T_T', error);
    return error;
  }

  /**
   * retorna data YYYY-MM-DD HH:mm:ss
   * @return {string} data
   */
  private getDateTime(): string {
    return new Date() /* nova data */
          .toLocaleString() /* string local YYYY-M-D HH:mm:ss */
          .split(' ') /* quebra pelo espaço */
          .map(el => {
            if (el.indexOf('-') > 0) /* se for da data */
              return el.split('-') /* quebra pelo traço */
                    .map(el => {return parseInt(el) < 10 ? '0'+el : el}) /* adiciona 0 antes do mes e dia */
                    .join('-'); /* junta de novo */
            else
              return el; /* se for a hora, retorna igual */
          })
          .join(' '); /* junta a data e a hora */
  }

  /**
   * traz lista de dados cadastrados
   * @param  {string} date data dos dados
   * @return {Promise<IGymData[]>} lista de dados
   */
  getGymDatas(date:string): Promise<IGymData[]> {
    if ( this.platform.is('cordova') ) {
      return this.db.executeSql('SELECT id,date,company,city,area,potential,participants,absence,observations FROM gym WHERE active = (?) AND date = (?) ORDER BY company ASC, city ASC, area ASC;', [true, date])
        .then( this.extractData )
        .catch( this.handleError );

    } else {
      let arrDatas = this.gymDatas.filter(el => {return el.active && el.date == date}).sort(this.dynamicSortMultiple('company','city'));
      return Promise.resolve( arrDatas );
    }
  }

  /**
   * traz os dados de um cadastro
   * @param  {number}            id id co cadastro
   * @return {Promise<IGymData>}    dados do cadastro
   */
  getGymData(id: number): Promise<IGymData> {
    if ( this.platform.is('cordova') ) {
      return this.db.executeSql('SELECT * FROM gym WHERE id = (?);', [id])
        .then( resp => { return resp.rows.item(0); } )
        .catch( this.handleError );

    } else {
      for (let gymData of this.gymDatas) {
        if (gymData.id == id) {
          return Promise.resolve(gymData);
        }
      }
    }
  }

  /**
   * retorna lista de datas cadastradas
   * @return {Promise} lista de datas
   */
  getDates(): Promise<Array<string>> {
    if ( this.platform.is('cordova') ) {
      return this.db.executeSql('SELECT DISTINCT date FROM gym WHERE active = (?) ORDER BY date DESC;', [true])
        .then( res => {
          let data = [];
          for (let i = 0; i < res.rows.length; i++) {
            data.push( res.rows.item(i).date );
          }
          return data;
        } )
        .catch( this.handleError );
    } else {
      let data = this.gymDatas
        .filter(el => { return el.active; }) /* filtra por itens ativos */
        .map(el => { return el.date; }) /* pega apenas as datas */
        .sort() /* ordena */
        .reverse() /* reverte */
        .filter((elem, i, arr) => { return i === 0 ? true : (elem != arr[i - 1]); }); /* filtra elementos duplicados */
      return Promise.resolve( data );
    }
  }

  /**
   * retorna nome da empresa e cidade da ultima linha adicinada
   * @return {Promise<any>} empresa e cidade
   */
  getLastCompanyCity(): Promise<any> {
    if ( this.platform.is('cordova') ) {
      return this.db.executeSql('SELECT company,city FROM gym WHERE active = (?) ORDER BY id DESC LIMIT 1;', [true])
        .then( resp => { return resp.rows.item(0); } )
        .catch( this.handleError );
    } else {
      this.gymDatas.sort(this.dynamicSort('id'));
      for(let i = (this.gymDatas.length - 1); i >= 0; i--) {
        if (this.gymDatas[i].active == true) {
          return Promise.resolve({company: this.gymDatas[i].company, city: this.gymDatas[i].city});
        }
      }
    }
  }

  /**
   * traz potencial e participantes por area, empresa e cidade
   * @param  {string}       area    area
   * @param  {string}       company empresa
   * @param  {string}       city    cidade
   * @return {Promise<any>}         objeto {potential: 0, participants: 0}
   */
  getLastPotentialParticipants(area:string, company:string, city:string): Promise<any> {
    if ( this.platform.is('cordova') ) {
      return this.db.executeSql('SELECT potential,participants FROM gym WHERE area = (?) AND company = (?) AND city = (?) AND active = (?) ORDER BY id DESC LIMIT 1;', [area, company, city, true])
        .then( resp => {
          if (resp.rows.item(0))
            return resp.rows.item(0);
          else
            return {potential: 0, participants: 0};
        } )
        .catch( this.handleError );
    } else {
      this.gymDatas.sort(this.dynamicSort('id'));
      for(let i = (this.gymDatas.length - 1); i >= 0; i--) {
        if (this.gymDatas[i].area == area && this.gymDatas[i].company == company && this.gymDatas[i].city == city && this.gymDatas[i].active == true) {
          return Promise.resolve({potential: this.gymDatas[i].potential, participants: this.gymDatas[i].participants});
        }
      }
      return Promise.resolve({potential: 0, participants: 0});
    }
  }

  /**
   * adiciona um novo cadastro
   * @param  {IGymData}         gymData dados
   * @return {Promise<boolean>}         retorna true se conseguiu
   */
  addGymData(gymData:IGymData): Promise<boolean> {
    // console.log(gymData);
    let datetime = this.getDateTime();
    if ( this.platform.is('cordova') ) {
      let sql = 'INSERT INTO gym (date, company, city, area, potential, participants, absence, observations, created_at, updated_at, synced, active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
      return this.db.executeSql(sql, [gymData.date,
                                      gymData.company,
                                      gymData.city,
                                      gymData.area,
                                      gymData.potential,
                                      gymData.participants,
                                      gymData.absence,
                                      gymData.observations,
                                      datetime,
                                      datetime,
                                      false,
                                      true])
        .then(() => {return true;} )
        .catch(e => console.log(e));

    } else {
      let id = this.gymDatas.reduce((prev,curr) => { return prev.id > curr.id ? prev : curr; }).id + 1;
      gymData['id'] = id;
      gymData['created_at'] = datetime;
      gymData['updated_at'] = datetime;
      gymData['synced'] = false;
      gymData['active'] = true;
      this.gymDatas.push(gymData);
      // console.log(this.gymDatas);
      return Promise.resolve(true);
    }
  }

  /**
   * atualiza os dados de um cadastro
   * @param  {IGymData}            gymData dados
   * @return {Promise<IGymData[]>}         lista de dados atualizada
   */
  updateGymData(gymData:IGymData): Promise<boolean> {
    if (gymData.id) {
      let datetime = this.getDateTime();
      if ( this.platform.is('cordova') ) {
        let sql = 'UPDATE gym SET date = (?), company = (?), city = (?), area = (?), potential = (?), participants = (?), absence = (?), observations = (?), updated_at = (?), synced = (?) WHERE id = (?)';
        return this.db.executeSql(sql,[gymData.date, gymData.company, gymData.city, gymData.area, gymData.potential, gymData.participants, gymData.absence, gymData.observations, datetime, false, gymData.id])
        .then(() => {return true} )
        .catch(e => console.log(e));

      } else {
        for(let i in this.gymDatas) {
          if (this.gymDatas[i].id == gymData.id) {
            this.gymDatas[i].date =         gymData.date;
            this.gymDatas[i].company =      gymData.company;
            this.gymDatas[i].city =         gymData.city;
            this.gymDatas[i].area =         gymData.area;
            this.gymDatas[i].potential =    gymData.potential;
            this.gymDatas[i].participants = gymData.participants;
            this.gymDatas[i].absence =      gymData.absence;
            this.gymDatas[i].observations = gymData.observations;
            this.gymDatas[i].updated_at =   datetime;
            this.gymDatas[i].synced =       false;
          }
        }
        return Promise.resolve(true);
      }
    }
    return Promise.reject(false);
  }

  /**
   * exclui um conjunto de dados
   * @param  {Array<number>}    arrIds lista de ids
   * @return {Promise<boolean>}        retorna true se conseguiu
   */
  deleteGymDatas(arrIds:Array<any>): Promise<boolean> {
    let datetime = this.getDateTime();
    if ( this.platform.is('cordova') ) {
      let arr = arrIds.map(el => {return '?'}).join(',');
      let sql = 'UPDATE gym SET active = (?), synced = (?), updated_at = (?) WHERE id IN ('+arr+')';
      let mArr: Array<any> = [false,false,datetime].concat(arrIds);
      // let mArr: Array<any> = arrIds.slice(0);
      // mArr.unshift(datetime);
      // mArr.unshift(false);
      // mArr.unshift(false);
      return this.db.executeSql(sql, mArr)
        .then(() => {return true;} )
        .catch(e => console.log(e));

    } else {
      for(let id of arrIds) {
        for(let i in this.gymDatas) {
          if(this.gymDatas[i].id == id) {
            this.gymDatas[i].active = false;
            this.gymDatas[i].synced = false;
            this.gymDatas[i].updated_at = datetime;
            break;
          }
        }
      }
      return Promise.resolve(true);
    }
  }

  private dynamicSort(property: string) {
    let sortOrder = 1;
    if(property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }
    return (a,b) => {
      let result;
      if (typeof(a[property]) == 'string')
        result = (a[property].toUpperCase() < b[property].toUpperCase()) ? -1 : (a[property].toUpperCase() > b[property].toUpperCase()) ? 1 : 0;
      else
        result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;

      return result * sortOrder;
    }
  }

  private dynamicSortMultiple(obj1, obj2) {
    /*
     * save the arguments object as it will be overwritten
     * note that arguments object is an array-like object
     * consisting of the names of the properties to sort by
     */
    let props = arguments;
    return (obj1, obj2) => {
      let i = 0, result = 0, numberOfProperties = props.length;
      /* try getting a different result from 0 (equal)
       * as long as we have extra properties to compare
       */
      while(result === 0 && i < numberOfProperties) {
        result = this.dynamicSort(props[i])(obj1, obj2);
        i++;
      }
      return result;
    }
  }
}
