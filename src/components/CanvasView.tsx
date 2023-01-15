import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { fabric } from 'fabric';
import { API_IMAGES, API_WS } from '../constants';
import { ArtService, Artwork, FormVandalizedItem, } from '../client';

// interface CanvasProps {
//     art: Artwork
//     children?: JSX.Element | JSX.Element[]
//     didClose: (art: Artwork) => void
// }

type CanvasState = {
    art: Artwork
}

function CanvasView(): JSX.Element {
    const navigate = useNavigate()
    const location = useLocation()

    const { art } = location.state as CanvasState

    var socket: WebSocket
    var canvas: fabric.Canvas

    useEffect(() => {
        socket = initWebSocketClient()
        canvas = initCanvas()
    }, [art])

    function initWebSocketClient() {
        var socket = new WebSocket(API_WS + art.id)

        socket.onopen = function (event) {
            console.log("Socket opened")
        }

        socket.onclose = function (event) {
            console.error("Socket closed unexpectedly")
        }

        return socket
    }

    function initCanvas() {
        canvas = new fabric.Canvas('canvas-sheet')
        canvas.isDrawingMode = true
        canvas.freeDrawingBrush.width = 10

        selectRed()

        // Set canvas size based on the size of the base_layer image
        const element = document.getElementById("layer-" + art.id)
        const rect = element!.getBoundingClientRect()

        // If element is not nil then use its dimensions for canvas
        if (rect) {
            canvas.setWidth(rect.width)
            canvas.setHeight(rect.height)
        }

        canvas.on("path:created", function (e: any) {
            var drawInstruction = {
                pathCoordinates: e.path.path,
                stroke: e.path.stroke,
                strokeWidth: e.path.strokeWidth,
                fill: false
            }

            var data = JSON.stringify({
                message: {
                    action: "draw",
                    canvasSize: { width: canvas.width, height: canvas.height },
                    drawInstruction: drawInstruction
                }
            })

            socket.send(data)
        })

        return canvas;
    }

    function selectHome() {
        navigate("/")
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

    async function submitImage() {
        // Create a binary string from canvas
        var img = canvas.toDataURL()
        var base64String = img.replace("data:", "").replace(/^.+,/, "")

        // Create a form and populate fields
        var formData = {} as FormVandalizedItem
        formData.item_id = art.id
        formData.user_id = 99
        formData.image_data = base64String

        // Submit using the auto-generated api client then try to catch any errors
        try {
            const response = await ArtService.artCreateVandalizedItem(formData)
            console.log("Submit img resquest: ", formData)
            console.log("Sumbit img response: ", response)
            selectHome()
        } catch (error: any) {
            console.log(error)
            alert("Submit img error: " + error.message)
        }
    }

    return (
        <div>
            <div className="canvas-container" >
                {art.layers.reverse().map(layer => {
                    return <img style={{ zIndex: layer.id }} className="canvas-image" key={layer.id} id={"layer-" + layer.id} src={API_IMAGES + layer.id + ".jpg"} alt="" />
                })}
                <canvas style={{ zIndex: art.id + 1 }} id="canvas-sheet" />
            </div>
            <div className="canvas-toolbar">
                <button id="button-save" onClick={submitImage}>Save</button>
                <button id="button-red" onClick={selectRed}>Red</button>
                <button id="button-green" onClick={selectGreen}>Green</button>
                <button id="button-blue" onClick={selectBlue}>Blue</button>
                <button id="button-cancel" onClick={selectHome}>Cancel</button>
            </div>
        </div>
    )
}


export default CanvasView;