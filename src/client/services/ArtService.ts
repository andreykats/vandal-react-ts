/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FormBaseItem } from '../models/FormBaseItem';
import type { FormVandalizedItem } from '../models/FormVandalizedItem';
import type { Item } from '../models/Item';
import type { ItemCreate } from '../models/ItemCreate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ArtService {

    /**
     * Get All Items
     * @param skip
     * @param limit
     * @returns Item Successful Response
     * @throws ApiError
     */
    public static artGetAllItems(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<Item>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/art/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create Items
     * @param requestBody
     * @returns Item Successful Response
     * @throws ApiError
     */
    public static artCreateItems(
        requestBody: Array<ItemCreate>,
    ): CancelablePromise<Array<Item>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/art/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Item
     * @param itemId
     * @returns Item Successful Response
     * @throws ApiError
     */
    public static artGetItem(
        itemId: number,
    ): CancelablePromise<Item> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/art/{item_id}',
            path: {
                'item_id': itemId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete User Content
     * @param itemId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static artDeleteUserContent(
        itemId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/art/{item_id}',
            path: {
                'item_id': itemId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create Base Item
     * @param formData
     * @returns Item Successful Response
     * @throws ApiError
     */
    public static artCreateBaseItem(
        formData: FormBaseItem,
    ): CancelablePromise<Item> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/art/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create Vandalized Item
     * @param formData
     * @returns Item Successful Response
     * @throws ApiError
     */
    public static artCreateVandalizedItem(
        formData: FormVandalizedItem,
    ): CancelablePromise<Item> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/art/submit',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Feed Items
     * @returns Item Successful Response
     * @throws ApiError
     */
    public static artGetFeedItems(): CancelablePromise<Array<Item>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/art/feed/',
        });
    }

    /**
     * Get Item History
     * @param itemId
     * @returns Item Successful Response
     * @throws ApiError
     */
    public static artGetItemHistory(
        itemId: number,
    ): CancelablePromise<Array<Item>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/art/history/{item_id}',
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
    public static artDeleteAllUserCreatedContent(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/art/destroy/',
        });
    }

}
