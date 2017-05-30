import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { IOptions, ICompany } from './IOption';

@Injectable()
export class OptionsDataService {

  /** listas de dados */
  private companies: IOptions[];
  private cities: IOptions[];
  private areas: IOptions[];
  private absences: IOptions[];
  /** referencia do sqlite */
  private db: SQLiteObject;

  /** instancia dependencias e cria ou conecta ao banco de dados */
  constructor(private platform: Platform,
              private sqlite: SQLite,
              private http: Http) {

    console.log('Hello OptionsDataService');

    this.platform.ready().then(() => {
      if ( this.platform.is('cordova') ) {

        // cria ou conecta ao banco de dados
        this.sqlite.create({
          name: 'data.db',
          location: 'default'
        })
        .then( (_db: SQLiteObject) => {
          this.db = _db;
          this.db.executeSql('CREATE TABLE IF NOT EXISTS options (id INTEGER PRIMARY KEY, name VARCHAR(255), type CHAR(10), users VARCHAR(255));', {})
            .then(() => {
              console.log('Criou tabela options');

              this.db.executeSql('SELECT count(*) AS total FROM options;', {})
                .then(resp => {
                  if ( resp.rows.item(0).total < 1 ) {
                    let sqlu = 'INSERT INTO options (name, type, users) VALUES (?,?,?)';
                    let sql = 'INSERT INTO options (name, type) VALUES (?,?)';
                    this.db.executeSql(sqlu, ['Empresa de Teste', 'company', JSON.stringify({email:'empresateste@email.com', login:'teste1', pass:'teste1', active:true, synced:false})]);
                    this.db.executeSql(sqlu, ['Teste de Empresa', 'company', JSON.stringify({email:'testeempresa@email.com', login:'teste2', pass:'teste2', active:true, synced:false})]);
                    this.db.executeSql(sqlu, ['Mais um teste', 'company', JSON.stringify({email:'maisumteste@email.com', login:'teste3', pass:'teste3', active:false, synced:false})]);
                    this.db.executeSql(sql, ['Navegantes', 'city']);
                    this.db.executeSql(sql, ['Itajai', 'city']);
                    this.db.executeSql(sql, ['Secretaria', 'area']);
                    this.db.executeSql(sql, ['Atendimento', 'area']);
                    this.db.executeSql(sql, ['Produção', 'area']);
                    this.db.executeSql(sql, ['Sessão Realizada', 'absence']);
                    this.db.executeSql(sql, ['Doença', 'absence']);
                    this.db.executeSql(sql, ['Atraso', 'absence']);
                    this.db.executeSql(sql, ['Dispensa da Empresa', 'absence']);
                    this.db.executeSql(sql, ['Atestado', 'absence']);
                    this.db.executeSql(sql, ['Cancelamento de Sessão', 'absence']);
                    this.db.executeSql(sql, ['Reunião', 'absence']);
                    // .then(() => console.log('Populou tabela options') )
                    // .catch(e => console.log(e));
                  }
                })
                .catch( this.handleError );

            })
            .catch(e => console.log(e));

        })

      } else {
        this.companies = [{ id: 1, name: 'Empresa de Teste', users: {email:'empresateste@email.com', login:'teste1', pass:'teste1', active:true, synced:false} },
                          { id: 2, name: 'Teste de Empresa', users: {email:'testeempresa@email.com', login:'teste2', pass:'teste2', active:true, synced:false}  },
                          { id: 3, name: 'Mais um teste', users: {email:'maisumteste@email.com', login:'teste3', pass:'teste3', active:true, synced:false}  }];

        this.cities = [{ id: 1, name: 'Navegantes' },
                       { id: 2, name: 'Itajai' }];

        this.areas = [ { id: 1, name: 'Secretaria' },
                        { id: 2, name: 'Atendimento' },
                        { id: 3, name: 'Produção' }];

        this.absences = [ { id: 1, name: 'Sessão Realizada' },
                          { id: 2, name: 'Doença' },
                          { id: 3, name: 'Atraso' },
                          { id: 4, name: 'Dispensa da Empresa' },
                          { id: 5, name: 'Atestado' },
                          { id: 6, name: 'Cancelamento de Sessão' },
                          { id: 7, name: 'Reunião' }];
      }
    });
  }

