import { useContext, memo } from 'react';
import { Tooltip } from '@chakra-ui/react';
import {
  getMarkerEnd, getSmoothStepPath, WrapEdgeProps,
} from 'react-flow-renderer';

import BoardContext from 'app/contexts/board';

const FlowEdge = memo((
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
  // @ts-ignore
  const { edgeValidation } = useContext(BoardContext);

  const edgePath = getSmoothStepPath({
    sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition,
  });

  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  const renderEdgeColor = (): string => {
    if (edgeValidation) {
      if (Object.keys(edgeValidation).length === 0) {
        return '#ed8936';
      }

      if (!Object.keys(edgeValidation).includes(id)) {
        return '#ed8936';
      }

      if (edgeValidation[id].status) {
        return '#48bb79';
      }

      return '#f45532';
    }
    return '#ed8936';
  };

  return (
    edgeValidation && edgeValidation?.[id] && !edgeValidation?.[id].status
      ? (
        <g>
          <Tooltip
            hasArrow
            label={`The ${edgeValidation?.[id]?.target_block} block only can connect from the ${edgeValidation?.[id]?.allowed_connections.join(', ')} ${edgeValidation?.[id]?.allowed_connections.length === 1 ? 'block' : 'blocks'}`}
            bg="#1a202c"
            color="white"
            textAlign="center"
          >
            <path
              id={id}
              className="react-flow_flow-edge-path"
              fill="none"
              stroke={renderEdgeColor()}
              strokeWidth={5.5}
              d={edgePath}
              markerEnd={markerEnd}
            />
          </Tooltip>
        </g>
      ) : (
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
      )
  );
});

export default FlowEdge;
