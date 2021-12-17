import { useContext } from 'react';

import CanvasContext from 'app/contexts/canvas';

import { Box } from '@chakra-ui/react';
import { OptionsBox } from '../../OptionsBox';

import { FaMousePointer } from 'react-icons/fa';
import { GiCheckboxTree } from 'react-icons/gi';

const BlockSelection = () => {
  const { onBlockSelectionOpen } = useContext(CanvasContext);

  return (
        <OptionsBox
            top="20vh"
            left="0.75rem"
            width="3.5rem"
            flexDirection="column"
        >
            <Box margin="1.0rem 0rem 0rem 0rem" _hover={{ color: '#4262FF' }}>
                <FaMousePointer fontSize={20} />
            </Box>
            <Box margin="1.0rem 0rem 1.0rem 0rem" _hover={{ color: '#4262FF' }} onClick={onBlockSelectionOpen}>
                <GiCheckboxTree fontSize={25} />
            </Box>
        </OptionsBox>
  );
};

export default BlockSelection;