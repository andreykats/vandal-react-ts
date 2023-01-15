import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import CellView from './CellView';
import ImageView from './ImageView';
import CanvasView from './CanvasView';
import { ArtService, Artwork } from '../client';

// export enum Views {
//     HistoryView,
//     ImageView,
//     CanvasView
// }

// interface HistoryProps {
//     art: Artwork
//     children?: JSX.Element | JSX.Element[]
//     didClose: () => void
// }

type Params = {
    id: string;
}

function HistoryView(): JSX.Element {
    const navigate = useNavigate()

    const { id } = useParams<Params>()

    const [artworks, setArtwork] = useState<Artwork[]>([])

    useEffect(() => {
        if (!id) {
            navigate("/nopage/")
            return
        }
        fetchHistory(parseInt(id))
    }, [id])

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


    function selectViewArtwork(item_id: number) {
        // Send params to the next page
        navigate("/view/" + item_id)
    }

    function selectEditArtwork(art: Artwork) {
        // Send state object to the next page
        navigate('/edit/', { state: { art: art } })
    }


    // switch (view) {
    //     case Views.CanvasView:
    //         return <CanvasView art={props.art} didClose={() => (setView(Views.RowView))} />
    //     case Views.ImageView:
    //         return <ImageView art={selected!} didClose={() => setView(Views.RowView)} />
    // case Views.RowView:
    // return (
    //     <div className="row-container">
    //         <div className="row-button-stack">
    //             <button id="button-new" onClick={() => setView(Views.CanvasView)}> NEW </button>
    //             {/* <button id="button-new" onClick={props.didClose}> CLOSE </button> */}
    //         </div>
    //         <div className="row-container">
    //             {artworks.map(art => {
    //                 return <CellView key={art.id} art={art} didSelect={() => (setSelected(art), setView(Views.ImageView))} />
    //             })}
    //         </div>
    //     </div>
    // )
    // }

    return (
        <div className="row-container">
            <div className="row-button-stack">
                <button id="button-new" onClick={() => selectEditArtwork(artworks[0])}> NEW </button>
            </div>
            <div className="row-container">
                {artworks.map(art => {
                    return <CellView key={art.id} art={art} didSelect={() => selectViewArtwork(art.id)} />
                })}
            </div>
        </div>
    )
}

export default HistoryView;