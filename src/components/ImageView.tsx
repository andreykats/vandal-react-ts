import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { ArtService, Artwork, Layer } from '../client';
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
    const [artwork, setArtwork] = useState<Artwork | undefined>()

    var canvas: fabric.Canvas

    var desiredWidth = 800

    useEffect(() => {
        if (!id) {
            navigate("/nopage/")
            return
        }
        fetchArtwork(id)
    }, [id])

    function adjustSize(dimension: number) {
        if (!artwork) { return }
        var reductionFactor = artwork.width / desiredWidth
        return dimension / reductionFactor
    }

    function imageSource(layer: Layer) {
        console.log("imageSource: ", layer)
        if (layer.file_name) {
            return API_IMAGES + layer.file_name
        }
        return API_IMAGES + layer.id + ".jpg"
    }

    async function fetchArtwork(id: string) {
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
        <div className="canvas-stack">
            <div style={{ width: adjustSize(artwork.width), height: adjustSize(artwork.height) }}>
                {artwork.layers.map(layer => {
                    return <img className="canvas-image" style={{ width: adjustSize(artwork.width), height: adjustSize(artwork.height), zIndex: layer.id }} key={layer.id} src={imageSource(layer)} alt="" />
                })}
            </div>
        </div>
    )
}

export default ImageView;