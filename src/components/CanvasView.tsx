import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { fabric } from 'fabric';
import { API_IMAGES, API_WS } from '../constants';
import { ArtService, Artwork, FormNewLayer, FormActivate, Layer } from '../client';
import { relative } from 'path';

// interface CanvasProps {
//     art: Artwork
//     children?: JSX.Element | JSX.Element[]
//     didClose: (art: Artwork) => void
// }

function CanvasView(): JSX.Element {
    const navigate = useNavigate()
    const location = useLocation()
    console.log("State: ", location.state)
    const [artwork, setArtwork] = useState<Artwork>(location.state ? location.state.art : undefined)

    var socket: WebSocket
    var canvas: fabric.Canvas

    var desiredCanvasWidth = 800

    useEffect(() => {
        if (!artwork) {
            console.log("CanvasView: no artwork")
            navigate("/")
            return
        }

        socket = initWebSocketClient(API_WS + artwork.id)
        canvas = initCanvas()

        return () => {
            if (socket && socket.OPEN) {
                socket.close()
            }
            canvas.dispose()
        }
    }, [location.state])

    function adjustSize(dimension: number) {
        var reductionFactor = artwork.width / desiredCanvasWidth
        return dimension / reductionFactor
    }

    function imageSource(layer: Layer) {
        console.log("imageSource: ", layer)
        if (layer.file_name) {
            return API_IMAGES + layer.file_name
        }
        return API_IMAGES + layer.id + ".jpg"
    }

    function initWebSocketClient(url: string) {
        var socket = new WebSocket(url)

        socket.onopen = function (event) {
            console.log("socket opened: ", url)
        }

        socket.onclose = function (event) {
            console.log("socket closed: ", url)
        }

        return socket
    }

    function initCanvas() {
        canvas = new fabric.Canvas('canvas-sheet')
        canvas.isDrawingMode = true
        canvas.freeDrawingBrush.width = 10
        canvas.setDimensions({ width: adjustSize(artwork.width), height: adjustSize(artwork.height) })

        selectRed()

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

    async function submitImage(id: string) {
        // Create a binary string from canvas
        var img = canvas.toDataURL()
        var base64String = img.replace("data:", "").replace(/^.+,/, "")

        // Create a form and populate fields
        var formData = {} as FormNewLayer
        formData.layer_id = id
        formData.user_id = "99"
        formData.image_data = base64String

        // Submit using the auto-generated api client then try to catch any errors
        try {
            const response = await ArtService.artSubmitNewLayer(formData)
            console.log("Submit img resquest: ", formData)
            console.log("Sumbit img response: ", response)
            selectHome()
        } catch (error: any) {
            console.log(error)
            alert("Submit img error: " + error.message)
        }
    }

    async function setArtworkInactive(id: string) {
        // Create a form and populate fields
        var formData = {} as FormActivate
        formData.layer_id = id
        formData.is_active = false

        // Submit using the auto-generated api client then try to catch any errors
        try {
            const response = await ArtService.artSetArtworkActive(formData)
            selectHome()
        } catch (error: any) {
            console.log(error)
            alert("Set artwork active error: " + error.message)
        }
    }

    if (!artwork) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <div className="canvas-stack">
                <div style={{ width: adjustSize(artwork.width), height: adjustSize(artwork.height) }}>
                    {artwork.layers.reverse().map(layer => {
                        return <img className="canvas-image" style={{ width: adjustSize(artwork.width), height: adjustSize(artwork.height), zIndex: 1 }} key={layer.id} id={"layer-" + layer.id} src={imageSource(layer)} alt="" />
                    })}
                    <canvas style={{ zIndex: 1 + 1 }} id="canvas-sheet" />
                </div>
            </div>

            <div className="canvas-toolbar">
                <button id="button-save" onClick={() => submitImage(artwork.id)}>Save</button>
                <button id="button-red" onClick={selectRed}>Red</button>
                <button id="button-green" onClick={selectGreen}>Green</button>
                <button id="button-blue" onClick={selectBlue}>Blue</button>
                <button id="button-cancel" onClick={() => setArtworkInactive(artwork.id)}>Cancel</button>
            </div>
        </div>
    )
}


export default CanvasView;