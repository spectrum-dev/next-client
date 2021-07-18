const FlowEdge = (
  {
    sourceX,
    sourceY,
    targetX,
    targetY,
  }: any,
) => (
  <g>
    <path
      fill="none"
      stroke="#ed8936"
      strokeWidth={5.5}
      // className="animated"
      d={`M${sourceX},${sourceY} C ${sourceX} ${targetY} ${sourceX} ${targetY} ${targetX},${targetY}`}
    />
  </g>
);

export default FlowEdge;
