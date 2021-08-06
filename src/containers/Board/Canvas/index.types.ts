import { Elements } from 'react-flow-renderer';

export interface URLParams {
  strategyId: string;
}

export type SetElements = React.Dispatch<React.SetStateAction<Elements<any>>>;
