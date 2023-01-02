import { Item } from '../client';
import { API_URL } from '../constants';

interface ImageProps {
    item: Item
    children?: JSX.Element | JSX.Element[]
    didClose: () => void
}

function ImageView(props: ImageProps): JSX.Element {

    // If the id and base_layer_id match then don't overlay and just show one of them
    if (props.item.id === props.item.base_layer_id) {
        return (
            <div className="cell-single" onClick={props.didClose}>
                <img id="img" src={API_URL + "images/" + props.item.base_layer_id + ".jpg"} alt="" />
            </div>
        )
    } else {
        return (
            // Overlay base layer image and user generated image
            <div className="cell-stack" onClick={props.didClose} >
                <img className="under" id="img" src={API_URL + "images/" + props.item.base_layer_id + ".jpg"} alt="" />
                <img className="over" id="img" src={API_URL + "images/" + props.item.id + ".jpg"} alt="" />
            </div>
        )
    }
}

export default ImageView;