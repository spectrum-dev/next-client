import { createContext } from 'react';

// Types
import { EdgeValidation } from 'containers/Board/Canvas/useValidateStrategy';
import {
  Inputs, Outputs, Elements, InputDependencyGraph,
} from 'containers/Board/Canvas/index.types';

type CanvasContextProps = {
  strategyName?: string;
  inputs: Inputs;
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
  setElements: React.Dispatch<React.SetStateAction<Elements>>;
  setOutputs: React.Dispatch<React.SetStateAction<Outputs>>;
  edgeValidation: EdgeValidation;
  outputs: Outputs,
  inputDependencyGraph: InputDependencyGraph;
  isBacktestOpen?: boolean;
  onBacktestToggle?: () => void;
  onBlockSelectionOpen?: () => void;
};

const CanvasContext = createContext<CanvasContextProps>({
  strategyName: '',
  inputs: {},
  setInputs: () => undefined,
  setElements: () => undefined,
  setOutputs: () => undefined,
  edgeValidation: {},
  outputs: {},
  inputDependencyGraph: {},
  isBacktestOpen: false,
  onBacktestToggle: () => undefined,
  onBlockSelectionOpen: () => undefined,
});

export default CanvasContext;
