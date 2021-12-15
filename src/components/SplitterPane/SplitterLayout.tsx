import { Children, ReactNode, useState, useEffect, useRef } from 'react';
import Pane from './Pane';

import './index.module.css';

const DEFAULT_SPLITTER_SIZE = 4;

const SplitterLayout = (
  {
    customClassName = '',
    vertical = false,
    percentage = false,
    primaryIndex = 0,
    primaryMinSize = 0,
    secondaryInitialSize = undefined,
    secondaryMinSize = 0,
    onDragStart = undefined,
    onDragEnd = undefined,
    onSecondaryPaneSizeChange = undefined,
    children,
  }: {
    customClassName?: string;
    vertical?: boolean;
    percentage?: boolean;
    primaryIndex?: number;
    primaryMinSize?: number;
    secondaryInitialSize?: number | undefined;
    secondaryMinSize?: number;
    onDragStart?: Function | undefined;
    onDragEnd?: Function | undefined;
    onSecondaryPaneSizeChange?: Function | undefined;
    children: ReactNode;
  },
) => {
  const container = useRef<HTMLInputElement>(null);
  const splitter = useRef<HTMLInputElement>(null);

  const [secondaryPaneSize, setSecondaryPaneSize] = useState(0);
  const [resizing, setResizing] = useState<boolean | null>(false);
    
    
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);

    let secondaryPaneSizeInner = 0;
    if (secondaryInitialSize) {
      secondaryPaneSizeInner = secondaryInitialSize;
    } else {
      const containerRect = container.current?.getBoundingClientRect();
      let splitterRect;
      if (splitter) {
        splitterRect = splitter.current?.getBoundingClientRect();
      } else {
        splitterRect = { width: DEFAULT_SPLITTER_SIZE, height: DEFAULT_SPLITTER_SIZE };
      }
      if (containerRect && splitterRect) {
        secondaryPaneSizeInner = getSecondaryPaneSize(containerRect, splitterRect, {
          left: containerRect.left + ((containerRect.width - splitterRect.width) / 2),
          top: containerRect.top + ((containerRect.height - splitterRect.height) / 2),
        }, false);
      }
    }
    setSecondaryPaneSize(secondaryPaneSizeInner);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (secondaryPaneSize && onSecondaryPaneSizeChange) {
      onSecondaryPaneSizeChange(secondaryPaneSize);
    }

    if (resizing) {
      if (onDragStart) {
        onDragStart();
      }
    } else if (onDragEnd) {
      onDragEnd();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondaryPaneSize, resizing]);

  /**
     * Event Handler Functions
     */
    
  const handleResize = () => {
    if (splitter && !percentage) {
      const containerRect = container?.current?.getBoundingClientRect();
      const splitterRect = splitter?.current?.getBoundingClientRect();
      const secondaryPaneSizeInner = getSecondaryPaneSize(containerRect, splitterRect, {
        left: splitterRect?.left,
        top: splitterRect?.top,
      }, false);
      setSecondaryPaneSize(secondaryPaneSizeInner);
    }
  };

  const handleMouseUp = () => {
    setResizing((val) => val ? false : null);
  };

  const handleMouseMove = (e: any) => {
    if (resizing) {
      const containerRect = container?.current?.getBoundingClientRect();
      const splitterRect = splitter?.current ? splitter.current.getBoundingClientRect() : { width: DEFAULT_SPLITTER_SIZE, height: DEFAULT_SPLITTER_SIZE };
      const secondaryPaneSizeInner = getSecondaryPaneSize(containerRect, splitterRect, {
        left: e.clientX,
        top: e.clientY,
      }, true);
      clearSelection();
      setSecondaryPaneSize(secondaryPaneSizeInner);
    }
  };
  
  const handleTouchMove = (e: any) => {
    handleMouseMove(e.changedTouches[0]);
  };

  const handleSplitterMouseDown = () => {
    clearSelection();
    setResizing(true);
  };

  const getSecondaryPaneSize = (containerRect: any, splitterRect: any, clientPosition: any, offsetMouse: any) => {
    let totalSize;
    let splitterSize;
    let offset;

    if (vertical) {
      totalSize = containerRect.height;
      splitterSize = splitterRect.height;
      offset = clientPosition.top - containerRect.top;
    } else {
      totalSize = containerRect.width;
      splitterSize = splitterRect.width;
      offset = clientPosition.left - containerRect.left;
    }

    if (offsetMouse) {
      offset -= splitterSize / 2;
    }

    if (offset < 0) {
      offset = 0;
    } else if (offset > totalSize - splitterSize) {
      offset = totalSize - splitterSize;
    }

    let secondaryPaneSizeInner;
    if (primaryIndex === 1) {
      secondaryPaneSizeInner = offset;
    } else {
      secondaryPaneSizeInner = totalSize - splitterSize - offset;
    }
    
    let primaryPaneSize = totalSize - splitterSize - secondaryPaneSize;
    if (percentage) {
      secondaryPaneSizeInner = (secondaryPaneSize * 100) / totalSize;
      primaryPaneSize = (primaryPaneSize * 100) / totalSize;
      splitterSize = (splitterSize * 100) / totalSize;
      totalSize = 100;
    }

    if (primaryPaneSize < primaryMinSize) {
      secondaryPaneSizeInner = Math.max(secondaryPaneSize - (primaryMinSize - primaryPaneSize), 0);
    } else if (secondaryPaneSize < secondaryMinSize) {
      secondaryPaneSizeInner = Math.min(totalSize - splitterSize - primaryMinSize, secondaryMinSize);
    }

    return secondaryPaneSizeInner;
  };

  /**
    * Render Logic
   */
  let containerClasses = 'splitter-layout';
    
  if (customClassName) {
    containerClasses += customClassName;
  }

  if (vertical) {
    containerClasses += ' splitter-layout-vertical';
  }

  if (resizing) {
    containerClasses += ' layout-changing';
  }

  const childrenElements = Children.toArray(children).slice(0, 2);
  if (childrenElements.length === 0) {
    childrenElements.push(<div />);
  }

  const wrappedChildren = [];
  const primaryIndexElement = (primaryIndex !== 0 && primaryIndex !== 1) ? 0 : primaryIndex;

  for (let i = 0; i < childrenElements.length; ++i) {
    let primary = true;
    let size = undefined;
    if (childrenElements.length > 1 && i !== primaryIndexElement) {
      primary = false;
      size = secondaryPaneSize;
    }
    wrappedChildren.push(
          <Pane vertical={vertical} percentage={percentage} primary={primary} size={size}>
            {childrenElements[i]}
          </Pane>,
    );
  }

  return (
        <div className={containerClasses} ref={container}>
            {wrappedChildren[0]}
            {wrappedChildren.length > 1 &&
            (
                <div
                role="separator"
                className="layout-splitter"
                ref={splitter}
                onMouseDown={handleSplitterMouseDown}
                onTouchStart={handleSplitterMouseDown}
                />
            )
            }
            {wrappedChildren.length > 1 && wrappedChildren[1]}
        </div>
  );
};


const clearSelection = () => {
  // @ts-ignore
  if (document.body.createTextRange) {
    // https://github.com/zesik/react-splitter-layout/issues/16
    // https://stackoverflow.com/questions/22914075/#37580789
    // @ts-ignore
    const range = document.body.createTextRange();
    range.collapse();
    range.select();
  } else if (window.getSelection) {
    // @ts-ignore
    if (window.getSelection().empty) {
      // @ts-ignore
      window.getSelection().empty();
      // @ts-ignore
    } else if (window.getSelection().removeAllRanges) {
      // @ts-ignore
      window.getSelection().removeAllRanges();
    }
    // @ts-ignore
  } else if (document.selection) {
    // @ts-ignore
    document.selection.empty();
  }
};

export default SplitterLayout;