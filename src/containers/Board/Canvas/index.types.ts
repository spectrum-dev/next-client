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

export interface ResultsTableDataRecord {
  title: string;
  data: Array<Record<string, string | number>>
}

type FlowTableData = Array<Record<string, string | number>>;

export type TableData = ResultsTableDataRecord | FlowTableData;

export type ResultsTableData = Array<ResultsTableDataRecord>;

interface OutputResults {
  results: {
    cards: Array<{
      label: string;
      value: number;
      type: string;
    }>;
    graphs: ResultsGraphData;
    tables: ResultsTableData;
  }
}

export type Outputs = Record<string, Array<Record<string, string | number>>> & OutputResults | {};

export type SetElements = React.Dispatch<React.SetStateAction<Elements<any>>>;

export type BlockType = 'DATA_BLOCK' | 'COMPUTATIONAL_BLOCK' | 'SIGNAL_BLOCK' | 'STRATEGY_BLOCK';
