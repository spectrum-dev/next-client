import { gql } from '@apollo/client';

export const DISPATCH_RUN_STRATEGY = gql`
    mutation DISPATCH_RUN_STRATEGY($nodeList: JSON!, $edgeList: [JSON!], $strategyType: String!) {
        dispatchRunStrategy(
            nodeList: $nodeList,
            edgeList: $edgeList
            strategyType: $strategyType,
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

export const QUERY_INPUT_DEPENDENCY_GRAPH = gql`
    query INPUT_DEPENDENCY_GRAPH($nodeList: JSON!, $edgeList: [JSON!]) {
        inputDependencyGraph(nodeList: $nodeList, edgeList: $edgeList)
    }
`;

export const MUTATION_SAVE_STRATEGY = gql`
    mutation strategy($strategyId: ID!, $commitId: ID, $metadata: JSON!, $inputs: JSON!, $outputs: JSON!) {
        strategy(strategyId: $strategyId, commitId: $commitId, metadata: $metadata, inputs: $inputs, outputs: $outputs)
    }
`;

export const QUERY_STRATEGY = gql`
    query STRATEGY($strategyId: ID!) {
        strategy(strategyId: $strategyId) {
            strategy {
                strategyId
                strategyName
            }
            commitId
            flowMetadata
            input
            output
        }
    }
`;

export const QUERY_VALIDATE_FLOW = gql`
    query VALIDATE_FLOW($nodeList: JSON!, $edgeList: [JSON!]) {
        validateFlow(nodeList: $nodeList, edgeList: $edgeList) {
            valid
            edges
        }
    }
`;