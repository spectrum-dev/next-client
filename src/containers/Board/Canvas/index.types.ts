import { Elements } from 'react-flow-renderer';

export interface URLParams {
  strategyId: string;
}

interface OutputResults {
  results: {
    cards: Array<{
      label: string;
      value: number;
      type: string;
    }>;
    graphs: Array<Record<string, any>>;
    tables: Array<Record<string, any>>;
  }
}

export type Outputs = Record<string, Array<Record<string, string | number>>> & OutputResults | {};

export type SetElements = React.Dispatch<React.SetStateAction<Elements<any>>>;
