import Brand from './Top/Brand';
import Share from './Top/Share';
import Run from './Top/Run';

const TOP_DIMENSION = '0.75rem';

const UserOptions = () => (
    <>
        <Brand top={TOP_DIMENSION} />
        <Share top={TOP_DIMENSION} />
        <Run top={TOP_DIMENSION} />
    </>
);

export default UserOptions;
