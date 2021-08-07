import { Elements } from 'react-flow-renderer';

export interface URLParams {
  strategyId: string;
}

interface InputsMetadata {
  [key: string]: {
    blockId: string;
    blockType: string;
  }
}

interface BlockInputsForm {
  [key: string]: {
    [form_value: string]: {
      value: string;
      rawValue?: string;
      options?: Array<string> | { label: string; value: string };
      onChange?: string;
    }
  }
}

interface VisualizationBlockInputForm {
  [key: string]: {
    xValue: string; // TODO: Check this
    yValue: string;
    graphType: string;
  }
}

export type Inputs = InputsMetadata & BlockInputsForm & VisualizationBlockInputForm;
export type SetInputs = React.Dispatch<React.SetStateAction<Inputs>>;

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
