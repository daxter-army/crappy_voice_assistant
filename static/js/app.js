// Initialize SpeechSynth API
const synth = window.speechSynthesis;

// Elements
const textForm = document.querySelector('#text-to-voice');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
// const body = document.querySelector('body');

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

// Speak
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

// Adding Event Listeners
textForm.addEventListener('submit', e => {
    // Preventing to submitting to a file
    e.preventDefault()
    speak()
    
    // Remove focus from textInput
    textInput.blur()
})

// Rate value change
rate.addEventListener('change', e => rateValue.textContent = rate.value)

// Pitch value change
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value)

//Speak again with selected speech
voiceSelect.addEventListener('change', e => speak())