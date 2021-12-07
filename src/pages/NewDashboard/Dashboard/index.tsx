import { useContext } from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { RiPlug2Line } from 'react-icons/ri';

import InfoPane from 'components/InfoPane';

import DashboardContext from 'app/contexts/dashboard';

const NoActiveStrategies = () => {
  const { onCreateStrategyOpen } = useContext(DashboardContext);

  return (
        <Flex borderColor="#E6E9F3" borderStyle="dashed" borderWidth="1px" flexDirection="column" align="center">
            <Box margin="5rem 0rem 3rem 0rem" align="center">
                <Box marginBottom="1rem">
                    <RiPlug2Line fontSize={41} />
                </Box>
                <Text fontSize="xl" fontWeight="500" marginBottom="0.5rem"> Create or start a strategy </Text>
                <Text fontSize="sm" fontWeight="300"> Running strategies will be shown to you here once they are started </Text>
            </Box>
    
            <Flex marginBottom="5rem">
                <Button colorScheme='blue' size='md' marginRight="1rem" onClick={() => onCreateStrategyOpen()}> Create a strategy </Button>
                <Button colorScheme='blue' size='md' disabled> Start your strategy </Button>
            </Flex>
        </Flex>
  );
};

const Dashboard = () => {
  return (
        <InfoPane title="Active Strategies" description="List of your running bots with real or virtual money">
            <NoActiveStrategies />
        </InfoPane>
  );
};

export { Dashboard };
