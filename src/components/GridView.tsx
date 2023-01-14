import { useState, useEffect } from 'react';
import CellView from './CellView';
import RowView from './RowView';
import { ArtService, Artwork } from '../client';


function GridView(): JSX.Element {
    const [artworks, setArtworks] = useState<Artwork[]>([])
    const [selected, setSelected] = useState<Artwork | undefined>()

    useEffect(() => {
        fetchFeed()
    }, [])

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
            const response = await ArtService.artGetFeedItems()
            console.log("fetchFeed: ", response)
            setArtworks(response)
        } catch (error: any) {
            console.error(error)
            alert("fetchFeed Error: " + error.message)
        }
    }

    if (selected) {
        return (
            <div>
                <div className="heading">
                    Decided to distroy "{selected.layers[0].name}", eh?
                </div>
                <div className="heading">
                    You monster
                </div>
                <div>
                    <RowView art={selected} didClose={() => (setSelected(undefined))} />
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <div className="heading">
                    Choose the beauty you wish to destroy
                </div>
                <div className="grid-container">
                    {artworks.map(art => {
                        return <CellView key={art.id} art={art} didSelect={() => setSelected(art)} />
                    })}
                </div>
            </div>
        )
    }
}

export default GridView;