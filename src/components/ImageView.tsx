import { Artwork } from '../client';
import { API_IMAGES } from '../constants';

interface ImageProps {
    art: Artwork
    children?: JSX.Element | JSX.Element[]
    didClose: () => void
}

function ImageView(props: ImageProps): JSX.Element {
    return (
        <div className="canvas-container" onClick={() => props.didClose()}>
            {props.art.layers.map(layer => {
                return <img style={{ zIndex: layer.id }} className="canvas-image" key={layer.id} id={"layer-" + layer.id} src={API_IMAGES + layer.id + ".jpg"} alt="" />
            })}
        </div>
    )
}

export default ImageView;