const formatBlockTypeHeader = (headerText: string) => {
  if (headerText) {
    const header = headerText.split('_');
    return `${header[0][0].toUpperCase()}${header[0].slice(1).toLowerCase()} ${header[1][0].toUpperCase()}${header[1].slice(1).toLowerCase()}`;
  }
  return '';
};

export { formatBlockTypeHeader };
