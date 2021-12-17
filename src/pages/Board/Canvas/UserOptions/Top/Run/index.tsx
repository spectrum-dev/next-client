import { useContext } from 'react';

import CanvasContext from 'app/contexts/canvas';
import { OptionsBox } from '../../OptionsBox';

import { RiTestTubeLine } from 'react-icons/ri';

const Run = ({ top }: { top: string }) => {
  const { isBacktestOpen, onBacktestToggle } = useContext(CanvasContext);

  return (
        <OptionsBox
            top={top}
            right="0.75rem"
            width="3rem"
            height="3rem"
            _hover={{ color: '#4262FF' }}
        >
            {/* TODO: Swap this out with a "run strategy" icon */}
            <RiTestTubeLine fontSize={28} onClick={onBacktestToggle} color={ isBacktestOpen ? '#4262FF' : '' }/>
        </OptionsBox>
  );
};

export default Run;