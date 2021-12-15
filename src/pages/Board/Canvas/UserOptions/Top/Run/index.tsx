import { useContext } from 'react';
import { RiTestTubeLine } from 'react-icons/ri';

import CanvasContext from 'app/contexts/canvas';
import { OptionsBox } from '../../OptionsBox';

const Run = ({ top }: { top: string }) => {
  const { isRunOpen, onRunToggle } = useContext(CanvasContext);

  return (
        <OptionsBox
            top={top}
            right="0.75rem"
            width="3rem"
            height="3rem"
            _hover={{ color: '#4262FF' }}
        >
            <RiTestTubeLine
                fontSize={28}
                onClick={onRunToggle}
                color={isRunOpen ? '#4262FF' : '' }
            />
        </OptionsBox>
  );
};

export default Run;