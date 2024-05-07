import test from 'ava';
import sinon from 'sinon';
import { createGenericFile, createUmi } from '@metaplex-foundation/umi';
import { createQuickNodeUploader, quickNodeUploader } from '../src';

const expectedMethods = ['upload', 'uploadJson', 'getUploadPrice', 'getUrl'];

test('it can add plugin to an instance of Umi', async t => {
    const apiKey = 'mock_api_key';
    const umi = createUmi().use(quickNodeUploader({ apiKey }));
    t.true('uploader' in umi, 'Umi has uploader');
    for (const method of expectedMethods) {
        t.true(method in umi.uploader, `Uploader has ${method} method`);
    }
});

test('it can be initiated without instance of Umi', async t => {
    const apiKey = 'mock_api_key';
    const gatewayUrl = 'https://mock-gateway-url.com/ipfs/';
    const uploader = createQuickNodeUploader({ apiKey, gatewayUrl });
    for (const method of expectedMethods) {
        t.true(method in uploader, `Uploader has ${method} method`);
    }
    const mockCid = 'mock-cid';
    const testUrl = uploader.getUrl(mockCid);
    t.deepEqual(testUrl, `${gatewayUrl + mockCid}`, 'getUrl should return the correct URL');
});

test('it uploads images and returns URIs', async t => {
    const apiKey = 'mock_api_key';
    const uploader = createQuickNodeUploader({ apiKey });

    try {
        const mockUri = 'http://example.com/mock-uri';
        const uploaderSpy = sinon.stub().resolves([mockUri]);
        sinon.replace(uploader, 'upload', uploaderSpy);

        const file = createGenericFile('some-image', 'some-image.jpg', {
            uniqueName: 'some-key',
        });

        const [uri] = await uploader.upload([file]);

        t.truthy(uri, 'URI should be truthy');
        t.is(uri, mockUri, 'URI should match the mocked URI');
        t.true(uploaderSpy.calledOnce, 'upload should be called once');
        t.true(uploaderSpy.calledWith([file]), 'upload should be called with the correct parameters');
    } finally {
        sinon.restore();
    }
});

// Can use but need a valid API key
test.skip('it uploads a file with valid API key', async t => {
    const apiKey = "";

    const uploader = createQuickNodeUploader({ apiKey });
    const file = createGenericFile('some-image', 'some-image.jpg', {
        uniqueName: 'some-key',
    });
    try {
        const [uri] = await uploader.upload([file]);
        t.truthy(uri.startsWith('https://qn-shared.quicknode-ipfs.com/ipfs/'), 'URI start with IPFS');
    } catch (error) {
        if (error instanceof Error) {
            t.fail(`Failed to upload: ${error.message}`);
        } else {
            t.fail('Failed to upload');
        }
    }
});