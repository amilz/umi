import {
    GenericFile,
    SolAmount,
    lamports,
    createGenericFileFromJson,
    request
} from '@metaplex-foundation/umi';
import { createQuickNodeFetch } from './fetch';
import { CreateQuickNodeUploader, QuickNodeUploadResponse, QuickNodeUploader } from './types';
import { runWithConcurrency } from './utils';

export function createQuickNodeUploader({
    apiKey,
    gatewayUrl = 'https://qn-shared.quicknode-ipfs.com/ipfs/',
    concurrency = 5
}: CreateQuickNodeUploader): QuickNodeUploader {
    const http = createQuickNodeFetch();
    const endpoint = 'https://api.quicknode.com/ipfs/rest/v1/s3/put-object';

    const uploadOne = async (file: GenericFile): Promise<string> => {
        const fileBlob = new Blob([file.buffer], { type: 'application/json' });

        const formData = new FormData();
        formData.append('Body', fileBlob);
        formData.append("Key", file.uniqueName);
        formData.append("ContentType", file.contentType || '');

        const qnRequest = request()
            .withEndpoint('POST', endpoint)
            .withHeader("x-api-key", apiKey)
            .withData(formData)

        try {
            const response = await http.send<QuickNodeUploadResponse, FormData>(qnRequest);
            if (!response.ok) throw new Error(`${response.status} - Failed to send request: ${response.statusText}`);
            return getUrl(response.data.pin.cid);
        } catch (error) {
            console.error('Failed to send request:', error);
            throw error;
        }
    };

    const upload = async (files: GenericFile[]): Promise<string[]> => {
        const tasks = files.map(file => () => uploadOne(file));
        const results = await runWithConcurrency(tasks, concurrency);
        return results;
    }

    const uploadJson = async <T>(json: T): Promise<string> => {
        const file = createGenericFileFromJson(json);
        const uris = await upload([file]);
        return uris[0];
    };

    const getUploadPrice = async (): Promise<SolAmount> => lamports(0);

    const getUrl = (cid: string): string => {
        if (!cid) throw new Error('Invalid CID: CID cannot be empty.');
        const baseUrl = gatewayUrl.endsWith('/') ? gatewayUrl : `${gatewayUrl}/`;
        return `${baseUrl}${encodeURIComponent(cid)}`;
    };

    return {
        upload,
        uploadJson,
        getUploadPrice,
        getUrl,
    };
}


