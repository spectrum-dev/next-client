import { Node, SetElements } from './index.types';

export default function useOnNodeContextMenu({ setElements }: { setElements: SetElements }) {
  const onNodeContextMenu = (event: React.MouseEvent<Element, MouseEvent>, node: Node) => {
    event.preventDefault();

    setElements((els) => els.map((el) => {
      // NOTE: Currently this prevents right clicks from being performed on graphs
      if (el.id.split('-').length === 1 && el.id === node.id) {
        return {
          ...node,
          data: {
            ...node.data,
            metadata: {
              // @ts-ignore
              ...node?.data?.metadata,
              // @ts-ignore
              isMenuVisible: !node?.data?.metadata?.isMenuVisible,
            },
          },
        };
      }
      return el;
    }));
  };

  return { onNodeContextMenu };
}
