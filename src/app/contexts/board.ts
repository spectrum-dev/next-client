import { createContext } from 'react';

import { EdgeValidation } from 'containers/Board/Canvas/useValidateStrategy';
import { Inputs, Outputs } from 'containers/Board/Canvas/index.types';

type BoardContextProps = {
  inputs: Inputs;
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
  edgeValidation: EdgeValidation;
  outputs: Outputs,
  inputDependencyGraph: any;
};

const BoardContext = createContext<BoardContextProps>({
  inputs: {},
  setInputs: () => undefined,
  edgeValidation: {},
  outputs: {},
  inputDependencyGraph: {},
});

export default BoardContext;
