import React, { useState, useEffect, Component } from 'react';
import { Item } from '../client';
import { API_IMAGES, API_WS } from '../constants';
import { fabric } from 'fabric';

interface CellProps {
    item: Item
    children?: JSX.Element | JSX.Element[]
    didSelect: (item: Item) => void
}

function CellView(props: CellProps): JSX.Element {
    var socket: WebSocket
    var canvas: fabric.Canvas

    useEffect(() => {
        socket = initWebSocketClient()
        canvas = initCanvas()
    }, [])

    function initWebSocketClient() {
        var socket = new WebSocket(API_WS + props.item.id)
        socket.onmessage = function (event) {
            var data = JSON.parse(event.data)
            console.log("Recieving: ", data)

            if (data.message.action == "clear") {
                canvas.clear()
                return
            }

            var reductionFactor = data.message.canvasSize.width / canvas.getWidth()
            var drawInstruction = data.message.drawInstruction

            // Modify the coordinate path to fit the new canvas dimensions of a cell
            var pathCoordinates = drawInstruction.pathCoordinates
                .map(function (item: any) {
                    var newItem = item.map(function (coordinate: any) {
                        // Skip first item in array
                        if (item.indexOf(coordinate) > 0) {
                            return coordinate / reductionFactor
                        } else {
                            // Return first item in array unchanged
                            return coordinate
                        }
                    })
                    // Join the array into a string as per FabricJS path format
                    return newItem.join(" ");
                })
                .join(" ")

            var path = new fabric.Path(pathCoordinates, {
                stroke: drawInstruction.stroke,
                strokeWidth: drawInstruction.strokeWidth / reductionFactor,
                fill: drawInstruction.fill
            })
            canvas.add(path)
        }

        socket.onclose = function (event) {
            console.error("Chat socket closed unexpectedly")
        }

        return socket
    }

    function initCanvas() {
        canvas = new fabric.Canvas("canvas-id:" + props.item.id)
        canvas.freeDrawingBrush.width = 10

        const element = document.getElementById("base-layer-id:" + props.item.id)
        const rect = element?.getBoundingClientRect()

        // If element is not nil then use its dimensions for canvas
        if (rect) {
            canvas.setWidth(rect.width)
            canvas.setHeight(rect.height)
        }

        canvas.renderAll()
        return canvas;
    }


    // If the id and base_layer_id match then don't overlay and just show one of them
    if (props.item.id === props.item.base_layer_id) {
        return (
            <div className="cell-container" onClick={() => props.didSelect(props.item)}>
                <img className="cell-image" id={"base-layer-id:" + props.item.id} src={API_IMAGES + props.item.base_layer_id + ".jpg"} alt="" />
                <canvas id={"canvas-id:" + props.item.id} />
            </div>
        )
    } else {
        return (
            <div className="cell-container" onClick={() => props.didSelect(props.item)}>
                <img className="cell-image" id={"base-layer-id:" + props.item.id} src={API_IMAGES + props.item.base_layer_id + ".jpg"} alt="" />
                <img className="cell-image" src={API_IMAGES + props.item.id + ".jpg"} alt="" />
                <canvas id={"canvas-id:" + props.item.id} />
            </div>
        )
    }
}

export default CellView;