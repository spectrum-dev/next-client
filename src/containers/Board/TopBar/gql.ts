import { gql } from '@apollo/client';

export const QUERY_USER_STRATEGY = gql`
    query USER_STRATEGY($strategyId: ID!){
        userStrategy(strategyId: $strategyId) {
            strategyName
        }
    }
`;
