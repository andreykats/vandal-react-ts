/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LiveService {

    /**
     * Websocket Chat
     * @returns string Successful Response
     * @throws ApiError
     */
    public static liveWebsocketChat(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/live/{room}',
        });
    }

}
