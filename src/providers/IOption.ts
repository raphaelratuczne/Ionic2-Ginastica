export interface IOptions {
  id: number;
  name: string;
  users?: ICompanyUsers;
}

export interface ICompanyUsers {
  login: string;
  pass: string;
}

export interface ICompany {
  id?: number;
  name: string;
  login: string;
  pass: string;
}
