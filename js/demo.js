
const BACKEND_URL = "http://jaroto.pythonanywhere.com"
const ITEMS_DIR = "./items/"
const LOADING_GIF = "./img/loading.gif"

var LOCKED = true
var ID1, ID2

toCSSurl = url => `url("${url}")`

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

	$("#image1").css("background-image", toCSSurl(LOADING_GIF))
	$("#image2").css("background-image", toCSSurl(LOADING_GIF))
	$("#description1").text("loading...")
	$("#description2").text("loading...")

	let [item1, item2] = await getMatch()

	$("#image1").css("background-image", toCSSurl(ITEMS_DIR + item1.source_file))
	$("#image2").css("background-image", toCSSurl(ITEMS_DIR + item2.source_file))
	$("#description1").text(item1.name)
	$("#description2").text(item2.name)

	return [item1.id, item2.id]
}


async function nextMatch(){

	LOCKED = true

	let ids = await loadMatch()

	ID1 = ids[0]
	ID2 = ids[1]

	LOCKED = false
}

function win(winnerId, loserId){

	if(LOCKED)
		return Fuck("Next match is still loading", false)

	sendMatch(winnerId, loserId).then(nextMatch)//.catch(nextMatch)
}

$("#image1").on("click", () => win(ID1, ID2))
$("#image2").on("click", () => win(ID2, ID1))

setTimeout(nextMatch, 1000)



