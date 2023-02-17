import { useState, useEffect } from 'react'
import { UsersService } from './client'

export default function Account(): JSX.Element {
    var [claim, setClaim] = useState<String>()

    useEffect(() => {
        getClaim()
    }, [])

    async function getClaim() {
        try {
            const response = await UsersService.usersCheckClaim()
            console.log("Response: ", response)
            setClaim(response)
        } catch (error: any) {
            console.dir(error)
            alert("Error: " + error.body.detail)
        }
    }

    return (
        <div>
            {claim &&
                <pre>{JSON.stringify(claim, null, 2)}</pre>
            }
        </div>
    )
}