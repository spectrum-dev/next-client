import { memo } from 'react';
import {
  getMarkerEnd, getSmoothStepPath, WrapEdgeProps,
} from 'react-flow-renderer';

const VisualizationEdge = memo((
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
  }: WrapEdgeProps,
) => {
  const edgePath = getSmoothStepPath({
    sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition,
  });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  return (
    <g>
      <path
        id={id}
        className="react-flow_flow-edge-path"
        fill="none"
        stroke="black"
        strokeWidth={5.5}
        d={edgePath}
        markerEnd={markerEnd}
      />
    </g>
  );
});

export default VisualizationEdge;
