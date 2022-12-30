import React, { useState, useEffect } from 'react';
import CellView from './CellView';
import ImageView from './ImageView';
import CanvasView from './CanvasView';
import { ArtService, Item } from '../client';

export enum Views {
    RowView,
    ImageView,
    CanvasView
}

interface RowProps {
    item: Item
    children?: JSX.Element | JSX.Element[]
    onClose: () => void
}

function RowView(props: RowProps): JSX.Element {
    const [getView, setView] = useState(Views.RowView)
    const [getItems, setItems] = useState<Item[]>([])
    const [getSelected, setSelected] = useState<Item>()

    useEffect(() => {
        fetchFeed(props.item.base_layer_id!)
    }, [props.item.id]);

    let itemsList = getItems.map((item) => {
        return <CellView key={item.id} item={item} didSelect={() => (setSelected(item), setView(Views.ImageView))} />
    })

    async function fetchFeed(id: number) {
        try {
            const response = await ArtService.artGetItemHistory(id)
            console.log(response)
            setItems(response)
        } catch (error: any) {
            console.error(error)
            alert("Fetch Error: " + error.message)
        }
    }

    function showView(viewType: Views) {
        switch (viewType) {
            case Views.CanvasView:
                return <CanvasView item={props.item} didClose={() => (setView(Views.RowView), fetchFeed(props.item.base_layer_id!))} />
            case Views.ImageView:
                return <ImageView item={getSelected!} didClose={() => (setView(Views.RowView))} />
            case Views.RowView:
                return (
                    <div className="flex-row">
                        <div className="flex-stack">
                            <button id="button-new" onClick={() => (setView(Views.CanvasView))}> NEW </button>
                            <button id="button-new" onClick={() => (props.onClose())}> CLOSE </button>
                        </div>
                        <div className="flex-row">
                            {itemsList}
                        </div>
                    </div>
                )
        }
    }

    return (
        <div>
            {showView(getView)}
        </div >
    )
}

export default RowView;