
const BACKEND_URL = "http://jaroto.pythonanywhere.com"

function Error(message = "uncaught error"){
	console.error(message)
	alert(message)
}

async function sendMatch(winner_id, loser_id){

	let response = await fetch(BACKEND_URL + "/match", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify( {winner_id, loser_id} )
	})

	if(!response.ok)
		Error("Response error code")

	return await response.json()
}

