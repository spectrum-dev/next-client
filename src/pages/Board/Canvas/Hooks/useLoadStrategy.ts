import _ from 'lodash';

import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useQuery, ApolloError } from '@apollo/client';

import { useToast } from '@chakra-ui/react';

import {
  URLParams, Inputs, Outputs, Elements,
} from '../index.types';

import { QUERY_STRATEGY } from '../gql';

// Types
interface State {
  hasAccess: boolean;
  isLoaded: boolean;
  inputs: Inputs;
  outputs: Outputs;
  strategyName: string;
}

interface GetStrategyResponse {
  strategy: {
    flowMetadata: Elements;
    input: Inputs;
    output: Outputs;
    strategy: {
      strategyName: string;
    }
  }
}

export default function useLoadStrategy() {
  const [elements, setElements] = useState<Elements>([]);
  const [state, setState] = useState<State>({
    hasAccess: false,
    isLoaded: false,
    inputs: {},
    outputs: {},
    strategyName: '',
  });
  const toast = useToast();
  const { strategyId } = useParams<URLParams>();

  const onCompleted = (data: GetStrategyResponse) => {
    // Apollo does not allow you to mutate variable data so lodash copies the stored data
    const writeableData = _.cloneDeep(data);
    setElements(writeableData.strategy.flowMetadata);
    setState({
      hasAccess: true,
      isLoaded: true,
      inputs: writeableData.strategy.input,
      outputs: writeableData.strategy.output,
      strategyName: writeableData.strategy.strategy.strategyName,
    });
  };

  const onError = ({ graphQLErrors }: ApolloError) => {
    setElements([]);
    setState({
      hasAccess: false,
      isLoaded: true,
      inputs: {},
      outputs: {},
      strategyName: '',
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
