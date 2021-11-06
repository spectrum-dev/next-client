import { useQuery, useMutation, ApolloError } from '@apollo/client';

import {
  Box,
  Button,
  Divider,
  Flex,
  Stack,
  StackDivider,
  Text,
  useColorModeValue as mode,
  useToast,
} from '@chakra-ui/react';
import { HiPlus } from 'react-icons/hi';

// Components
import { Description } from './Description';

import { MUTATION_DELETE_USER_STRATEGY, QUERY_USER_STRATEGIES } from '../gql';

interface GetStrategyRecordResponse {
  strategyId: string;
  strategyName: string;
  createdAt: string;
}

const StrategyList = ({ onCreateStrategyOpen }: { onCreateStrategyOpen: Function }) => {
  const toast = useToast();

  const onError = ({ graphQLErrors }: ApolloError) => {
    toast({
      title: graphQLErrors?.[0].message,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const { data } = useQuery<{ userStrategies: GetStrategyRecordResponse[]; }>(QUERY_USER_STRATEGIES, {
    onError,
  });
  
  const [deleteStrategy] = useMutation(MUTATION_DELETE_USER_STRATEGY, {
    errorPolicy: 'all',
    refetchQueries: [
      QUERY_USER_STRATEGIES,
    ],
    onError,
  });

  const renderStrategies = () => data?.userStrategies.map((item) => {
    const createdAtDate = new Date(item.createdAt);
    return (
      <Description
        key={item.strategyId}
        title={item.strategyName}
        creationDate={`${createdAtDate.toDateString()} at ${createdAtDate.toTimeString()}`}
        strategyId={item.strategyId}
        onDelete={() => deleteStrategy({ variables: { strategyId: item.strategyId } })}
      >
        No Strategy Description ...
      </Description>
    );
  });

  return (
    <Box as="section" py="12" bg={mode('gray.100', 'gray.800')}>
      <Box maxW={{ base: 'xl', md: '7xl' }} mx="auto" px={{ md: '8' }}>
        <Box
          rounded={{ lg: 'lg' }}
          bg={mode('white', 'gray.700')}
          maxW="3xl"
          mx="auto"
          shadow="base"
          overflow="hidden"
        >
          <Flex align="center" justify="space-between" px="6" py="4">
            <Text as="h3" fontWeight="bold" fontSize="lg">
              Strategies
            </Text>
            <Button colorScheme="blue" minW="20" leftIcon={<HiPlus />} onClick={() => onCreateStrategyOpen()}>
              Create
            </Button>
          </Flex>
          <Divider />
          <Stack spacing="6" py="5" px="8" divider={<StackDivider />}>
            { renderStrategies() }
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export { StrategyList };
