import { Box, Flex } from '@chakra-ui/react';

import { Dashboard as DashboardPane } from './Dashboard';
import Strategies from './Strategies';
import Settings from './Settings';

import Sidebar from './Sidebar';

type DashboardType = 'DASHBOARD' | 'STRATEGIES' | 'SETTINGS';

const Dashboard = ({ pane }: { pane: DashboardType }) => {
  const renderDashboardPane = () => {
    switch (pane) {
      case 'DASHBOARD':
        return <DashboardPane />;
      case 'STRATEGIES':
        return <Strategies />;
      case 'SETTINGS':
        return <Settings />;
      default:
        return <></>;
    }
  };

  return (
    <>
        <Sidebar />
        <Flex width="calc(100vw - 85px)" minWidth="calc(100vw - 85px)" marginLeft="85px" overflow="hidden" height="100vh" minHeight="100vh" backgroundColor="#FCFDFF">
            <Box minWidth="100%" width="100%">
                {renderDashboardPane()}
            </Box>
        </Flex>
    </>
  );
};

export default Dashboard;
