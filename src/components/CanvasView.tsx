// import React, { useState } from 'react';
// import axios from 'axios';
import { fabric } from 'fabric';
import { API_IMAGES, API_SUBMIT } from '../constants';
import { ArtService, Item, FormVandalizedItem, } from '../client';

interface CanvasProps {
    item: Item
    children?: JSX.Element | JSX.Element[]
    didClose: () => void
}

function CanvasView(props: CanvasProps): JSX.Element {
    var canvas: fabric.Canvas;

    function didLoad() {
        canvas = initCanvas()
    }

    function initCanvas() {
        canvas = new fabric.Canvas('canvas-sheet');
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = 10;

        selectRed();

        // Set canvas size based on the size of the base_layer image
        const element = document.getElementById('base-layer')
        const rect = element!.getBoundingClientRect();

        // If element is not nil then use its dimensions for canvas
        if (rect) {
            canvas.setWidth(rect.width);
            canvas.setHeight(rect.height);
        }

        return canvas;
    }

    function back() {
        console.log("back")
        props.didClose()
    }

    function selectRed() {
        canvas.freeDrawingBrush.color = "#FF0000";
    }

    function selectGreen() {
        canvas.freeDrawingBrush.color = "#00FF00";
    }

    function selectBlue() {
        canvas.freeDrawingBrush.color = "#0000FF";
    }

    /**
    function submitImage() {
        // Create a binary string from canvas
        var img = canvas.toDataURL();
        var base64String = img.replace("data:", "").replace(/^.+,/, "");

        // Create a form and populate fields
        var formData = new FormData();
        formData.append("item_id", props.item!.id.toString());
        formData.append("user_id", "99");
        formData.append("image_data", base64String);

        // Perform request
        axios.post(API_SUBMIT, formData, {})
            .then(result => {
                console.log(result)
                back()
            }).catch((err) => {
                console.log(err);
                alert("Upload img error: " + err.message);
            });
    }
    */

    async function submitImage() {
        // Create a binary string from canvas
        var img = canvas.toDataURL()
        var base64String = img.replace("data:", "").replace(/^.+,/, "")

        // Create a form and populate fields
        var formData = {} as FormVandalizedItem
        formData.item_id = props.item.id
        formData.user_id = 99
        formData.image_data = base64String

        // Submit using the auto-generated api client then try to catch any errors
        try {
            const response = await ArtService.artCreateVandalizedItem(formData)
            console.log(response)
            back()
        } catch (error: any) {
            console.log(error)
            alert("Submit img error: " + error.message)
        }
    }

    return (
        <div>
            <div className="flex-container">
                <div className="image-stack">
                    <img className="under" id="base-layer" src={API_IMAGES + props.item.base_layer_id + ".jpg"} alt="" onLoad={didLoad} />
                    <img className="over" src={API_IMAGES + props.item.id + ".jpg"} alt="" />
                </div>
                <div>
                    <canvas id="canvas-sheet" />
                </div>
            </div>
            <div className="flex-toolbar">
                <button id="button-save" onClick={submitImage}>Save</button>
                <button id="button-red" onClick={selectRed}>Red</button>
                <button id="button-green" onClick={selectGreen}>Green</button>
                <button id="button-blue" onClick={selectBlue}>Blue</button>
                <button id="button-cancel" onClick={back}>Cancel</button>
            </div>
        </div>
    )
}


export default CanvasView;