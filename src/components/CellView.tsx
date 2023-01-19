import { useEffect } from 'react';
import { Artwork } from '../client';
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

    useEffect(() => {
        if (props.art.is_active) {
            socket = initWebSocketClient()
        }
        canvas = initCanvas()

        return () => {
            if (props.art.is_active) {
                socket.close()
            }
            canvas.dispose()
        }
    }, [])

    function initWebSocketClient() {
        var socket = new WebSocket(API_WS + props.art.id)

        socket.onopen = function (event) {
            console.log("socket opened: ", props.art.id)
        }

        socket.onmessage = function (event) {
            var data = JSON.parse(event.data)
            console.log("socket recieving: ", data)

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
            console.log("socket closed: ", props.art.id)
        }

        return socket
    }

    function initCanvas() {
        canvas = new fabric.Canvas("canvas-" + props.art.id)
        canvas.freeDrawingBrush.width = 10

        const element = document.getElementById("layer-" + props.art.id)
        const rect = element?.getBoundingClientRect()

        // If element is not nil then use its dimensions for canvas
        if (rect) {
            canvas.setWidth(rect.width)
            canvas.setHeight(rect.height)
        }

        canvas.renderAll()
        return canvas
    }


    return (
        <div className="cell-container" onClick={() => props.didSelect(props.art)}>
            {props.art.layers.reverse().map(layer => {
                return <img style={{ zIndex: layer.id }} className="cell-image" key={layer.id} id={"layer-" + layer.id} src={API_IMAGES + layer.id + ".jpg"} alt="" />
            })}
            <canvas style={{ zIndex: props.art.id + 1 }} id={"canvas-" + props.art.id} />
        </div>
    )
}

export default CellView;