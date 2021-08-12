const checkBlockType = (key: string | null) => {
  if (!key) {
    throw new Error('INPUT_INVALID');
  }
  const splitKey = key.split('-');
  switch (splitKey.length) {
    case 1:
      return 'FLOW_BLOCK';
    case 3:
      return 'VISUALIZATION_BLOCK';
    default:
      throw new Error('BLOCK_NOT_FOUND');
  }
};

export { checkBlockType };
