#!/usr/bin/env python3
# from gtts import gTTS
# import playsound
import os
from text_formatting import remove_brackets
from text_formatting import one_sentence
import wikipedia
# import speech_recognition
from pyowm import OWM
import geocoder
# import re
import subprocess

#! VERY BUGGY, SOMETIMES WORKS SOMETIMES DOESN'T
#! SOMETIMES ONLY PICKS UP PARTIAL SENTENCES
# def voice_to_text():
#     recog_object = speech_recognition.Recognizer()
#     with speech_recognition.Microphone() as source:
#         recog_object.pause_threshold = 1
#         recog_object.adjust_for_ambient_noise(source, duration=1)
#         print("Speak now")
#         #? Not sure if the time limit is sufficient
#         sound = recog_object.listen(source, phrase_time_limit= 6)
#         command = recog_object.recognize_google(sound)
#         return command


# Making an mp3 everytime is not ideal
#TODO Look to find an alternative
# def text_to_voice(stringtospeak):
#     #! lang = 'en' lady can't speak "opened" correctly
#     tts = gTTS(text=stringtospeak,lang_check = False, lang= 'en_gb')
#     tts.save("response.mp3")
#     playsound.playsound("response.mp3")
#     os.remove('response.mp3')


#! Don't change the order of the ifs/elifs
def choose_method(query):
    query = query.lower()
    if 'weather' in query:
        try:
            result = weather()
            return result
        except Exception as e:
            print(e)
    elif 'what is' in query or 'who is' in query:
        redundant_words = ['what','who','is']
        search_query = ' '.join([word for word in query.split() if word.lower() not in redundant_words])
        try:
            result = wiki(search_query)
            return result
        except Exception as e:
            print(e)
    elif 'open' in query or 'launch' in query:
        redundant_words = ['open', 'launch']
        search_query = ' '.join([word for word in query.split() if word.lower() not in redundant_words])
        try:
            open_app(search_query)
        except Exception as e:
            print(e)
    # elif 'note' in query or 'notes' in query:
    #     if 'read' in query:
    #         read_notes()
    #     else:
    #         take_notes()


def weather():
    #? Does the key ever expire
    #Todo if key expires, make a method to generate a new key periodically
    API_key = '82b5cdd0dad4d8f36d4525ecbf22a6ab'
    owm = OWM(API_key)
    #getting latitude/longitute of user by their IP Address
    g = geocoder.ip('me')
    location = g.latlng
    obs = owm.weather_at_coords(location[0],location[1])
    weather_dict = obs.get_weather().get_temperature(unit = 'celsius')
    #weather_dict has provisions for temp_min and temp_max which could be included
    text = "The temperature right now is {} degree celcius".format(weather_dict['temp'])
    # text_to_voice(text)
    return text


def wiki(topic):
    article = wikipedia.page(wikipedia.search(topic)[0])
    text = remove_brackets(article.content[:500])
    text = one_sentence(text)
    # text_to_voice(text)
    return text
    # print(text)


process_dict = {"calculator":"calc","file explorer":"explorer","notepad":"notepad","paint":"mspaint","microsoft paint":"mspaint","command prompt":"cmd","cmd":"cmd"}
def open_app(application):
    subprocess.call("start "+ process_dict[application],shell = True)
    text = "{} has been opened".format(application)
    # text_to_voice(text)
    print(text)


# note_count = 0

# def take_notes():
#     text_to_voice('What would you like to make a note of ?')
#     note = voice_to_text()
#     global note_count
#     text_file = open(str(note_count+1)+".txt", "w")
#     _ = text_file.write(note)
#     note_count+= 1
#     text_file.close()

#Todo Implement a way to delete notes periodically
#? Should user get an option to delete the note once it's read?
# def read_notes():
#     if note_count == 0:
#         text_to_voice('No note to read')
#     else:
#         recent_note = open(str(note_count)+".txt","r")
#         text_to_voice("Your most recent note says: {}".format(recent_note.read())) 



# choose_method('What is the weather like today?')
# choose_method('who is osama bin laden?')
# choose_method('what is condensation')
# choose_method('who is narendra modi')
# choose_method('oPeN calculator')

# more Functions (mehul)

def save_notes(someNote):
    with open("notes.txt","a+") as notesFile:
        counter = 0
        
        # Writing Notes into File
        notesFile.write("\n"+someNote)
        # Moving cursor to start of file for reading
        notesFile.seek(0)
        
        # Getting no. of lines OR no. of saved notes
        content = notesFile.read()
        print("Your Notes : ")
        print(content)
        coList = content.split("\n")

        for i in coList:
            if i:
                counter += 1
        
        print(counter)

        if counter > 1 :
            return "You have "+str(counter)+" saved notes along with this note."
        else:
            return someNote+". Saved!"

def preview_notes():
    with open("notes.txt","r") as notesFile:
        content = notesFile.read()
        return content

def delete_notes(position):
    deleteValue = position.lower().strip()
    with open("notes.txt","r+") as notesFile:
        refinedContent = []
        content = notesFile.readlines()
        # print(content)
        for i in range(0,len(content)):
            if i==0:
                continue
            else:
                temp = content[i].replace('\r\n','')
                refinedContent.append(temp)

        if deleteValue == 'first':
           final = refinedContent.pop(0)
           print("Deleted Note : "+final)
        elif deleteValue == 'second':
            final = refinedContent.pop(1)
            print("Deleted Note : "+final)
        elif deleteValue == 'third':
            final = refinedContent.pop(2)
            print("Deleted Note : "+final)
        elif deleteValue == 'fourth':
            final = refinedContent.pop(3)
            print("Deleted Note : "+final)     

        # Writing new list of notes into file again
        notesFile.seek(0)
        notesFile.truncate()
        for item in range(0,len(refinedContent)):
            notesFile.write("\n"+refinedContent[item])
        
        return "Deleted Note Succesfully!"