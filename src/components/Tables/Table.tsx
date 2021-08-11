import { useState, useEffect } from 'react';

import { timeFormat } from 'd3-time-format';

import DataTable, { defaultThemes } from 'react-data-table-component';

// Types
import { TableData } from 'containers/Board/Canvas/index.types';

interface TableColumns {
  name: string;
  selector: string;
  sortable: boolean;
}

const Table = ({ data }: { data: TableData }) => {
  const [columns, setColumns] = useState<Array<TableColumns>>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [tableData, setTableData] = useState<Array<Record<string, string | number>> | []>([]);

  const renderColumns = () => {
    const updatedColumns = [];
    if (tableData.length > 0) {
      for (const elem of Object.keys(tableData[0])) {
        if (elem === 'date' || elem === 'timestamp') {
          updatedColumns.push({
            name: elem,
            selector: elem,
            sortable: true,
            grow: 2,
          });
        } else {
          updatedColumns.push({
            name: elem,
            selector: elem,
            sortable: true,
          });
        }
      }
    }

    console.log('Columns: ', columns);
    setColumns(updatedColumns);
  };

  const timeDisplayFormat = timeFormat('%b %d');

  const cleanupTableData = (rawTableData: any) => rawTableData.map((item: any) => {
    if ('timestamp' in item) {
      return {
        timestamp: timeDisplayFormat(item.timestamp),
        ...item,
      };
    }

    if ('date' in item) {
      return {
        date: timeDisplayFormat(item.date),
        ...item,
      };
    }

    return item;
  });

  const getTotalRows = () => setTotalRows(tableData.length);

  useEffect(() => {
    console.log('Rendering Data: ', data);
    if ('data' in data) {
      setTableData(cleanupTableData(data.data));
    } else {
      setTableData(cleanupTableData(data));
    }

    renderColumns();
    getTotalRows();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const customStyles = {
    header: {
      style: {
        minHeight: '56px',
      },
    },
    headRow: {
      style: {
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: defaultThemes.default.divider.default,
        backgroundColor: '#1a202c',
      },
    },
    headCells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: defaultThemes.default.divider.default,
        },
        color: 'white',
        fontSize: '25px',
        textTransform: 'uppercase',
      },
    },
    cells: {
      style: {
        '&:not(:last-of-type)': {
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderRightColor: defaultThemes.default.divider.default,
        },
        backgroundColor: '#1a202c',
        color: 'white',
        fontSize: '20px',
      },
    },
    pagination: {
      style: {
        backgroundColor: '#1a202c',
        color: 'white',
        fontSize: '20px',
      },
      pageButtonsStyle: {
        backgroundColor: 'white',
      },
    },
  };

  return (
    <DataTable
      columns={columns}
      data={tableData}
      pagination
      paginationTotalRows={totalRows}
      customStyles={customStyles}
      paginationPerPage={12}
    />
  );
};

export default Table;
