import { Box, Text } from '@chakra-ui/react';

import { OptionsBox } from '../../OptionsBox';
import { ReactComponent as Logo } from './black-logo.svg';

const VerticalDivider = () => (
    <Box borderRightStyle="solid" height="2rem" borderRightWidth="1px" borderRightColor="#DEDEE4" />
);

const Brand = ({ top }: { top: string }) => (
    <OptionsBox
        top={top}
        left="0.75rem"
        width="17rem"
        height="3rem"
    >
        <Logo style={{ width: '7rem', height: '2.8rem' }} />
        
        <VerticalDivider />

        <Box margin="0rem 0.75rem">
            <Text fontSize="md" fontWeight="550"> Strategy Name </Text>
        </Box>
    </OptionsBox>
);

export default Brand;
