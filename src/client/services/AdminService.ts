/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AdminService {

    /**
     * Delete User Content
     * @param itemId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteUserContentAdminItemIdDelete(
        itemId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/{item_id}',
            path: {
                'item_id': itemId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete All User Created Content
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteAllUserCreatedContentAdminDestroyPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/destroy/',
        });
    }

}
