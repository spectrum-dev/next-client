import { useContext } from 'react';

// Contexts
import InputContext from 'app/contexts/input';

import { getMarkerEnd, getSmoothStepPath } from 'react-flow-renderer';

const FlowEdge = (
  {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    arrowHeadType,
    markerEndId,
  }: any,
) => {
  // @ts-ignore
  const { edgeValidation } = useContext(InputContext);

  const edgePath = getSmoothStepPath({
    sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition,
  });

  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  const renderEdgeColor = () => {
    if (edgeValidation) {
      if (Object.keys(edgeValidation).length === 0) {
        return '#ed8936';
      }

      if (!Object.keys(edgeValidation).includes(id)) {
        return '#ed8936';
      }

      if (edgeValidation[id]) {
        return '#48bb79';
      }

      return '#f45532';
    }
    return '#ed8936';
  };

  return (
    <g>
      <path
        id={id}
        className="react-flow_flow-edge-path"
        fill="none"
        stroke={renderEdgeColor()}
        strokeWidth={5.5}
        d={edgePath}
        markerEnd={markerEnd}
      />
    </g>
  );
};

export default FlowEdge;
