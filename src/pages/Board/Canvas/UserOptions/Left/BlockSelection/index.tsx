import { Box } from '@chakra-ui/react';
import { OptionsBox } from '../../OptionsBox';

import { RiQuestionLine } from 'react-icons/ri';

const BlockSelection = () => (
    <OptionsBox
        top="20vh"
        left="0.75rem"
        width="3.5rem"
        flexDirection="column"
    >
        <Box margin="0.5rem 0rem">
            <RiQuestionLine fontSize={28} />
        </Box>
        <Box margin="0.5rem 0rem">
            <RiQuestionLine fontSize={28} />
        </Box>
        <Box margin="0.5rem 0rem">
            <RiQuestionLine fontSize={28} />
        </Box>
        <Box margin="0.5rem 0rem">
            <RiQuestionLine fontSize={28} />
        </Box>
        <Box margin="0.5rem 0rem">
            <RiQuestionLine fontSize={28} />
        </Box>
    </OptionsBox>
);

export default BlockSelection;