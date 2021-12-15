import { Box } from '@chakra-ui/react';
import { OptionsBox } from '../../OptionsBox';

import { FaMousePointer } from 'react-icons/fa';
import { CgBox } from 'react-icons/cg';

const BlockSelection = () => (
    <OptionsBox
        top="20vh"
        left="0.75rem"
        width="3.5rem"
        flexDirection="column"
    >
        <Box margin="1.0rem 0rem 0rem 0rem">
            <FaMousePointer fontSize={20} />
        </Box>
        <Box margin="1.5rem 0rem 1.0rem 0rem">
            <CgBox fontSize={22} />
        </Box>
    </OptionsBox>
);

export default BlockSelection;