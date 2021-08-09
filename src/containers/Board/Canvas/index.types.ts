import { Elements } from 'react-flow-renderer';

export interface URLParams {
  strategyId: string;
}

export interface ResultsGraphDataRecord {
  title: string;
  data: Array<{
    timestamp: string;
    value: number;
  }>
  xLabel: string;
  yLabel: string;
}

export type ResultsGraphData = Array<ResultsGraphDataRecord>;
interface OutputResults {
  results: {
    cards: Array<{
      label: string;
      value: number;
      type: string;
    }>;
    graphs: ResultsGraphData;
    tables: Array<Record<string, any>>;
  }
}

export type Outputs = Record<string, Array<Record<string, string | number>>> & OutputResults | {};

export type SetElements = React.Dispatch<React.SetStateAction<Elements<any>>>;

export type BlockType = 'DATA_BLOCK' | 'COMPUTATIONAL_BLOCK' | 'SIGNAL_BLOCK' | 'STRATEGY_BLOCK';
