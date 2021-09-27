import { Node, SetElements } from './index.types';

export default function useOnNodeContextMenu({ setElements }: { setElements: SetElements }) {
  const onNodeContextMenu = (event: React.MouseEvent<Element, MouseEvent>, node: Node) => {
    event.preventDefault();

    setElements((els) => els.map((el) => {
      if (el.id === node.id) {
        return {
          ...node,
          data: {
            ...node.data,
            metadata: {
              // @ts-ignore
              ...node?.data?.metadata,
              isMenuVisible: true,
            },
          },
        };
      }
      return el;
    }));
  };

  return { onNodeContextMenu };
}
