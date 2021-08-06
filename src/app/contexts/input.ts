import { createContext } from 'react';

import { Inputs, SetInputs } from 'containers/Board/Canvas/index.types';

interface InputContextType {
  inputs: Inputs;
  setInputs: SetInputs;
  edgeValidation: Record<any, any>;
}

const InputContext = createContext<InputContextType>({
  inputs: {},
  setInputs: () => undefined,
  edgeValidation: {},
});

export default InputContext;
