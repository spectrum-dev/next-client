import { Box, Flex, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { RiDashboard2Line, RiFlaskLine, RiLoginCircleLine, RiSettings2Line, RiBookLine } from 'react-icons/ri';

import { ReactComponent as Logo } from './black-logo.svg';

const SidebarElement = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <Tooltip hasArrow label={label} placement='right' offset={[0, 37]}>
        <Box marginTop="1.5rem" marginBottom="1.5rem">
            {children}
        </Box>
    </Tooltip>
);

const Divider = () => (
    <Box borderBottomWidth="1px" borderBottomStyle="solid" borderBottomColor="#e7e9f3" minWidth="100%" />
);

const Sidebar = () => (
    <Box position="fixed" left="0px" top="0px" height="100%" width="85px" backgroundColor="white" boxSizing="border-box" zIndex="30" borderRightWidth="1px" borderRightStyle="solid" borderRightColor="#e7e9f3">
        <Flex borderBottomWidth="1px" borderBottomStyle="solid" borderBottomColor="#e7e9f3" justifyContent="center" alignItems="center">
            <Logo style={{ width: '10rem', height: '5rem', padding: '0.7rem' }} />
        </Flex>

        <Flex justifyContent="center" alignItems="center" flexDirection="column" justify="space-between" marginTop="1.5rem">
            <SidebarElement label="Dashboard">
                <RiDashboard2Line size={28} color="#9D9DBF" />
            </SidebarElement>
            
            <SidebarElement label="Strategies">
                <RiFlaskLine size={28} color="#9D9DBF"/>
            </SidebarElement>
        </Flex>

        <Flex justifyContent="center" alignItems="center" bottom="0px" position="absolute" width="100%" borderTopWidth="1px" borderRightStyle="solid" borderRightColor="#e7e9f3" flexDirection="column">
            <SidebarElement label="Documentation">
                <RiBookLine size={28} color="#9D9DBF" />
            </SidebarElement>
            
            <Divider />

            <SidebarElement label="Settings">
                <RiSettings2Line size={28} color="#9D9DBF" />
            </SidebarElement>

            <Divider />

            <SidebarElement label="Log Out">
                <RiLoginCircleLine size={28} color="#9D9DBF" />
            </SidebarElement>
        </Flex>
    </Box>
);

export default Sidebar;
