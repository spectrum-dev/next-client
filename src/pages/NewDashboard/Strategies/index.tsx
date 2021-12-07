import { useContext } from 'react';

import { Button } from '@chakra-ui/react';

import InfoPane from 'components/InfoPane';
import DashboardContext from 'app/contexts/dashboard';

import { DataTable } from './DataTable';


const Strategies = () => {
  const { onCreateStrategyOpen } = useContext(DashboardContext);

  const CreateNewStrategyButton = () => (
    <Button colorScheme='blue' size='md' onClick={() => onCreateStrategyOpen()}> Create new strategy </Button>
  );

  return (
    <InfoPane title="Strategies" description="In this section you can create new strategies or edit your already created bots." rightIcon={<CreateNewStrategyButton />}>
        <DataTable />
    </InfoPane>
  );
};

export default Strategies;