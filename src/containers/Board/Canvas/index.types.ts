import { Elements } from 'react-flow-renderer';

export interface URLParams {
  strategyId: string;
}

// Typings for Outputs
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

// Typings for Inputs

type FormBlockMetadata = {
  blockId: number;
  blockType: BlockType;
};

type FormBlockValues = {
  [fieldName: string]: {
    value: string; // Mandatory field
    rawValue?: string;
    options?: Array<string> | [];
    onChange?: string;
  };
};

type FormBlock = FormBlockMetadata & FormBlockValues;

type VisualizationBlockInputs = {
  yValue: string;
  graphType: VisualizationType;
};

type VisualizationBlock = VisualizationBlockInputs;

// TODO: Investigate more examples of types of inputs that could be passed in here
export type Inputs = Record<string, FormBlock | VisualizationBlock> | {};

// Typings for InputDependencyGraph
export type InputDependencyGraph = {
  [blockIdInFlow: string]: {
    [dependencyGraph: string]: {
      name: string;
      outputInterface: Array<string>;
    }
  }
};

export type SetElements = React.Dispatch<React.SetStateAction<Elements<any>>>;

export type BlockType = 'DATA_BLOCK' | 'COMPUTATIONAL_BLOCK' | 'SIGNAL_BLOCK' | 'STRATEGY_BLOCK';

type VisualizationType = 'Candlestick Graph' | 'Data Table' | 'Line Graph';
