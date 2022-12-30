import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import CellView from './CellView';
import RowView from './RowView';
import { ArtService, Item } from '../client';


function GridView(): JSX.Element {
    const [getItems, setItems] = useState<Item[]>([])
    const [getSelected, setSelected] = useState<Item | undefined>()

    useEffect(() => {
        fetch()
    }, [])

    /** 
    // 3 ways to create and array of "CellView" elements from an array of "Item" types

    // First method
    var itemsList: JSX.Element[] = []
    for (var item of getItems) {
        itemsList.push(
            <CellView key={item.id} item={item} didSelect={() => setSelected(item)} />
        )
    }

    // Second method
    var itemsList: JSX.Element[] = []
    getItems.forEach((item) => {
        itemsList.push(
            <CellView key={item.id} item={item} didSelect={() => setSelected(item)} />
        )
    })

    */

    // Third method
    let itemsList = getItems.map((item) => {
        return <CellView key={item.id} item={item} didSelect={() => setSelected(item)} />
    })


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
    async function fetch() {
        try {
            const response = await ArtService.artGetNewFeedItems()
            console.log(response)
            setItems(response)
        } catch (error: any) {
            console.error(error)
            alert("Fetch Error: " + error.message)
        }
    }

    function showView() {
        if (getSelected) {
            return (
                <div>
                    <div className="heading">
                        Decided to distroy "{getSelected.name}", eh?
                    </div>
                    <div className="heading">
                        You monster
                    </div>
                    <div>
                        <RowView item={getSelected} onClose={() => (setSelected(undefined))} />
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
                        {itemsList}
                    </div>
                </div>
            )
        }
    }

    return (
        <div>
            <div className="title">
                Welcome you stinkin' Vandal
            </div>
            {showView()}
        </div>
    )
}

export default GridView;