import { useContext } from 'react';

import { Tooltip } from '@chakra-ui/react';

// Contexts
import InputContext from 'app/contexts/input';

import { getMarkerEnd, getSmoothStepPath, WrapEdgeProps } from 'react-flow-renderer';

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
  }: WrapEdgeProps,
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

      if (edgeValidation[id].status) {
        return '#48bb79';
      }

      return '#f45532';
    }
    return '#ed8936';
  };

  const renderTooltip = () => {
    if (edgeValidation && edgeValidation?.[id] && !edgeValidation?.[id].status) {
      return (
        <Tooltip
          hasArrow
          label={`The ${edgeValidation?.[id]?.target_block} block only can connect from the ${edgeValidation?.[id]?.allowed_connections.join(', ')} ${edgeValidation?.[id]?.allowed_connections.length === 1 ? 'block' : 'blocks'}`}
          bg="#1a202c"
          color="white"
          textAlign="center"
        >
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
        </Tooltip>
      );
    }

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

  return renderTooltip();
};

export default FlowEdge;
