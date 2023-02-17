import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import CellView from './CellView';
// import ImageView from './ImageView';
// import CanvasView from './CanvasView';
import { ArtService, Artwork, FormActivate } from '../client';

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
        fetchHistory(id)
    }, [id])

    async function fetchHistory(id: string) {
        try {
            const response = await ArtService.artGetArtworkHistory(id)
            console.log("fetchHistory: ", response)
            setArtwork(response)
        } catch (error: any) {
            console.error(error)
            alert("fetchHistory Error: " + error.message)
        }
    }

    async function setArtworkActive(id: string) {
        // Create a form and populate fields
        var formData = {} as FormActivate
        formData.layer_id = id
        formData.is_active = true

        // Submit using the auto-generated api client then try to catch any errors
        try {
            const response = await ArtService.artSetArtworkActive(formData)
            console.log("setArtworkActive: ", response)
            navigate('/edit/', { state: { art: response } })
        } catch (error: any) {
            console.log(error)
            alert("Set artwork active error: " + error.message)
        }
    }

    function selectViewArtwork(id: string) {
        // Send params to the next page
        navigate("/view/" + id)
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
                <button id="button-new" onClick={() => setArtworkActive(artworks[0].id)}> NEW </button>
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