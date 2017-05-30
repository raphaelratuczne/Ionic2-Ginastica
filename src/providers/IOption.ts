// interface de dados da tabela options
export interface IOptions {
  id: number;
  name: string;
  users?: ICompanyUsers;
}

// interface de usuarios das empresas
export interface ICompanyUsers {
  email: string;
  login: string;
  pass: string;
  active: boolean;
  synced: boolean;
}

// interface de dados das empresas
export interface ICompany {
  id?: number;
  name: string;
  email: string;
  login: string;
  pass: string;
}
