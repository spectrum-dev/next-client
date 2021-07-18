import { Box, IconButton } from '@chakra-ui/react';

import { RiSaveFill } from 'react-icons/ri';
import { BsPlayFill } from 'react-icons/bs';

const Controls = () => (
  <Box zIndex={10} position="absolute" top="90%" right="45%" background="#1a202c" borderRadius="30px" padding="0px 10px 0px 10px" justify="center">
    <IconButton aria-label="Search database" icon={<RiSaveFill color="white" size={20} />} background="#1a202c" onClick={() => console.log('clicked')} />
    <IconButton aria-label="Search database" icon={<BsPlayFill color="white" size={20} />} background="#1a202c" onClick={() => console.log('clicked')} />
  </Box>
);

export default Controls;
