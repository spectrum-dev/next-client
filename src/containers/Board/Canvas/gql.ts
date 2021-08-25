import { gql } from '@apollo/client';

export const DISPATCH_RUN_STRATEGY = gql`
    mutation DISPATCH_RUN_STRATEGY($nodeList: JSON!, $edgeList: [JSON!]) {
        dispatchRunStrategy(
            nodeList: $nodeList,
            edgeList: $edgeList
        ) {
            status
            taskId
        }
    }
`;

export const QUERY_TASK_RESULT = gql`
    query TASK_RESULT($taskId: ID!) {
        taskResult(taskId: $taskId) {
            status
            output
        }
    }
`;