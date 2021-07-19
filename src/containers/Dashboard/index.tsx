import { useState } from 'react';

import {
  Box, Circle, Flex, Stack, useColorModeValue as mode, useDisclosure,
} from '@chakra-ui/react';
import {
  BiBuoy,
  BiCog,
  BiHome,
} from 'react-icons/bi';

import {
  BsViewList,
  BsFillGearFill,
} from 'react-icons/bs';

// Navbar
import { AccountSwitcher } from './Navbar/AccountSwitcher';
import { NavGroup } from './Navbar/NavGroup';
import { NavItem } from './Navbar/NavItem';

// Create Strategy
import { CreateStrategyModal } from './CreateStrategy/CreateStrategyModal';

// Strategy List
import { StrategyList } from './StrategyList';

enum PageState {
  GettingStarted = 'GETTING_STARTED',
  Strategies = 'STRATEGIES',
}

const Dashboard = () => {
  const [pageState, setPageState] = useState<String>(PageState.GettingStarted);

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
      case PageState.GettingStarted:
        return <></>;
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
              <Stack spacing="1">
                <NavItem active={pageState === PageState.GettingStarted} icon={<BiHome />} label="Get Started" onClick={() => setPageState(PageState.GettingStarted)} />
              </Stack>
              <NavGroup label="Backtesting Tools">
                <NavItem active={pageState === PageState.Strategies} icon={<BsViewList />} label="Strategies" onClick={() => setPageState(PageState.Strategies)} />
                {/* @ts-ignore */}
                <NavItem icon={<BsFillGearFill />} label="Create Strategy" onClick={onCreateStrategyOpen} />
              </NavGroup>
            </Stack>
            <Box>
              <Stack spacing="1">
                <NavItem subtle icon={<BiCog />} label="Settings" />
                <NavItem
                  subtle
                  icon={<BiBuoy />}
                  label="Help & Support"
                  endElement={<Circle size="2" bg="blue.400" />}
                />
              </Stack>
            </Box>
          </Flex>
        </Box>
        <Box bg={mode('gray.100', 'gray.800')} flex="1" p="6" overflow="scroll">
          <CreateStrategyModal
            isOpen={isCreateStrategyOpen}
            onClose={onCreateStrategyClose}
          />
          { renderPage() }
        </Box>
      </Flex>
    </Box>
  );
};

export default Dashboard;
