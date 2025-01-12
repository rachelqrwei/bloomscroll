"""# Instructions

Given the following video script and timed captions, identify three visually specific and relevant keywords for each time segment that can be used to search for background videos. The keywords should be concise and capture the main visual elements of the scene. They can be synonyms or related terms. If a caption is vague or general, consider the next timed caption for more context. If a keyword is a single word, try to return a two-word keyword that is visually specific. If a time frame contains multiple important elements, divide it into shorter time frames with one keyword each. Ensure that the time periods are strictly consecutive and cover the entire length of the video. Each keyword should cover between 2-4 seconds. The output should be in JSON format, like this: [[[t1, t2], ["keyword1", "keyword2", "keyword3"]], [[t2, t3], ["keyword4", "keyword5", "keyword6"]], ...]. Please handle all edge cases, such as overlapping time segments, vague or general captions, and single-word keywords.

Additionally, ensure that all selected keywords are contextually related to the original video's theme or subject matter.

For example, if the caption is 'The cheetah is the fastest land animal, capable of running at speeds up to 75 mph', the keywords should include 'cheetah running', 'fastest animal', and '75 mph'. Similarly, for 'The Great Wall of China is one of the most iconic landmarks in the world', the keywords should be 'Great Wall of China', 'iconic landmark', and 'China landmark'.

Important Guidelines:

- Use only English in your text queries.
- Each search string must depict something visual occurring in the video.
- The depictions have to be extremely visually specific, like 'rainy street' or 'cat sleeping'.
- 'emotional moment' <= BAD, because it doesn't depict something visually.
- 'crying child' <= GOOD, because it depicts something visual.
- The list must always contain the most relevant and appropriate query searches.
- ['Car', 'Car driving', 'Car racing', 'Car parked'] <= BAD, because it's 4 strings.
- ['Fast car'] <= GOOD, because it's 1 string.
- ['Un chien', 'une voiture rapide', 'une maison rouge'] <= BAD, because the text query is NOT in English.

Note: Your response should be the response only and no extra text or data.
""" 