/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Item } from './Item';

export type User = {
    email: string;
    id: number;
    is_active: boolean;
    items?: Array<Item>;
};