  /**
   * extrai dados das consultas
   * @param {any} res resultado da consultas
   * @return {Array<IOptions>} resultado extraido
   */
  private extractOptions(res: any): Array<IOptions> {
    // console.log('deu certo \\o/', res);
    let opt = [];
    for (let i = 0; i < res.rows.length; i++) {
      opt.push(res.rows.item(i));
    }
    return opt;
  }

  /**
   * funcao de erro
   * @param {any} error objeto do erro
   * @return {any} objeto de erro
   */
  private  handleError(error: any): any {
    console.log('deu erro T_T', error);
    return error;
  }

  /**
   * retorna lista de empresas
   * @return {Promise<IOptions[]>} lista de empresas
   */
  getCompanies(): Promise<IOptions[]> {
    if ( this.platform.is('cordova') ) {
    return this.db.executeSql(`SELECT id,name,users FROM options WHERE type = 'company' AND users LIKE '%"active":true%' ORDER BY name`, {})
        .then( res => {
          let opt = [];
          for (let i = 0; i < res.rows.length; i++) {
            opt.push({
              id: res.rows.item(i).id,
              name: res.rows.item(i).name,
              users: JSON.parse(res.rows.item(i).users)
            });
          }
          console.log(opt);
          return opt;
        })
        .catch( this.handleError );

    } else {
      return Promise.resolve( this.companies.sort(this.dynamicSort('name')) );
    }
  }

  /**
   * adiciona empresa
   * @param {ICompany} company objeto (empresa,usuario,senha)
   * @return {Promise<IOptions[]>} lista de empresas
   */
  addCompany(company:ICompany): Promise<IOptions[]> {
    if ( this.platform.is('cordova') ) {
      let sql = 'INSERT INTO options (name, type, users) VALUES (?,?,?)';
      return this.db.executeSql(sql,[company.name, 'company', JSON.stringify({email:company.email, login:company.login, pass:company.pass, active:true, synced:false})])
        .then(() => {return this.getCompanies()} )
        .catch(e => console.log(e));

    } else {
      let id = this.companies.reduce((prev,curr) => { return prev.id > curr.id ? prev : curr; }).id + 1;
      this.companies.push({ id:id, name:company.name, users: {email:company.email, login:company.login, pass:company.pass, active:true, synced:false} });
      return Promise.resolve( this.companies.sort(this.dynamicSort('name')) );
    }
  }

  /**
   * altera empresa
   * @param {ICompany} company obeto (id,empresa,usuario,senha)
   * @return {Promise<IOptions[]>} lista de empresas
   */
  updateCompany(company:ICompany): Promise<IOptions[]> {
    if ( this.platform.is('cordova') ) {
      let sql = 'UPDATE options SET name = (?), users = (?) WHERE id = (?)';
      return this.db.executeSql(sql,[company.name, JSON.stringify({email:company.email, login:company.login, pass:company.pass, active:true, synced:false}), company.id])
        .then(() => {return this.getCompanies()} )
        .catch(e => console.log(e));

    } else {
      for(let i in this.companies) {
        if (this.companies[i].id == company.id) {
          this.companies[i].name = company.name;
          this.companies[i].users = {email:company.email, login:company.login, pass:company.pass, active:true, synced:false};
        }
      }
      return Promise.resolve( this.companies.sort(this.dynamicSort('name')) );
    }
  }

  /**
   * exclui empresa
   * @param {Array<number>} arrIds lista de ids
   * @return {Promise<IOptions[]>} lista de empresas
   */
  deleteCompanies(arrIds:Array<number>): Promise<IOptions[]> {
    if ( this.platform.is('cordova') ) {
      let arr = arrIds.map(el => {return '?'}).join(',');
      let arrData = ['"active":true','"active":false','"synced":true','"synced":false'].concat(<any[]>arrIds);
      let sql = `UPDATE options SET users = REPLACE(users, (?), (?)), users = REPLACE(users, (?), (?)) WHERE id IN (${arr});`;
      return this.db.executeSql(sql, arrData)
        .then(() => {return this.getCompanies();} )
        .catch(e => console.log(e));

    } else {
      for(let id of arrIds) {
        for(let i in this.companies) {
          if(this.companies[i].id == id) {
            this.companies.splice(parseInt(i), 1);
            break;
          }
        }
      }
      return Promise.resolve( this.companies.sort(this.dynamicSort('name')) );
    }
  }

