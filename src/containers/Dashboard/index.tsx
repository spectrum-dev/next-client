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

import { AccountSwitcher } from './AccountSwitcher';
import { NavGroup } from './NavGroup';
import { NavItem } from './NavItem';
import { CreateStrategyModal } from './CreateStrategyModal';

const Dashboard = () => {
  const {
    isOpen: isCreateStrategyOpen,
    onOpen: onCreateStrategyOpen,
    onClose: onCreateStrategyClose,
  } = useDisclosure();

  return (
    <Box height="100vh" overflow="hidden" position="relative">
      <Flex h="full" id="app-container">
        <Box w="64" bg="gray.900" color="white" fontSize="sm">
          <Flex h="full" direction="column" px="4" py="4">
            <AccountSwitcher />
            <Stack spacing="8" flex="1" overflow="auto" pt="8">
              <Stack spacing="1">
                <NavItem active icon={<BiHome />} label="Get Started" />
              </Stack>
              <NavGroup label="Backtesting Tools">
                <NavItem icon={<BsViewList />} label="Strategies" />
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
        <Box bg={mode('white', 'gray.800')} flex="1" p="6">
          <CreateStrategyModal
            isOpen={isCreateStrategyOpen}
            onClose={onCreateStrategyClose}
          />
          <Box
            w="full"
            h="full"
            rounded="lg"
            border="3px dashed currentColor"
            color={mode('gray.200', 'gray.700')}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default Dashboard;
