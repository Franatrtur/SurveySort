
const BACKEND_URL = "http://jaroto.pythonanywhere.com"
const ITEMS_DIR = "./items/"
const LOADING_GIF = 

const element = id => document.getElementById(id)

function Fuck(message = "uncaught error", disrupt = false, info = {}){

	console.error(message)
	console.log(info)
	alert("Oops! Something has gone wrong")

	if(disrupt)
		throw message
}


async function makeRequest(requestType, method = "GET", parameters = {}){

	let answer

	try{

		let response = await fetch(BACKEND_URL + "/" + requestType, {
			method,
			...parameters
		})

		if(!response.ok)
			Fuck(`Server responded with error code: ${response.status} (${response.statusText})`, true, response)

		answer = await response.json()
	}
	catch(error){

		Fuck("Server request failed: " + error.message, true, error)
	}

	if("errorMessage" in answer)
		Fuck("Server responded with an error message: " + answer.errorMessage)

	return answer.result
}

async function sendMatch(winner_id, loser_id){

	return await makeRequest("match", "PUT", {
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(
			{winner_id, loser_id}
		)
	})
}

async function getMatch(){

	return await makeRequest("match", "GET")
}


async function loadMatch(){

	// element("image1").setAttribute("src", ITEMS_DIR + item1.source_file)
	// element("image2").setAttribute("src", ITEMS_DIR + item2.source_file)

	let [item1, item2] = await getMatch()

	element("image1").setAttribute("src", ITEMS_DIR + item1.source_file)
	element("image2").setAttribute("src", ITEMS_DIR + item2.source_file)
}


