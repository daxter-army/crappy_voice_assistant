const $button = document.querySelector('.talk')
const content = document.querySelector('.content')
const question = document.querySelector('.question')

const intro = "My creators, who are a team of four people, were sitting beneath a tree one day, and thought that we should make something who is as witty, intelligent, smart and active as us, and boooooom, i was created."

const actors = ['Robert Downey jr, I love you 3000',
    'Well I have several, one of them is Brad Pitt, he nailed it in Inglorious Basterds 😎',
    'Leonardo Dicaprio, ab inkea baare mein toh kya he bataun 🔥',
    'Keanu Reeves. Do you know that, he once killed three men in a bar, with a pencil.',
    'Well I have several, one of them is Irrfan Khan. He will be remembered always.',
    'Matthew McConaughey. Interstellar, you know that 😎',
    'Chris Hemsworth, Captain America Forever'
]

const greetings = ['I am good, by the way, you are looking awesome today',
    'Doing good homie',
    'Leave me alone',
    'Hola Amigo',
    'I wanted to say this since the day you made me, but I was hesitating, but I will say, You are Ugly.'
]

const facts = ['do you know, it can take a photon 40,000 years to travel from the core of the sun to the surface, but only 8 minutes to travel the rest of the way to earth',
    "North Korea and Cuba are the only places you can't buy Coca-Cola in",
    "There’s only one letter that doesn’t appear in any U.S. state name, and that is Q",
    "Scotland has 421 words for snow"
]

var messageArray = []

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

if(SpeechRecognition){
    console.log('Speech Recognition is supported.')
}
else{
    $button.setAttribute('disabled','disabled')
    $button.title = "Your Browser do not supports Speech Recognition, Try Google Chrome."
    console.log('Speech Recognition is not supported.')
}

const recognition = new SpeechRecognition()

recognition.onstart = function() {
    console.log('Speech Recognition is Active')
    question.innerHTML = ""
    content.textContent = "" 
    // Start Animation
    content.insertAdjacentHTML("afterend", "<div id='loader'><div style='background-color:#fc5c65;'></div><div style='background-color:#fed330;'></div><div style='background-color:#fd9644;'></div><div style='background-color:#26de81;'></div><div style='background-color:#a55eea;'></div><div style='background-color:#3498db;'></div></div>")
}

recognition.onresult = function(event) {
    $button.removeAttribute('disabled')
    recognition.stop()
    
    // Stop Animation
    document.getElementById("loader").remove()

    console.log('Speech Recognition Stopped')
    const current = event.resultIndex

    const transcript = event.results[current][0].transcript

    // not hearing crappy clearly
    var filtered = ""
    if(transcript.toLowerCase().includes('rafi') || transcript.toLowerCase().includes('gruppy')){
        filtered = transcript.toLowerCase().replace("rafi", "Crappy")
        
        question.innerHTML = "Query : " + filtered

        console.log("You said : " + filtered)

        readOutLoud(filtered)        
    }
    else{
        question.innerHTML = "Query : " + transcript

        console.log("You said : " + transcript)
    
        readOutLoud(transcript)
    }
}

// Add Event Listeners
$button.addEventListener('click', () => {
    $button.setAttribute('disabled','disabled')
    recognition.start()
})

function readOutLoud(message){

    const speech = new SpeechSynthesisUtterance()

    speech.text = "I do not want to talk to you."

    if(message.includes('how are you')){
        const finalText = greetings[Math.floor(Math.random()*greetings.length)]
        speech.text = finalText
    }

    if(message.includes('fact')){
        const finalText = facts[Math.floor(Math.random()*facts.length)]
        speech.text = finalText
    }

    if(message.includes('something about yourself')){
        speech.text = intro
    }

    if(message.includes('favourite actor')){
        const finalText = actors[Math.floor(Math.random()*actors.length)]
        speech.text = finalText
    }

    if(message.includes('knock knock')){
        messageArray.push('knock knock')

        speech.text = "Who is there ?"
    }

    else if((message.includes('I am') || message.includes('my name')) && messageArray[0]=='knock knock'){
        if(message.includes('I am')){
            messageArray.push('I am')

            const name = message.replace("I am", "")
            speech.text = "Who is " + name + " ?"
        }
        else{
            messageArray.push('my name is')

            const name = message.replace("my name is", "")
            speech.text = name + " Who ?"
        }
    }

    else if(messageArray[1]=='I am' || messageArray[1]=='my name is'){
        messageArray = []
        
        speech.text = "Hahahahahahahaha. You are very funny, now get lost from here."
    }

    else if(message.includes('homepage') || message.includes('assistant') || message.includes('home page')){
        speech.text = "Launching you out of the orbit in 3...2...1"

        // Redirecting to homepage
        setTimeout( () => {
            window.location.replace('http://localhost:5000')
        }, 4000)

    }

    console.log(messageArray)

    content.textContent = "Reply : " + speech.text

    speech.volume = 1
    speech.rate = 1
    speech.pitch = 1

    window.speechSynthesis.speak(speech)
}