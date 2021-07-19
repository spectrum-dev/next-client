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
        stroke="#ed8936"
        strokeWidth={5.5}
        d={edgePath}
        markerEnd={markerEnd}
      />
    </g>
  );
};

export default FlowEdge;
