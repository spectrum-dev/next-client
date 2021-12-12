// Top Bars
import Brand from './Top/Brand';
import Share from './Top/Share';
import Run from './Top/Run';

// Left Bars
import BlockSelection from './Left/BlockSelection';

const TOP_DIMENSION = '0.75rem';

const UserOptions = () => (
    <>
        <Brand top={TOP_DIMENSION} />
        <Share top={TOP_DIMENSION} />
        <Run top={TOP_DIMENSION} />

        <BlockSelection />
    </>
);

export default UserOptions;
