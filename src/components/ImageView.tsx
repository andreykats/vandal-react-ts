import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { ArtService, Artwork } from '../client';
import { API_IMAGES } from '../constants';

// interface ImageProps {
//     art: Artwork
//     children?: JSX.Element | JSX.Element[]
//     didClose: () => void
// }

type Params = {
    id: string;
}

function ImageView(): JSX.Element {
    const navigate = useNavigate()
    const { id } = useParams<Params>()
    const [artwork, setArtwork] = useState<Artwork>()

    useEffect(() => {
        if (!id) {
            navigate("/nopage/")
            return
        }
        fetchArtwork(parseInt(id))
    }, [id])

    async function fetchArtwork(id: number) {
        try {
            const response = await ArtService.artGetArtwork(id)
            console.log("fetchArtwork: ", response)
            setArtwork(response)
        } catch (error: any) {
            console.error(error)
            alert("fetchArtwork Error: " + error.message)
        }
    }

    if (!artwork) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div className="canvas-container">
            {artwork.layers.map(layer => {
                return <img style={{ zIndex: layer.id }} className="canvas-image" key={layer.id} id={"layer-" + layer.id} src={API_IMAGES + layer.id + ".jpg"} alt="" />
            })}
        </div>
    )
}

export default ImageView;