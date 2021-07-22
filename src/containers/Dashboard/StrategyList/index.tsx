import {
  Box,
  Button,
  Divider,
  Flex,
  Stack,
  StackDivider,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { HiPlus } from 'react-icons/hi';

// Hooks
import useGetAllStrategies from './useGetAllStrategies';
import useDeleteStrategy from './useDeleteStrategy';

// Components
import { Description } from './Description';

const StrategyList = ({ onCreateStrategyOpen }: { onCreateStrategyOpen: Function }) => {
  const [allStrategies, setAllStrategies] = useGetAllStrategies();
  const { onDelete } = useDeleteStrategy({ setAllStrategies });

  const renderStrategies = () => {
    if (allStrategies && Array.isArray(allStrategies)) {
      return allStrategies.map((item) => {
        const createdAtDate = new Date(item.created_at);

        return (
          <Description
            key={item.strategy_id}
            title={item.strategy_name}
            creationDate={`${createdAtDate.toDateString()} at ${createdAtDate.toTimeString()}`}
            strategyId={item.strategy_id}
            onDelete={onDelete}
          >
            No Strategy Description ...
          </Description>
        );
      });
    }
    return <></>;
  };

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
