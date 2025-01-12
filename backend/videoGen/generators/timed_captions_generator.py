import whisper_timestamped as whisper
from whisper_timestamped import load_model, transcribe_timestamped
import re

#-----------------------------------------------------------
#generate timed captions
#   audio_filename(str): the path to the audio file to transcribe
#   model_size(str) = base: use base model
#   returns:
#       list: a list of tuples, where each tuple contains a caption and its corresponding timestamp
def generate_timed_captions(audio_filename,model_size="base"):
    WHISPER_MODEL = load_model(model_size)
    gen = transcribe_timestamped(WHISPER_MODEL, audio_filename, verbose=False, fp16=False)
    
    return getCaptionsWithTime(gen)

#helpers------------------------------------------------------------
#helper to split words by size
def splitWordsBySize(words, maxCaptionSize):
   
    halfCaptionSize = maxCaptionSize / 2
    captions = []
    while words:
        caption = words[0]
        words = words[1:]
        while words and len(caption + ' ' + words[0]) <= maxCaptionSize:
            caption += ' ' + words[0]
            words = words[1:]
            if len(caption) >= halfCaptionSize and words:
                break
        captions.append(caption)
    return captions

#helper to get timestamp mapping
def getTimestampMapping(whisper_analysis):
    index = 0
    locationToTimestamp = {}
    for segment in whisper_analysis['segments']:
        for word in segment['words']:
            newIndex = index + len(word['text'])+1
            locationToTimestamp[(index, newIndex)] = word['end']
            index = newIndex
    return locationToTimestamp

#helper to clean words 
def cleanWord(word):
    return re.sub(r'[^\w\s\-_"\'\']', '', word)

#helper to interpolate time from dictionary
def interpolateTimeFromDict(word_position, d):
   
    for key, value in d.items():
        if key[0] <= word_position <= key[1]:
            return value
    return None

#-----------------------------------------------------------
#get captions with time
#   whisper_analysis(dict): the whisper analysis to use
#   maxCaptionSize(int): the maximum size of a caption
#   returns:
#       list: a list of tuples, where each tuple contains a caption and its corresponding timestamp
def getCaptionsWithTime(whisper_analysis, maxCaptionSize=30,):
    wordLocationToTime = getTimestampMapping(whisper_analysis)
    position = 0
    start_time = 0
    CaptionsPairs = []
    text = whisper_analysis['text']
    
    # split into larger chunks to reduce number of segments
    words = text.split()
    total_words = len(words)
    target_segments = min(15, total_words)  # max 15 segments
    words_per_segment = max(maxCaptionSize, total_words // target_segments)
    words = [cleanWord(word) for word in splitWordsBySize(words, words_per_segment)]
    
    for word in words:
        position += len(word) + 1
        end_time = interpolateTimeFromDict(position, wordLocationToTime)
        if end_time and word:
            CaptionsPairs.append(((start_time, end_time), word))
            start_time = end_time

    # merge segments if we still have too many
    if len(CaptionsPairs) > 15:
        merged_pairs = []
        for i in range(0, len(CaptionsPairs), 2):
            if i + 1 < len(CaptionsPairs):
                start = CaptionsPairs[i][0][0]
                end = CaptionsPairs[i+1][0][1]
                text = CaptionsPairs[i][1] + " " + CaptionsPairs[i+1][1]
                merged_pairs.append(((start, end), text))
            else:
                merged_pairs.append(CaptionsPairs[i])
        CaptionsPairs = merged_pairs

    return CaptionsPairs
