# umi-uploader-quicknode

An uploader implementation utilizing [QuickNode's IPFS Gateway](https://www.quicknode.com/ipfs?utm_source=umi_gh)

_Requires QuickNode Plan with IPFS enabled. Check [QuickNode's website](https://www.quicknode.com/pricing?utm_source=umi_gh) for pricing and more information._

## Installation

```sh
npm install @metaplex-foundation/umi-uploader-quicknode
```

## Usage

The `quickNodeUploader` Plugin is a simple extension of the `UploaderInterface` interface that uses QuickNode's IPFS Gateway to upload files. The uploader requires `CreateQuickNodeUploader` object be passed at initiation, which includes:
- `apiKey` - _(required)_ an IPFS-enabled API key from [QuickNode](https://dashboard.quicknode.com/api-keys) 
- `gatewayUrl` - _(optional)_ the URL of the QuickNode IPFS Gateway, defaults to `https://qn-shared.quicknode-ipfs.com/ipfs/`
- `concurrency` - _(optional)_ the number of concurrent uploads, defaults to `5`

### Example implementation with Umi:

```ts
import { createUmi } from '@metaplex-foundation/umi';
import { quickNodeUploader } from '../src';

const apiKey = 'QN_your_api_key';
const umi = createUmi('http://127.0.0.1:8899')
    .use(quickNodeUploader({ apiKey }));

// Create or load file

umi.uploader.upload(file).then((uri) => {
    console.log('File uploaded successfully:', uri);
}).catch((error) => {
    console.error('Failed to upload file:', error);
});
```

### Example implementation without Umi instance:

```ts
import { createQuickNodeUploader } from '../src';

const apiKey = 'QN_your_api_key';
const uploader = createQuickNodeUploader({ apiKey });

// Create or load file

uploader.upload(file).then((uri) => {
    console.log('File uploaded successfully:', uri);
}).catch((error) => {
    console.error('Failed to upload file:', error);
});
```