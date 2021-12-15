import { ReactNode } from 'react';

interface StyleProps {
  height?: string;
  width?: string;
}

const Pane = (
  { vertical = false, primary = false, size = 0, percentage = false, children }:
  { vertical?: boolean, primary?: boolean, size?: number, percentage?: boolean, children: ReactNode }) => {
    
  const unit = percentage ? '%' : 'px';
  let classes = 'layout-pane';
    
  const style: StyleProps = {};

  if (!primary) {
    if (vertical) {
      style.height = `${size}${unit}`;
    } else {
      style.width = `${size}${unit}`;
    }
  } else {
    classes += ' layout-pane-primary';
  }
  return (
        <div className={classes} style={style}>{children}</div>
  );
};

export default Pane;