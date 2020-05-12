// Speech to Text
const searchForm = document.querySelector('#voice-to-text')
const searchFormInput = searchForm.querySelector('input')
const $queryButton = document.querySelector('#send-to-sever')

// Experimental Features
const $interimResultsButton = document.getElementById('interim-results')
const $continousResultsButton = document.getElementById('continuous-results')

// Text to Speech
const textForm = document.querySelector('#text-to-voice')
const textInput = document.querySelector('#text-input')
// Read only
textInput.readOnly = true
const voiceSelect = document.querySelector('#voice-select')
const rate = document.querySelector('#rate')
const rateValue = document.querySelector('#rate-value')
const pitch = document.querySelector('#pitch')
const pitchValue = document.querySelector('#pitch-value')

// Web Speech API for Speech to Text
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

// Web Speech API for Text to Speech
const synth = window.speechSynthesis

let voices = [];

const getVoices = () => {
    voices = synth.getVoices()

    //Looping through voices & Generating options for voices
    voices.forEach(voice => {
        // Create option element
        const option = document.createElement('option')
        // Filling option with voices and languages
        option.textContent = voice.name + '(' + voice.lang + ')'
        // Set needed option attributes
        option.setAttribute('data-lang', voice.lang)
        option.setAttribute('data-name', voice.name)

        voiceSelect.appendChild(option)
    })
}

getVoices()

// Values are fetched Asynchronously,
// to fix this, 
if(synth.onvoiceschanged !== undefined){
    synth.onvoiceschanged = getVoices
}

