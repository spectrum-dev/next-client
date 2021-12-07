import InfoPane from 'components/InfoPane';
import { DataTable } from './DataTable';


const Strategies = () => {
  return (
    <InfoPane title="Strategies" description="In this section you can create new strategies or edit your already created bots.">
        <DataTable />
    </InfoPane>
  );
};

export default Strategies;