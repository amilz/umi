import {
    HttpInterface,
    HttpRequest,
    HttpResponse,
} from '@metaplex-foundation/umi';

export function createQuickNodeFetch(): HttpInterface {
    return {
        send: async <ResponseData, RequestData = any>(
            request: HttpRequest<RequestData>
        ): Promise<HttpResponse<ResponseData>> => {
            let headers = new Headers(
                Object.entries(request.headers).map(([name, value]) => [name, value] as [string, string])
            );

            if (!headers.has('x-api-key')) {
                throw new Error('Missing x-api-fail header');
            }

            const isJsonRequest: boolean = headers.get('content-type')?.includes('application/json') ?? false;

            const body = isJsonRequest && request.data ? JSON.stringify(request.data) : request.data as BodyInit | undefined;

            const requestInit: RequestInit = {
                method: request.method,
                headers,
                body,
                redirect: 'follow',
                signal: request.signal as any,
            };

            try {
                const response = await fetch(request.url, requestInit);
                const isJsonResponse = response.headers.get('content-type')?.includes('application/json');

                const bodyAsText = await response.text();
                const bodyAsJson = isJsonResponse ? JSON.parse(bodyAsText) : undefined;

                return {
                    data: bodyAsJson ?? bodyAsText,
                    body: bodyAsText,
                    ok: response.ok,
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(response.headers.entries()),
                };

            }
            catch (error) {
                console.error('Fetch request failed:', error);
                throw error;
            }

        },
    };
}

