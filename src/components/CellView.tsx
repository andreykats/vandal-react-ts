import { useEffect } from 'react';
import { Artwork, Layer } from '../client';
import { API_IMAGES, API_WS } from '../constants';
import { fabric } from 'fabric';

interface CellProps {
    art: Artwork
    children?: JSX.Element | JSX.Element[]
    didSelect: (art: Artwork) => void
}

function CellView(props: CellProps): JSX.Element {
    var socket: WebSocket
    var canvas: fabric.Canvas

    var desiredCellWidth = 500

    useEffect(() => {
        canvas = initCanvas()
        if (props.art.is_active) {
            socket = initWebSocketClient(API_WS + "?channel=" + props.art.id)
        }
        return () => {
            if (socket && socket.OPEN) {
                socket.close()
            }
            canvas.dispose()
        }
    }, [props.art])

    function adjustSize(dimension: number) {
        var reductionFactor = props.art.width / desiredCellWidth
        return dimension / reductionFactor
    }

    function imageSource(layer: Layer) {
        if (layer.file_name) {
            return API_IMAGES + layer.file_name
        }
        return API_IMAGES + layer.id + ".jpg"
    }

    function initCanvas() {
        canvas = new fabric.Canvas("canvas-" + props.art.id)
        canvas.isDrawingMode = false
        canvas.freeDrawingBrush.width = 10
        canvas.setDimensions({ width: adjustSize(props.art.width), height: adjustSize(props.art.height) })
        return canvas
    }

    function initWebSocketClient(url: string) {
        var socket = new WebSocket(url)

        socket.onopen = function (event) {
            console.log("socket opened: ", url)
        }

        socket.onmessage = function (event) {
            var message = JSON.parse(event.data).payload.message
            // console.log("socket recieving: ", data.payload)
            if (message.action == "clear") {
                canvas.clear()
                return
            }

            var reductionFactor = message.canvasSize.width / canvas.getWidth()
            var drawInstruction = message.drawInstruction

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
            console.log("socket closed: ", url)
        }

        return socket
    }

    return (
        <div className="cell-container" style={{ width: adjustSize(props.art.width), height: adjustSize(props.art.height) }} onClick={() => props.didSelect(props.art)}>
            {props.art.layers.reverse().map(layer => {
                return <img className="cell-image" key={layer.id} id={"layer-" + layer.id} style={{ width: adjustSize(props.art.width), height: adjustSize(props.art.height), zIndex: layer.id }} src={imageSource(layer)} alt="" />
            })}
            <canvas className={props.art.is_active ? "canvas-active" : "canvas"} id={"canvas-" + props.art.id} style={{ zIndex: props.art.id + 1 }} />
        </div>
    )
}

export default CellView