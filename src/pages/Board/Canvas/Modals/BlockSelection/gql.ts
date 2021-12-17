import { gql } from '@apollo/client';

export const QUERY_ALL_METADATA = gql`
    query ALL_METADATA($strategyType: StrategyType!) {
        allMetadata(strategyType: $strategyType)
    }
`;

export const QUERY_GET_BLOCK_METADATA = gql`
    query GET_BLOCK_METADATA($blockType: BlockType!, $blockId: Int!) {
        blockMetadata(blockType: $blockType, blockId: $blockId) {
            blockName
            blockType
            blockId
            inputs
            validation
            outputInterface
        }
    }
`;