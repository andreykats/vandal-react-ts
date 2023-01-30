import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import CellView from './CellView';
import { ArtService, Artwork } from '../client';
import { API_WS_BROADCAST } from '../constants';


function GridView(): JSX.Element {
    const navigate = useNavigate()
    const [artworks, setArtworks] = useState<Artwork[]>([])

    // var socket: WebSocket
    const evtSource = new EventSource("http://127.0.0.1:8080/live/stream");

    useEffect(() => {
        fetchFeed()
        // socket = initWebSocketClient(API_WS_BROADCAST)

        evtSource.addEventListener("new_message", function (event) {
            // Logic to handle status updates
            console.log(event.data)
        })

        evtSource.addEventListener("end_event", function (event) {
            console.log(event.data)
            evtSource.close()
        })

        return () => {
            // if (socket.OPEN) {
            //     socket.close()
            // }

            evtSource.close()
        }
    }, [])

    function initWebSocketClient(url: string) {
        var socket = new WebSocket(url)

        socket.onopen = function (event) {
            console.log("socket opened: ", url)
        }

        socket.onmessage = function (event) {
            var data = JSON.parse(event.data)
            console.log("socket recieving: ", data)
            fetchFeed()
        }

        socket.onclose = function (event) {
            console.log("socket closed: ", url)
        }

        return socket
    }

    function onSelectArtwork(item_id: string) {
        // Send params to the next page
        navigate("/history/" + item_id)
    }

    /**
    // 3 ways to fetch API data
    
    // First method (manually) using Axios
    function fetch() {
        axios.get(API_URL + "art/feed/")
            .then(result => {
                // console.log(result.data)
                setItems(result.data)
            }).catch((err) => {
                console.log(err);
                alert("Get error: " + err.message);
            });
    }

    // Second method (using the OpenAPI Client) callback method
    function fetch() {
        ArtService.artGetNewFeedItems()
            .then(response => {
                setItems(response)
            })
            .catch((error) => {
                console.error(error)
                alert("Fetch Error: " + error.message)
            })
    }

     */

    // Third method (using the OpenAPI Client) try/catch method
    async function fetchFeed() {
        try {
            const response = await ArtService.artGetLatestArtworks()
            console.log("fetchFeed: ", response)
            setArtworks(response)
        } catch (error: any) {
            console.error(error)
            alert("fetchFeed Error: " + error.message)
        }
    }

    // if (selected) {
    //     return (
    //         <div>
    //             <div className="heading">
    //                 Decided to distroy "{selected.layers[0].name}", eh?
    //             </div>
    //             <div className="heading">
    //                 You monster
    //             </div>
    //             <div>
    //                 <RowView art={selected} didClose={() => (setSelected(undefined))} />
    //             </div>
    //         </div>
    //     )
    // } else {
    //     return (
    //         <div>
    //             <div className="heading">
    //                 Choose the beauty you wish to destroy
    //             </div>
    //             <div className="grid-container">
    //                 {artworks.map(art => {
    //                     return <CellView key={art.id} art={art} didSelect={() => setSelected(art)} />
    //                 })}
    //             </div>
    //         </div>
    //     )
    // }

    return (
        <div>
            <div className="heading">
                Choose the beauty you wish to destroy
            </div>
            <div className="grid-container">
                {artworks.map(art => {
                    return <CellView key={art.id} art={art} didSelect={() => (onSelectArtwork(art.id))} />
                })}
            </div>
        </div>
    )
}

export default GridView;