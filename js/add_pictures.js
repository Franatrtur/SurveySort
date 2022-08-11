const BACKEND_URL = "http://jaroto.pythonanywhere.com"
const ITEMS_DIR = "./items/"

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

async function putItem(name, source_file){

    return await makeRequest("pictures", "POST", {
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(
			{name, source_file}
		)
    })
}

const ITEMS = {
    "1": "pizza",
    "2": "burger",
    "3": "sushi",
    "4": "baguette",
    "5": "pancake",
    "6": "muffin",
    "7": "chicken tenders",
    "8": "french fries",
    "9": "steak",
"10": "fruit dumplings",
"11":"fish n chips",
"12": "spaghetti"
}

const src_files = "10.jpg  11.jpeg  12.png  1.png  2.jpg  3.jpeg  4.jpg  5.jpg  6.jpeg  7.jpg  8.jpeg  9.jpg".split("  ")

for(i in src_files){
    let num = src_files[i].split(".")[0]

    await putItem(ITEMS[num], src_files[i])
}