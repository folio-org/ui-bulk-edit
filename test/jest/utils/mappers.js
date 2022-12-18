export const getMappedTableData = (data) => {
  const columns = data.header.map((cell) => ({
    label: cell.value,
    value: cell.value,
    disabled: false,
    selected: cell.visible,
  }));

  const formatter = columns.reduce((acc, { value }) => {
    acc[value] = item => item[value];

    return acc;
  }, {});

  const visibleColumns = columns.filter(col => col.selected).map(col => col.value);

  const contentData = data.rows.map(({ row }) => {
    return row.reduce((acc, item, index) => {
      acc[data.header[index].value] = item;

      return acc;
    }, {});
  });

  return {
    formatter,
    visibleColumns,
    columns,
    contentData,
  };
};
