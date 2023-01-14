import { useState, useEffect } from 'react';
import CellView from './CellView';
import ImageView from './ImageView';
import CanvasView from './CanvasView';
import { ArtService, Artwork } from '../client';

export enum Views {
    RowView,
    ImageView,
    CanvasView
}

interface RowProps {
    art: Artwork
    children?: JSX.Element | JSX.Element[]
    didClose: () => void
}

function RowView(props: RowProps): JSX.Element {
    const [view, setView] = useState(Views.RowView)
    const [artworks, setArtwork] = useState<Artwork[]>([])
    const [selected, setSelected] = useState<Artwork>(props.art)

    useEffect(() => {
        fetchHistory(props.art.id)
    }, [props.art.id])

    async function fetchHistory(item_id: number) {
        try {
            const response = await ArtService.artGetArtworkHistory(item_id)
            console.log("fetchHistory: ", response)
            setArtwork(response)
        } catch (error: any) {
            console.error(error)
            alert("fetchHistory Error: " + error.message)
        }
    }

    switch (view) {
        case Views.CanvasView:
            return <CanvasView art={props.art} didClose={() => (setView(Views.RowView))} />
        case Views.ImageView:
            return <ImageView art={selected!} didClose={() => setView(Views.RowView)} />
        case Views.RowView:
            return (
                <div className="row-container">
                    <div className="row-button-stack">
                        <button id="button-new" onClick={() => setView(Views.CanvasView)}> NEW </button>
                        <button id="button-new" onClick={props.didClose}> CLOSE </button>
                    </div>
                    <div className="row-container">
                        {artworks.map(art => {
                            return <CellView key={art.id} art={art} didSelect={() => (setSelected(art), setView(Views.ImageView))} />
                        })}
                    </div>
                </div>
            )
    }
}

export default RowView;