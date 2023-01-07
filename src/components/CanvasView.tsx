import { fabric } from 'fabric';
import { API_IMAGES, API_WS } from '../constants';
import { ArtService, Item, FormVandalizedItem, } from '../client';

interface CanvasProps {
    item: Item
    children?: JSX.Element | JSX.Element[]
    didClose: () => void
}

function CanvasView(props: CanvasProps): JSX.Element {
    var socket: WebSocket
    var canvas: fabric.Canvas

    function didLoad() {
        socket = initWebSocketClient()
        canvas = initCanvas()
    }

    function initWebSocketClient() {
        var socket = new WebSocket(API_WS + props.item.id)

        socket.onopen = function (event) {
            console.log("Socket opened")
        }

        socket.onclose = function (event) {
            console.error("Socket closed unexpectedly")
        }

        return socket
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

    function back() {
        console.log("back")
        props.didClose()
    }

    function resize() {
        canvas.setHeight(200)
        canvas.setWidth(200)
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
            <div className="canvas-container">
                <img className="canvas-image" id="base-layer" src={API_IMAGES + props.item.base_layer_id + ".jpg"} alt="" onLoad={didLoad} />
                <img className="canvas-image" src={API_IMAGES + props.item.id + ".jpg"} alt="" />
                <canvas id="canvas-sheet" />
            </div>
            <div className="canvas-toolbar">
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