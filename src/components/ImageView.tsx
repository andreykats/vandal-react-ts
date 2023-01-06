import React, { useState, useEffect } from 'react';
import { Item } from '../client';
import { API_URL } from '../constants';
import { fabric } from 'fabric';
import { API_IMAGES } from '../constants';

interface ImageProps {
    item: Item
    children?: JSX.Element | JSX.Element[]
    didClose: () => void
}

function ImageView(props: ImageProps): JSX.Element {
    // If the id and base_layer_id match then don't overlay and just show one of them
    if (props.item.id === props.item.base_layer_id) {
        return (
            <div className="canvas-container" onClick={() => props.didClose()}>
                <img className="canvas-image" id="base-layer" src={API_IMAGES + props.item.base_layer_id + ".jpg"} alt="" />
            </div>
        )
    } else {
        return (
            <div className="canvas-container" onClick={() => props.didClose()}>
                <img className="canvas-image" id="base-layer" src={API_IMAGES + props.item.base_layer_id + ".jpg"} alt="" />
                <img className="canvas-image" src={API_IMAGES + props.item.id + ".jpg"} alt="" />
            </div>
        )
    }
}

export default ImageView;