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
  strategyId: string;
  commitId: string;
}

interface GetStrategyResponse {
  strategy: {
    flowMetadata: Elements;
    input: Inputs;
    output: Outputs;
    strategy: {
      strategyName: string;
      strategyId: string;
    }
    commitId: string;
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
    strategyId: '',
    commitId: '',
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
      strategyId: writeableData.strategy.strategy.strategyId,
      commitId: writeableData.strategy.commitId,
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
      strategyId,
      commitId: '',
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
