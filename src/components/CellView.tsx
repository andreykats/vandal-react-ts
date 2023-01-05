import { Item } from '../client';
import { API_IMAGES, API_URL } from '../constants';
import { fabric } from 'fabric';

interface CellProps {
    item: Item
    children?: JSX.Element | JSX.Element[]
    didSelect: (item: Item) => void
}

function CellView(props: CellProps): JSX.Element {
    var ws: WebSocket
    var canvas: fabric.Canvas

    function didLoad() {
        ws = initWebSocketClient()
        canvas = initCanvas()
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

            data = data.message.drawInstruction
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

    // If the id and base_layer_id match then don't overlay and just show one of them
    if (props.item.id === props.item.base_layer_id) {
        return (
            <div className="cell-single" onClick={() => props.didSelect(props.item)}>
                <img id="img" src={API_URL + "images/" + props.item.base_layer_id + ".jpg"} alt="" />
            </div>
        )
    } else {
        return (
            // Overlay base layer image and user generated image
            <div className="cell-stack" onClick={() => props.didSelect(props.item)} >
                <img className="under" id="img" src={API_URL + "images/" + props.item.base_layer_id + ".jpg"} alt="" />
                <img className="over" id="img" src={API_URL + "images/" + props.item.id + ".jpg"} alt="" />
            </div>
        )
    }
}

export default CellView;