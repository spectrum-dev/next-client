import { Node as ReactFlowNode, Edge as ReactFlowEdge, isNode as isReactFlowNode } from 'react-flow-renderer';

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

export type FormBlockValues = {
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
  dataKey: string;
  dataKeys: Array<string>;
};

type VisualizationBlock = VisualizationBlockInputs;

// TODO: Investigate more examples of types of inputs that could be passed in here
export type Inputs = {
  [blockIdInFlow: string]: FormBlock & VisualizationBlock;
};

export type SetInputs = React.Dispatch<React.SetStateAction<Inputs>>;

// Typings for InputDependencyGraph
export type InputDependencyGraph = {
  [blockIdInFlow: string]: {
    [dependencyGraph: string]: {
      name: string;
      outputInterface: Array<string>;
    }
  }
};

export type NodeMetadataInputs = {
  fieldData: {
    base: string;
    method: 'GET' | 'POST';
    onChange?: string;
    data?: Array<string>;
  }
  fieldName: string;
  fieldType: 'search' | 'dropdown' | 'input' | '...'
  fieldVariableName: string;
  fieldVariableNames?: Array<string>;
};

export type FormNode = ReactFlowNode<{
  metadata: {
    blockId: number;
    blockType: BlockType;
    blockName: string;
    inputs: Array<NodeMetadataInputs>;
    validation: {
      input: {
        required: Array<{
          number: string;
          blockType: string
        }>;
        allowed_blocks: Array<{
          blockId: string;
          blockType: BlockType;
        }>;
      };
      output: Array<{
        number: string;
        blockType: BlockType;
      }>
    }
    outputInterface: {
      interface: Array<string>;
    }
    isMenuVisible: boolean;
  }
}>;

export type VisualizationNode = ReactFlowNode<Array<{
  [key: string]: string | number | boolean;
}>>;

export type ResultsNode = ReactFlowNode<{
  label: string;
  isMenuVisible: boolean;
}>;

export type Node = FormNode | VisualizationNode | ResultsNode;

export type Edge = ReactFlowEdge<{
  id: string;
  type: 'flowEdge' | 'visualizationEdge';
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
}>;

export type FlowElement = Node | Edge;

// Type Guards
export function isFormNode(element: FlowElement): element is FormNode {
  return isReactFlowNode(element) && Object.keys(element?.data || {}).includes('metadata');
}

export function isVisualizationNode(element: FlowElement): element is VisualizationNode {
  return isReactFlowNode(element) && Object.keys(element).includes('data') && Array.isArray(element.data);
}

export function isResultsNode(element: FlowElement): element is ResultsNode {
  return isReactFlowNode(element) && Object.keys(element?.data || {}).includes('label');
}

// Typing for Elements
export type Elements = Array<FlowElement>;

export type SetElements = React.Dispatch<React.SetStateAction<Elements>>;

export type BlockType = 'DATA_BLOCK' | 'COMPUTATIONAL_BLOCK' | 'SIGNAL_BLOCK' | 'STRATEGY_BLOCK';

export enum VisualizationType {
  Line = 'Line Graph',
  Candlestick = 'Candlestick Graph',
  DataTable = 'Data Table',
}

// Strategy Types
export type StrategyType = 'BACKTEST' | 'SCREENER' | 'PENDING';
