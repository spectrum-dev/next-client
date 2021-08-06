import { Elements } from 'react-flow-renderer';

export interface URLParams {
  strategyId: string;
}

interface InputBlockInfo {
  blockId: string;
  blockType: string;
}

interface InputForm {
  [key: string]: {
    value: string;
    rawValue?: string;
    options?: Array<string>;
    onChange?: string;
  }
}

export type Inputs = InputBlockInfo & InputForm | {};
export type SetInputs = React.Dispatch<React.SetStateAction<Inputs>>;

export type SetElements = React.Dispatch<React.SetStateAction<Elements<any>>>;
