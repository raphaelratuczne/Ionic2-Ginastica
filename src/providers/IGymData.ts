export interface IGymData {
  id?: number;
  date: string;
  company: string;
  city: string;
  area: string;
  potential: number;
  participants: number;
  absence: string;
  observations: string;
  created_at?: string;
  updated_at?: string;
  synced?: boolean;
  active?: boolean;
}

// objeto de dados da lista
export interface IDataGymList {
  date: string;
  company: string;
  city: string;
  values: Array<IDataAreasList>;
}

// sub objeto de dados da lista
export interface IDataAreasList {
  id: number;
  area: string;
  potential: number;
  participants: number;
  absence: string;
}
