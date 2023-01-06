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
    didClose: () => void
}

function RowView(props: RowProps): JSX.Element {
    const [view, setView] = useState(Views.RowView)
    const [items, setItems] = useState<Item[]>([])
    const [selected, setSelected] = useState<Item>()

    useEffect(() => {
        fetchHistory(props.item.id)
    }, [props.item.id])

    async function fetchHistory(item_id: number) {
        try {
            const response = await ArtService.artGetItemHistory(item_id)
            console.log("fetchHistory: ", response)
            setItems(response)
        } catch (error: any) {
            console.error(error)
            alert("fetchHistory Error: " + error.message)
        }
    }

    switch (view) {
        case Views.CanvasView:
            return <CanvasView item={items[0]} didClose={() => (setView(Views.RowView), fetchHistory(props.item.id))} />
        case Views.ImageView:
            return <ImageView item={selected!} didClose={() => setView(Views.RowView)} />
        case Views.RowView:
            return (
                <div className="row-container">
                    <div className="row-button-stack">
                        <button id="button-new" onClick={() => setView(Views.CanvasView)}> NEW </button>
                        <button id="button-new" onClick={props.didClose}> CLOSE </button>
                    </div>
                    <div className="row-container">
                        {items.map(item => {
                            return <CellView key={item.id} item={item} didSelect={() => (setSelected(item), setView(Views.ImageView))} />
                        })}
                    </div>
                </div>
            )
    }
}

export default RowView;