  /**
   * retorna lista de cidades
   * @return {Promise<IOptions[]>} lista de cidades
   */
  getCities(): Promise<IOptions[]> {
    if ( this.platform.is('cordova') ) {
      return this.db.executeSql('SELECT id,name FROM options WHERE type = "city" ORDER BY name', {})
        .then( this.extractOptions )
        .catch( this.handleError );

    } else {
      return Promise.resolve( this.cities.sort(this.dynamicSort('name')) );
    }
  }

  /**
   * adicionar cidade
   * @param {string} city nome da cidade
   * @return {Promise<IOptions[]>} lista de cidades
   */
  addCity(city:string): Promise<IOptions[]> {
    if ( this.platform.is('cordova') ) {
      let sql = 'INSERT INTO options (name, type) VALUES (?,?)';
      return this.db.executeSql(sql,[city, 'city'])
        .then(() => {return this.getCities()} )
        .catch(e => console.log(e));

    } else {
      let id = this.cities.reduce((prev,curr) => { return prev.id > curr.id ? prev : curr; }).id + 1;
      this.cities.push({ id: id, name: city });
      return Promise.resolve( this.cities.sort(this.dynamicSort('name')) );
    }
  }

  /**
   * altera cidade
   * @param {IOptions} city objeto (id,cidade)
   * @return {Promise<IOptions[]>} lista de cidades
   */
  updateCity(city:IOptions): Promise<IOptions[]> {
    if ( this.platform.is('cordova') ) {
      let sql = 'UPDATE options SET name = (?) WHERE id = (?)';
      return this.db.executeSql(sql,[city.name, city.id])
        .then(() => {return this.getCities()} )
        .catch(e => console.log(e));

    } else {
      for(let i in this.cities) {
        if (this.cities[i].id == city.id) {
          this.cities[i].name = city.name;
        }
      }
      return Promise.resolve( this.cities.sort(this.dynamicSort('name')) );
    }
  }

  /**
   * exclui cidade
   * @param {Array<number>} arrIds lista de ids
   * @return {Promise<IOptions[]>} lista de cidades
   */
  deleteCities(arrIds:Array<number>): Promise<IOptions[]> {
    if ( this.platform.is('cordova') ) {
      let arr = arrIds.map(el => {return '?'}).join(',');
      let sql = 'DELETE FROM options WHERE id IN ('+arr+');';
      return this.db.executeSql(sql, arrIds)
        .then(() => {return this.getCities();} )
        .catch(e => console.log(e));

    } else {
      for(let id of arrIds) {
        for(let i in this.cities) {
          if(this.cities[i].id == id) {
            this.cities.splice(parseInt(i), 1);
            break;
          }
        }
      }
      return Promise.resolve( this.cities.sort(this.dynamicSort('name')) );
    }
  }

  /**
   * retorna lista de grupos
   * @return {Promise<IOptions[]>} lista de grupos
   */
  getAreas(): Promise<IOptions[]> {
    if ( this.platform.is('cordova') ) {
      return this.db.executeSql('SELECT id,name FROM options WHERE type = "area" ORDER BY name', {})
        .then( this.extractOptions )
        .catch( this.handleError );

    } else {
      return Promise.resolve( this.areas.sort(this.dynamicSort('name')) );
    }
  }

  /**
   * adiciona grupo
   * @param {string} area nome do grupo
   * @return {Promise<IOptions[]>} lista de grupos
   */
  addArea(area:string): Promise<IOptions[]> {
    if ( this.platform.is('cordova') ) {
      let sql = 'INSERT INTO options (name, type) VALUES (?,?)';
      return this.db.executeSql(sql,[area, 'area'])
        .then(() => {return this.getAreas()} )
        .catch(e => console.log(e));

    } else {
      let id = this.areas.reduce((prev,curr) => { return prev.id > curr.id ? prev : curr; }).id + 1;
      this.areas.push({ id: id, name: area });
      return Promise.resolve( this.areas.sort(this.dynamicSort('name')) );
    }
  }

