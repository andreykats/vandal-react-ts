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
    var ws: WebSocket
    var canvas: fabric.Canvas

    // useEffect(() => {
    //     // didLoad()
    // }, [])


    function didLoad() {
        ws = initWebSocketClient()
        canvas = initCanvas()
    }

    function initCanvas() {
        canvas = new fabric.Canvas('canvas-sheet');
        // canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = 10;

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

    function initWebSocketClient() {
        var client_id = Date.now()
        ws = new WebSocket(`ws://localhost:8000/live/ws/${client_id}`)
        ws.onmessage = function (event) {
            var data = JSON.parse(event.data)
            console.log("Recieving: ", data)

            if (data.message.action == "clear") {
                canvas.clear()
                return
            }

            data = data.message.drawInstruction;
            var path = new fabric.Path(data.pathCoordinates, {
                stroke: data.stroke,
                strokeWidth: data.strokeWidth,
                fill: data.fill
            })
            canvas.add(path)
        }

        ws.onclose = function (event) {
            console.error("Chat socket closed unexpectedly")
        }

        return ws
    }
    // If the id and base_layer_id match then don't overlay and just show one of them
    if (props.item.id === props.item.base_layer_id) {
        return (
            <div className="flex-container" onClick={props.didClose}>
                <div className="image-stack">
                    <img className="under" id="base-layer" src={API_IMAGES + props.item.base_layer_id + ".jpg"} alt="" onLoad={didLoad} />
                </div>
                <div>
                    <canvas id="canvas-sheet" />
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex-container" onClick={props.didClose}>
                <div className="image-stack">
                    <img className="under" id="base-layer" src={API_IMAGES + props.item.base_layer_id + ".jpg"} alt="" onLoad={didLoad} />
                    <img className="over" src={API_IMAGES + props.item.id + ".jpg"} alt="" />
                </div>
                <div>
                    <canvas id="canvas-sheet" />
                </div>
            </div>
        )
    }
}

export default ImageView;