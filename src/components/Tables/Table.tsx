import { useState, useEffect, useCallback } from 'react';

import { timeFormat } from 'd3-time-format';

import DataTable, { defaultThemes } from 'react-data-table-component';

// Types
import { TableData } from 'containers/Board/Canvas/index.types';

interface TableColumns {
  name: string;
  selector: string;
  sortable: boolean;
}

const Table = ({
  data,
  headSize = 25,
  cellSize = 22,
  paginationSize = 20,
}: {
  data: TableData,
  headSize?: number,
  cellSize?: number,
  paginationSize?: number,
}) => {
  const [columns, setColumns] = useState<Array<TableColumns>>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [tableData, setTableData] = useState<Array<Record<string, string | number>> | []>([]);

  const renderColumns = useCallback(() => {
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
            right: true,
          });
        }
      }
    }

    setColumns(updatedColumns);
  }, [tableData]);

  const timeDisplayFormat = timeFormat('%b %d, %Y %H:%M:%S');

  const cleanupTableData = useCallback((rawTableData: any) => rawTableData.map((item: any) => {
    if ('timestamp' in item) {
      return {
        ...item,
        timestamp: timeDisplayFormat(new Date(item.timestamp)),
      };
    }

    if ('date' in item) {
      return {
        ...item,
        date: timeDisplayFormat(new Date(item.date)),
      };
    }

    return item;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const getTotalRows = useCallback(() => setTotalRows(tableData.length), [tableData.length]);

  useEffect(() => {
    if ('data' in data) {
      setTableData(cleanupTableData(data.data));
    } else {
      setTableData(cleanupTableData(data));
    }

    renderColumns();
    getTotalRows();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, getTotalRows]);

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
        fontSize: `${headSize}px`,
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
        fontSize: `${cellSize}px`,
      },
    },
    pagination: {
      style: {
        backgroundColor: '#1a202c',
        color: 'white',
        fontSize: `${paginationSize}px`,
      },
      pageButtonsStyle: {
        backgroundColor: 'white',
        height: paginationSize !== 20 ? '20px' : '40px',
        width: paginationSize !== 20 ? '20px' : '40px',
        padding: paginationSize !== 20 ? '0px' : '8px',
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