  /**
   * altera grupo
   * @param {IOptions} area objeto (id,grupo)
   * @return {Promise<IOptions[]>} lista de grupos
   */
  updateArea(area:IOptions): Promise<IOptions[]> {
    if ( this.platform.is('cordova') ) {
      let sql = 'UPDATE options SET name = (?) WHERE id = (?)';
      return this.db.executeSql(sql,[area.name, area.id])
        .then(() => {return this.getAreas()} )
        .catch(e => console.log(e));

    } else {
      for(let i in this.areas) {
        if (this.areas[i].id == area.id) {
          this.areas[i].name = area.name;
        }
      }
      return Promise.resolve( this.areas.sort(this.dynamicSort('name')) );
    }
  }

  /**
   * exclui grupo
   * @param {Array<number>} arrIds lista de ids
   * @return {Promise<IOptions[]>} lista de grupos
   */
  deleteAreas(arrIds:Array<number>): Promise<IOptions[]> {
    if ( this.platform.is('cordova') ) {
      let arr = arrIds.map(el => {return '?'}).join(',');
      let sql = 'DELETE FROM options WHERE id IN ('+arr+')';
      return this.db.executeSql(sql, arrIds)
        .then(() => {return this.getAreas();} )
        .catch(e => console.log(e));

    } else {
      for(let id of arrIds) {
        for(let i in this.areas) {
          if(this.areas[i].id == id) {
            this.areas.splice(parseInt(i), 1);
            break;
          }
        }
      }
      return Promise.resolve( this.areas.sort(this.dynamicSort('name')) );
    }
  }

  /**
   * retorna lista de faltas
   * @return {Promise<IOptions[]>} lista de faltas
   */
  getAbsences(): Promise<IOptions[]> {
    if ( this.platform.is('cordova') ) {
      return this.db.executeSql('SELECT id,name FROM options WHERE type = "absence" ORDER BY name', {})
        .then( this.extractOptions )
        .catch( this.handleError );

    } else {
      return Promise.resolve( this.absences.sort(this.dynamicSort('name')) );
    }
  }

  /**
   * adiciona falta
   * @param {string} absence falta
   * @return {Promise<IOptions[]>} lista de faltas
   */
  addAbsence(absence:string): Promise<IOptions[]> {
    if ( this.platform.is('cordova') ) {
      let sql = 'INSERT INTO options (name, type) VALUES (?,?)';
      return this.db.executeSql(sql,[absence, 'absence'])
        .then(() => {return this.getAbsences()} )
        .catch(e => console.log(e));

    } else {
      let id = this.absences.reduce((prev,curr) => { return prev.id > curr.id ? prev : curr; }).id + 1;
      this.absences.push({ id: id, name: absence });
      return Promise.resolve( this.absences.sort(this.dynamicSort('name')) );
    }
  }

  /**
   * atualiza falta
   * @param {IOptions} absence objeto (id,falta)
   * @return {Promise<IOptions[]>} lista de faltas
   */
  updateAbsence(absence:IOptions): Promise<IOptions[]> {
    if ( this.platform.is('cordova') ) {
      let sql = 'UPDATE options SET name = (?) WHERE id = (?)';
      return this.db.executeSql(sql,[absence.name, absence.id])
        .then(() => {return this.getAbsences()} )
        .catch(e => console.log(e));

    } else {
      for(let i in this.absences) {
        if (this.absences[i].id == absence.id) {
          this.absences[i].name = absence.name;
        }
      }
      return Promise.resolve( this.absences.sort(this.dynamicSort('name')) );
    }
  }

  /**
   * exclui faltas
   * @param {Array<number>} arrIds lista de ids
   * @return {Promise<IOptions[]>} lista de faltas
   */
  deleteAbsences(arrIds:Array<number>): Promise<IOptions[]> {
    if ( this.platform.is('cordova') ) {
      let arr = arrIds.map(el => {return '?'}).join(',');
      let sql = 'DELETE FROM options WHERE id IN ('+arr+')';
      return this.db.executeSql(sql, arrIds)
        .then(() => {return this.getAbsences();} )
        .catch(e => console.log(e));

    } else {
      for(let id of arrIds) {
        for(let i in this.absences) {
          if(this.absences[i].id == id) {
            this.absences.splice(parseInt(i), 1);
            break;
          }
        }
      }
      return Promise.resolve( this.absences.sort(this.dynamicSort('name')) );
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

}