if(SpeechRecognition){
    console.log("Speech Recognition is supported")

    searchForm.insertAdjacentHTML("beforeend", '<button id="microphone-btn" type="button"><i class="fas fa-microphone fa-2x"></i></button>');
    
    const micBtn = searchForm.querySelector('button')
    const micIcon = micBtn.querySelector('i')

    const recognition = new SpeechRecognition()

    // For intermediate results ---->less acurate
    recognition.interimResults = false
    
    // For continous Results ---->
    recognition.continuous = true

    // Event Listeners for Experimental Properties
    $interimResultsButton.addEventListener('click', ()=>{
        if(recognition.interimResults){
            recognition.interimResults = false
            $interimResultsButton.innerHTML = "OFF"
            $interimResultsButton.style.border = "2px #e74c3c solid"
            $interimResultsButton.style.color = "#e74c3c"
        }
        else{
            recognition.interimResults = true
            $interimResultsButton.innerHTML = "ON"
            $interimResultsButton.style.border = "2px #2ecc71 solid"
            $interimResultsButton.style.color = "#2ecc71"
        }
        console.log("Status of Interim Results Property : " + recognition.interimResults)
    })

    $continousResultsButton.addEventListener('click', ()=>{
        if(recognition.continuous){
            recognition.continuous = false
            $continousResultsButton.innerHTML = "OFF"
            $continousResultsButton.style.border = "2px #e74c3c solid"
            $continousResultsButton.style.color = "#e74c3c"

        }
        else{
            recognition.continuous = true
            $continousResultsButton.innerHTML = "ON"
            $continousResultsButton.style.border = "2px #2ecc71 solid"
            $continousResultsButton.style.color = "#2ecc71"
        }
        console.log("Status of Continous Results Property : " + recognition.continuous)
    })


    micBtn.addEventListener('click', micBtnClick)
    function micBtnClick(){
        if(micIcon.classList.contains("fa-microphone")){
            //Start Speech Recognition
            recognition.start()
        }
        else{
            // Stop Speech Recognition
            recognition.stop()
        }
    }

    // Adding Event Listeners at start and stop of Speech Recognition
    recognition.addEventListener('start', startSpeechRecognition)
    function startSpeechRecognition(){

        micIcon.classList.remove("fa-microphone")
        micIcon.classList.add("fa-microphone-slash")

        // Starting Animation
        searchForm.insertAdjacentHTML("afterend", "<div id='loader'><div style='background-color:#fc5c65;'></div><div style='background-color:#fed330;'></div><div style='background-color:#fd9644;'></div><div style='background-color:#26de81;'></div><div style='background-color:#a55eea;'></div><div style='background-color:#3498db;'></div></div>")

        searchFormInput.focus()

        console.log("Speech Recognition Active")
    }

    recognition.addEventListener('end', endSpeechRecognition)
    function endSpeechRecognition(){

        micIcon.classList.remove("fa-microphone-slash")
        micIcon.classList.add("fa-microphone")

        searchFormInput.focus()

        //Stop Animation
        document.querySelector("#loader").remove()

        console.log("Speech Recognition Disconnected")
    }

    recognition.addEventListener('result', resultOfSpeechRecognition)
    function resultOfSpeechRecognition(event){

        // Making it continous to send query by voice

        const currentResultIndex = event.resultIndex
        const transcript = event.results[currentResultIndex][0].transcript
        
        if(transcript.toLowerCase().trim()==="terminate"){
            recognition.stop()
        }
        else{
            if(transcript.toLowerCase().trim()==="go" ||
                transcript.toLowerCase().trim()==="note this" ||
                transcript.toLowerCase().trim()==="open" ||
                transcript.toLowerCase().trim()==="delete"){

                var order = transcript.toLowerCase().trim()
                // Sending Result to Crappy Brain's
                const query = document.getElementById('data').value
                
                if(query==""){
                    return alert("Speak Query First")
                }

                console.log("Query : " + query)

                var message = {
                    'input' : query,
                    'command' : order
                }
            
                // Sending response to server
                const url = 'http://localhost:5000/crappy'
                var request = new Request(url, {
                    method: "POST",
                    body: JSON.stringify(message),
                    headers: new Headers({
                        'Content-Type' : 'application/json'
                    })
                })
            
                fetch(request)
                .then((response) => response.json())
                .then((data) => {
                    recognition.stop()

                    console.log(data.value)

                    if(data.value==='google'){
                         return window.location.href = "https://www.google.com/search?q="+query
                    }

                    // Refining search
                    if(data.value.trim()==='nudes'||data.value.trim()==='nude'){
                        data.value = 'notes'
                    }

                    textInput.value = data.value

                    const speak = () => {
                        // If already speaking
                        if(synth.speaking){
                            console.error('Already speaking')
                            return
                        }
                        if(textInput.value !== ''){
                            // Get speak text
                            const speakText = new SpeechSynthesisUtterance(textInput.value)
                            
                            // Speak end
                            speakText.onend = e => {
                                console.log('Done speaking...')
                            }
                            
                            // Speak error
                            speakText.onerror = e =>{
                                console.error('Something went wrong...This is error', e)  
                            }
                    
                            // Selected voice
                            const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name')
                    
                            //Loop through voices
                            voices.forEach(voice => {
                                if(voice.name == selectedVoice){
                                    speakText.voice = voice
                                }
                            })
                    
                            // Set pitch and rate
                            speakText.rate = rate.value
                            speakText.pitch = pitch.value
                    
                            // Speak
                            synth.speak(speakText)
                        }
                    }
                    speak()
    
                    // Remove focus from textInput
                    textInput.blur()

                    // Rate value change
                    rate.addEventListener('change', (e) => {
                        rateValue.textContent = rate.value
                        speak()
                    })

                    // Pitch value change
                    pitch.addEventListener('change', (e) => {
                        pitchValue.textContent = pitch.value
                        speak()
                    })

                    //Speak again with selected speech
                    voiceSelect.addEventListener('change', e => speak())
                })
                // searchForm.submit()
            }
            else if(transcript.toLowerCase().trim()==="google"){
                // Google Search
                searchForm.action = "https://google.com/search"
                searchForm.method = "GET"
                searchForm.target = "_blank"
                document.getElementById('data').name = "q"

                searchForm.submit()
            }

            else if(transcript.toLowerCase().trim()==="youtube"){
                // Youtube Search
                searchForm.action = "https://www.youtube.com/results"
                searchForm.method = "GET"
                searchForm.target = "_blank"
                document.getElementById('data').name = "search_query"

                searchForm.submit()
            }

            else if(transcript.toLowerCase().trim()==="open the web baby"){
                // Google Homepage
                searchForm.action = "https://www.google.com"
                searchForm.method = "GET"
                searchForm.target = "_blank"

                searchForm.submit()
            }

            else if(transcript.toLowerCase().trim()==="knock knock"){
                // Youtube Search
                searchForm.action = "http://localhost:5000/crappy/knockknock"
                searchForm.method = "POST"

                searchForm.submit()
            }

            else if(transcript.toLowerCase().trim()==="clear"){
                searchFormInput.value = ""
            }
            else{
                searchFormInput.value = transcript
            }
        }
        
        // setTimeout(() => {
        //     searchForm.submit()
        // }, 500)
    }
}
else{
    console.log("Speech Recognition is not supported")
}

// Event Listener
// searchForm.addEventListener('submit' ,(e) => {
//     console.log("here")
//     e.preventDefault()
//     const query = e.target.elements.data.value

//     var message = {
//         input : query
//     }

//     // Sending response to server
//     const url = 'http://localhost:5000/crappy'
//     var request = new Request(url, {
//         method: "POST",
//         body: JSON.stringify(message),
//         headers: new Headers({
//             'Content-Type' : 'application/json'
//         })
//     })

//     fetch(request)
//     .then((response) => response.json())
//     .then((data) => {
//         console.log(data)
//     })
// })

