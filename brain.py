from flask import Flask, render_template, request
from assistantfunctions import choose_method, save_notes, preview_notes, delete_notes
import random

# To ensure user has said he/she wants to save a note before asking what note to save
deleteNote = []

greetings = ['I am rocking 🤘', 'I was, am & will be Awesome 😎', 'Dealing perfectly with life situations, unlike you 😜' , 'Watching the clock, time getting change 🙌']

app = Flask(__name__)

# Main Homepage
@app.route('/')
def index():
    return render_template("index.html")

# Route for sending data
@app.route('/crappy', methods = ['POST'])
def crappy():
    if request.method == "POST":
        print("ACCESSED : CRAPPY RECEIVED REQUEST")

        # Will print true if request is JSON
        print("Request is in JSON Format : %s" % request.is_json)
        
        # Getting content of JSON 
        inputData = request.get_json()

        # data variable contains query sent from frontend
        data = inputData['input']
        action = inputData['command']

        print("input : %s" % data)
        print("command : %s" % action)

        # DO NOT ALTER ORDER

        # For weather forcasting
        if 'weather' in data:
            reply = choose_method(data)
            print(reply)
            output = {
                'value': reply
            }
            return output

        # For reading notes
        elif 'notes' in data and 'open' in action:
            reply = preview_notes()
            output = {
                'value': "Here you go,\n"+reply
            }
            return output

        # delete notes
        elif 'note' in data and 'delete' in action:
            deleteNote.append('true')

            reply = preview_notes()
            output = {
                'value': 'Which of the following notes would you like to delete ?\n'+reply
            }
            return output

        # Delete first note
        elif 'first' in data and 'delete' in action:
            print(deleteNote[0])

            if deleteNote:
                print("inside deleting")
                reply = delete_notes(data)
                output = {
                    'value': reply
                }
                return output
            else:
                output = {
                    'value': "Speak 'note delete' first, to delete notes"
                }
                return output

        # Delete second note
        elif 'second' in data and 'delete' in action:
            print(deleteNote[0])

            if deleteNote:
                print("inside deleting")
                reply = delete_notes(data)
                output = {
                    'value': reply
                }
                return output
            else:
                output = {
                    'value': "Speak 'note delete' first, to delete notes"
                }
                return output

        # Delete third note
        elif 'third' in data and 'delete' in action:
            print(deleteNote[0])

            if deleteNote:
                print("inside deleting")
                reply = delete_notes(data)
                output = {
                    'value': reply
                }
                return output
            else:
                output = {
                    'value': "Speak 'note delete' first, to delete notes"
                }
                return output

        # Delete fourth note
        elif 'fourth' in data and 'delete' in action:
            print(deleteNote[0])

            if deleteNote:
                print("inside deleting")
                reply = delete_notes(data)
                output = {
                    'value': reply
                }
                return output
            else:
                output = {
                    'value': "Speak 'note delete' first, to delete notes"
                }
                return output
       
        # For opening Programes
        elif 'open' in action:
            choose_method("open %s" % data)
            reply = data.replace("open","")
            output = {
                'value': 'opened %s' % reply
            }
            return output

        # Random greeting
        elif 'hello' in data or 'how are you' in data:
            output = {
                'value': greetings[random.randint(0,3)]
            }
            return output

        # For saving new note
        elif 'note this' in action:
            cleanedNote = data.lower().strip()
            reply = save_notes(cleanedNote)
            output = {
                'value': reply
            }
            return output

        # For Wikipedia answers
        elif 'who is' in data or 'what is' in data:
            reply = choose_method(data)
            output = {
                'value': reply
            }
            return output

        # For input not related to core functions, redirect to google
        else:
            output = {
                'value': 'google'
            }
            return output

        # If nothing matches 
        output = {
            'value': "Unable to get you...Speak Again"
        }
        return output

@app.route('/crappy/knockknock', methods = ['POST'])
def knockknock():
    if request.method == "POST":
        return render_template("knockknock.html")

# For any invalid URL
@app.errorhandler(404)
def not_found(e):
    return render_template("404.html")

if __name__ == '__main__':
    app.debug = True
    app.run()