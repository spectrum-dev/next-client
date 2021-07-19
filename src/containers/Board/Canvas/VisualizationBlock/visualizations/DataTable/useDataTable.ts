import { useEffect, useState } from 'react';

interface State {
  columns: Array<any>;
  tableData: Array<any>;
}

export default function useDataTable({ data } : { data: any }) {
  const [state, setState] = useState<State>({
    columns: [],
    tableData: [],
  });

  const generateColumns = () => {
    const columns: any = [];
    if (data && data.length > 0) {
      const keys = Object.keys(data?.[0]);

      keys.forEach((elem) => {
        if (elem === 'timestamp') {
          columns.unshift(elem);
        } else {
          columns.push(elem);
        }
      });
    }

    return columns;
  };

  const generateTableData = () => {
    if (data && data.length) {
      return data.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp).toLocaleString('en-US', { timeZone: 'America/New_York' }),
      }));
    }
    return data;
  };

  useEffect(() => {
    const columns = generateColumns();
    const tableData = generateTableData();
    setState({
      columns,
      tableData,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return state;
}
