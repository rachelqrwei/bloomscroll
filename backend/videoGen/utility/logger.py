import os
from datetime import datetime
import json

# Log types
LOG_TYPE_GROQ = "GROQ"
LOG_TYPE_PEXEL = "PEXEL"

# Log directory paths
DIRECTORY_LOG_GROQ = ".logs/groq_logs"
DIRECTORY_LOG_PEXEL = ".logs/pexel_logs"

# Method to log response from pexel and groq
def log_response(log_type, query,response):
    log_entry = {
        "query": query,
        "response": response,
        "timestamp": datetime.now().isoformat()
    }
    
    filename = '{}_{}.txt'.format(datetime.now().strftime("%Y%m%d_%H%M%S"), log_type)
    
    log_directories = {
        LOG_TYPE_GROQ: DIRECTORY_LOG_GROQ,
        LOG_TYPE_PEXEL: DIRECTORY_LOG_PEXEL
    }
    
    directory = log_directories.get(log_type)
    if not os.path.exists(directory):
        os.makedirs(directory)
    filepath = os.path.join(directory, filename)

    with open(filepath, "w") as outfile:
        outfile.write(json.dumps(log_entry) + '\n')
