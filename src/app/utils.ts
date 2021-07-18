const formatBlockTypeHeader = (headerText: string) => {
  if (headerText) {
    const header = headerText.split('_');
    return `${header[0][0].toUpperCase()}${header[0].slice(1).toLowerCase()} ${header[1][0].toUpperCase()}${header[1].slice(1).toLowerCase()}`;
  }
  return '';
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export { formatBlockTypeHeader, formatDate };
