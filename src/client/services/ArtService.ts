/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Item } from '../models/Item';
import type { ItemCreate } from '../models/ItemCreate';
import type { Submit } from '../models/Submit';
import type { Upload } from '../models/Upload';

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
     * Create Modified Item
     * @param formData
     * @returns Item Successful Response
     * @throws ApiError
     */
    public static artCreateModifiedItem(
        formData: Submit,
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
     * Get New Feed Items
     * @returns Item Successful Response
     * @throws ApiError
     */
    public static artGetNewFeedItems(): CancelablePromise<Array<Item>> {
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
            url: '/art/feed/{item_id}',
            path: {
                'item_id': itemId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create And Upload A New Item
     * @param formData
     * @returns Item Successful Response
     * @throws ApiError
     */
    public static artCreateAndUploadANewItem(
        formData: Upload,
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

}
