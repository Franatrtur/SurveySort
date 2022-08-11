
// TSH=s=>{for(var i=0,h=9;i<s.length;)h=Math.imul(h^s.charCodeAt(i++),9**9);return h^h>>>9}


// if(TSH(prompt("password:")) != -420681791)
//     window.location.reload()


const BACKEND_URL = "http://jaroto.pythonanywhere.com"
const ITEMS_DIR = "./items/"
const LOADING_GIF = "./img/loading.gif"

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



async function pullResults(){

    return await makeRequest("all", "GET")
}


async function drawResults(){

	let results = await pullResults()

	$("#results").html("")
	let cont = ""

	results.sort((itemA, itemB) => itemB.elo - itemA.elo)

	let maxelo = results[0].elo

	for(let i = 0; i < results.length; i++){

		let item = results[i]

		cont += `
		<div class="item" id="item${item.id}">
			<div class="item-content">
				<div class="rank">${i+1}</div>
				<div class="item-name">${item.name}</div>
				<div class="score">${item.elo}</div>
			</div>
			<div class="line" style="width:${100*item.elo/maxelo}%"></div>
		</div>
		`
	}

	$("#results").html(cont)
}

drawResults()

var INTERVAL = setInterval(drawResults, 5000)

function toggleInterval(){

	if(INTERVAL){

		clearInterval(INTERVAL)
		INTERVAL = 0
		$("#stop").addClass("go")
		$("#stop").removeClass("stop")
	}
	else{
		INTERVAL = setInterval(drawResults, 5000)
		$("#stop").addClass("stop")
		$("#stop").removeClass("go")
	}
}

$("#stop").on("click", toggleInterval)