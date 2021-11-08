import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useQuery, ApolloError } from '@apollo/client';

import { useToast } from '@chakra-ui/react';

import {
  URLParams, Inputs, Outputs, Elements,
} from './index.types';

import { QUERY_STRATEGY } from './gql';

// Types
interface State {
  hasAccess: boolean;
  isLoaded: boolean;
  inputs: Inputs;
  outputs: Outputs;
}

interface GetStrategyResponse {
  strategy: {
    flowMetadata: Elements;
    input: Inputs;
    output: Outputs;
  }
}

export default function useLoadStrategy() {
  const [elements, setElements] = useState<Elements>([]);
  const [state, setState] = useState<State>({
    hasAccess: false,
    isLoaded: false,
    inputs: {},
    outputs: {},
  });
  const toast = useToast();
  const { strategyId } = useParams<URLParams>();

  const onCompleted = (data: GetStrategyResponse) => {
    console.log(data);
    setElements(data.strategy.flowMetadata);
    setState({
      hasAccess: true,
      isLoaded: true,
      inputs: data.strategy.input,
      outputs: data.strategy.output,
    });
  };

  const onError = ({ graphQLErrors }: ApolloError) => {
    setElements([]);
    setState({
      hasAccess: false,
      isLoaded: true,
      inputs: {},
      outputs: {},
    });

    toast({
      title: graphQLErrors[0].message,
      status: 'error',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  };

  useQuery(QUERY_STRATEGY, { variables: { strategyId }, onCompleted, onError });

  return {
    ...state,
    elements,
    setElements,
  };
}
