import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import CellView from './CellView';
import RowView from './RowView';
import { ArtService, Item } from '../client';


function GridView(): JSX.Element {
    const [items, setItems] = useState<Item[]>([])
    const [selected, setSelected] = useState<Item | undefined>()

    useEffect(() => {
        fetchFeed()
    }, [])

    /**
    // 3 ways to fetch API data
    
    // First method (manually) using Axios
    function fetch() {
        axios.get(API_URL + "art/feed/")
            .then(result => {
                // console.log(result.data)
                setItems(result.data)
            }).catch((err) => {
                console.log(err);
                alert("Get error: " + err.message);
            });
    }

    // Second method (using the OpenAPI Client) callback method
    function fetch() {
        ArtService.artGetNewFeedItems()
            .then(response => {
                setItems(response)
            })
            .catch((error) => {
                console.error(error)
                alert("Fetch Error: " + error.message)
            })
    }

     */

    // Third method (using the OpenAPI Client) try/catch method
    async function fetchFeed() {
        try {
            const response = await ArtService.artGetFeedItems()
            console.log(response)
            setItems(response)
        } catch (error: any) {
            console.error(error)
            alert("Fetch Error: " + error.message)
        }
    }

    if (selected) {
        return (
            <div>
                <div className="heading">
                    Decided to distroy "{selected.name}", eh?
                </div>
                <div className="heading">
                    You monster
                </div>
                <div>
                    <RowView item={selected} didClose={() => (setSelected(undefined), fetchFeed())} />
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <div className="heading">
                    Choose the beauty you wish to destroy
                </div>
                <div className="flex-container">
                    {items.map(item => {
                        return <CellView key={item.id} item={item} didSelect={() => setSelected(item)} />
                    })}
                </div>
            </div>
        )
    }
}

export default GridView;