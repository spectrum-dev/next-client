import { createContext } from 'react';

// Types
import { EdgeValidation } from 'containers/Board/Canvas/useValidateStrategy';
import {
  Inputs, Outputs, Elements, InputDependencyGraph,
} from 'containers/Board/Canvas/index.types';

type BoardContextProps = {
  inputs: Inputs;
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
  setElements: React.Dispatch<React.SetStateAction<Elements>>;
  setOutputs: React.Dispatch<React.SetStateAction<Outputs>>;
  edgeValidation: EdgeValidation;
  outputs: Outputs,
  inputDependencyGraph: InputDependencyGraph;
};

const BoardContext = createContext<BoardContextProps>({
  inputs: {},
  setInputs: () => undefined,
  setElements: () => undefined,
  setOutputs: () => undefined,
  edgeValidation: {},
  outputs: {},
  inputDependencyGraph: {},
});

export default BoardContext;
