import { UploaderInterface } from "@metaplex-foundation/umi";

export interface QuickNodeUploader extends UploaderInterface {
    getUrl: (key: string) => string;
}

export interface CreateQuickNodeUploader {
    apiKey: string;
    gatewayUrl?: string;
    concurrency?: number;
}

export interface QuickNodeUploadResponse {
    requestid: string;
    status: string;
    created: string;
    pin: {
        cid: string;
        name: string;
        origins: string[];
        meta: Record<string, any>;
    };
    info: {
        size: string;
    };
    delegates: string[];
}
