import { OptionsBox } from '../../OptionsBox';

import { RiQuestionLine } from 'react-icons/ri';

const Run = ({ top }: { top: string }) => (
    <OptionsBox
        top={top}
        right="0.75rem"
        width="3rem"
        height="3rem"
    >
        {/* TODO: Swap this out with a "run strategy" icon */}
        <RiQuestionLine fontSize={28} />
    </OptionsBox>
);

export default Run;