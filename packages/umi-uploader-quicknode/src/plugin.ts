import { UmiPlugin } from '@metaplex-foundation/umi';
import { createQuickNodeUploader } from './createQuickNodeUploader';
import { CreateQuickNodeUploader } from './types';

export const quickNodeUploader = ({
    apiKey,
    gatewayUrl = 'https://qn-shared.quicknode-ipfs.com/ipfs/',
    concurrency = 5
}: CreateQuickNodeUploader
): UmiPlugin => ({
    install(umi) {
        umi.uploader = createQuickNodeUploader({ apiKey, gatewayUrl, concurrency });
    },
});