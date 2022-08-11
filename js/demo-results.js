
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


