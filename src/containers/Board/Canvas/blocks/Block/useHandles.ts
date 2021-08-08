import { useState, useEffect, useCallback } from 'react';

interface State {
  inputHandle: boolean;
  outputHandle: boolean;
}

export default function useHandles({ validationData }: { validationData: any }) {
  const [state, setState] = useState<State>({
    inputHandle: false,
    outputHandle: false,
  });

  const renderHandles = useCallback(() => {
    if (validationData) {
      // Determines if there are inputs, and if so render an input handle
      if (validationData.input.required.length > 0) {
        setState((prevState: State) => ({ ...prevState, inputHandle: true }));
      }

      // Determines if there are outputs, and if so render an output handle
      if (validationData.output.length > 0) {
        setState((prevState: State) => ({ ...prevState, outputHandle: true }));
      }
    }
  }, [validationData]);

  useEffect(() => {
    renderHandles();
  }, [renderHandles, validationData]);

  return state;
}
