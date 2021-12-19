import React, { createContext } from 'react';

// Types
import { EdgeValidation } from 'pages/Board/Canvas/Hooks/useValidateStrategy';
import {
  Inputs, Outputs, Elements, InputDependencyGraph, SelectedBlock,
} from 'pages/Board/Canvas/index.types';

type CanvasContextProps = {
  strategyName?: string;
  inputs: Inputs;
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
  setElements: React.Dispatch<React.SetStateAction<Elements>>;
  setOutputs: React.Dispatch<React.SetStateAction<Outputs>>;
  edgeValidation: EdgeValidation;
  outputs: Outputs,
  inputDependencyGraph: InputDependencyGraph;
  isBacktestOpen: boolean;
  onBacktestToggle: () => void;
  onBlockSelectionOpen: () => void;
  isSideDrawerOpen: boolean;
  onSideDrawerOpen: () => void;
  onSideDrawerToggle: () => void;
  onSharingOpen: () => void;
  setSelectedBlock: React.Dispatch<React.SetStateAction<SelectedBlock>>
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
  isSideDrawerOpen: false,
  onSideDrawerOpen: () => undefined,
  onSideDrawerToggle: () => undefined,
  onSharingOpen: () => undefined,
  setSelectedBlock: () => undefined,
});

export default CanvasContext;
