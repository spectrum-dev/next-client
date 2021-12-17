import { useContext } from 'react';
import { useQuery, ApolloError } from '@apollo/client';

import {
  Heading, Flex, Tag, Spacer, Button, useToast,
} from '@chakra-ui/react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';

import { QUERY_USER_STRATEGY } from './gql';

// Contexts
import BoardContext from 'app/contexts/board';

// Types
import { URLParams } from '../../../pages/Board/Canvas/index.types';


const TopBar = ({ onShareOpen }: { onShareOpen: any }) => {
  const { strategyType } = useContext(BoardContext);
  
  const history = useHistory();
  const toast = useToast();
  const { strategyId } = useParams<URLParams>();
  
  const onStrategyInformationError = ({ graphQLErrors }: ApolloError) => {
    toast({
      title: graphQLErrors?.[0].message,
      status: 'error',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  };

  const { data } = useQuery(QUERY_USER_STRATEGY, { variables: { strategyId }, onError: onStrategyInformationError });

  return (
    <Flex w="full" justifyContent="space-evenly">
      <Flex sx={{ 'svg:hover': { fill: 'grey' } }}>
        <IoIosArrowBack
          fontSize={23}
          onClick={() => history.push('/dashboard')}
        />
        <Tag marginLeft="20px">
          {strategyType}
        </Tag>
      </Flex>

      <Spacer />

      <Flex>
        <Heading fontSize="18">
          {data?.userStrategy && data?.userStrategy?.strategyName}
        </Heading>
      </Flex>

      <Spacer />

      <Flex>
        <Button size="xs" backgroundColor="#2D3748" color="white" onClick={() => onShareOpen()}>
          Share
        </Button>
      </Flex>
    </Flex>
  );
};

export default TopBar;
