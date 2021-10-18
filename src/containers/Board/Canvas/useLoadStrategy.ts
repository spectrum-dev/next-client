import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import fetcher from 'app/fetcher';

import {
  URLParams, Inputs, Outputs, Elements,
} from './index.types';

const POST_LOAD_STRATEGY_500 = 'There was an error loading your strategy. Please refresh the page.';

// Types
interface State {
  hasAccess: boolean;
  isLoaded: boolean;
  inputs: Inputs;
  outputs: Outputs;
}

interface GetStrategyResponse {
  elements: Elements;
  inputs: Inputs;
  outputs: Outputs;
}

export default function useLoadStrategy() {
  const [elements, setElements] = useState<Elements>([]);
  const [state, setState] = useState<State>({
    hasAccess: false,
    isLoaded: false,
    inputs: {},
    outputs: {},
  });
  const { strategyId } = useParams<URLParams>();

  const fetchData = useCallback(async () => {
    try {
      const getStrategyResponse = await fetcher.get(`/strategy/${strategyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (getStrategyResponse.status === 200) {
        const response: GetStrategyResponse = getStrategyResponse.data;
        setState(() => {
          setElements(response.elements);

          return {
            hasAccess: true,
            isLoaded: true,
            inputs: response.inputs,
            outputs: response.outputs,
          };
        });
      } else {
        throw new Error(POST_LOAD_STRATEGY_500);
      }
    } catch (e) {
      setState(() => {
        setElements([]);

        return {
          hasAccess: false,
          isLoaded: true,
          inputs: {},
          outputs: {},
        };
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyId]);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyId]);

  return {
    ...state,
    elements,
    setElements,
  };
}
