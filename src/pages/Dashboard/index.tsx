import { useState } from 'react';

import {
  Box,
  Flex,
  Stack,
  useColorModeValue as mode,
  useDisclosure,
} from '@chakra-ui/react';

import { BsViewList } from 'react-icons/bs';

// Navbar
import { AccountSwitcher } from './Navbar/AccountSwitcher';
import { NavItem } from './Navbar/NavItem';

// Create Strategy
import { CreateStrategyModal } from './CreateStrategyModal/CreateStrategyModal';

// Strategy List
import { StrategyList } from './StrategyList';

enum PageState {
  Strategies = 'STRATEGIES',
}

const Dashboard = () => {
  const [pageState, setPageState] = useState<PageState>(PageState.Strategies);

  const {
    isOpen: isCreateStrategyOpen,
    onOpen: onCreateStrategyOpen,
    onClose: onCreateStrategyClose,
  } = useDisclosure();

  /**
   * @returns Corresponding Page State
   */
  const renderPage = () => {
    switch (pageState) {
      case PageState.Strategies:
        return <StrategyList onCreateStrategyOpen={onCreateStrategyOpen} />;
      default:
        return <></>;
    }
  };

  return (
    <Box height="100vh" overflow="hidden" position="relative">
      <Flex h="full" id="app-container">
        <Box w="64" bg="gray.900" color="white" fontSize="sm">
          <Flex h="full" direction="column" px="4" py="4">
            <AccountSwitcher />
            <Stack spacing="8" flex="1" overflow="auto" pt="8">
              <NavItem
                active={pageState === PageState.Strategies}
                icon={<BsViewList />}
                label="Strategies"
                onClick={() => setPageState(PageState.Strategies)}
              />
            </Stack>
          </Flex>
        </Box>
        <Box bg={mode('gray.100', 'gray.800')} flex="1" p="6" overflow="scroll">
          <CreateStrategyModal
            isOpen={isCreateStrategyOpen}
            onClose={onCreateStrategyClose}
          />
          {renderPage()}
        </Box>
      </Flex>
    </Box>
  );
};

export default Dashboard;
