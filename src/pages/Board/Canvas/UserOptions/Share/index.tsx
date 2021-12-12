import { Box, Button } from '@chakra-ui/react';

import { RiQuestionLine } from 'react-icons/ri';

import { OptionsBox } from '../OptionsBox';

const Share = ({ top }: { top: string }) => (
    <OptionsBox
        top={top}
        right="0.75rem"
        width="8rem"
        height="3rem"
    >
        <Box>
            <Button backgroundColor="#4262FF" textColor="white" height="2rem" fontSize="0.8rem" borderRadius="3px"> Share </Button>
        </Box>

        <Box marginLeft="1rem">
            <RiQuestionLine fontSize={28} />
        </Box>
    </OptionsBox>
);

export default Share;
