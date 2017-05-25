export interface IOptions {
  id: number;
  name: string;
  users?: ICompanyUsers;
}

export interface ICompanyUsers {
  email: string;
  login: string;
  pass: string;
  active: boolean;
  synced: boolean;
}

export interface ICompany {
  id?: number;
  name: string;
  email: string;
  login: string;
  pass: string;
}
