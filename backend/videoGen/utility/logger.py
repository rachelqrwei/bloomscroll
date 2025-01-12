import os
from datetime import datetime
import json

# Log types
LOG_TYPE_GROQ = "GROQ"
LOG_TYPE_PEXEL = "PEXEL"

# Log directory paths
DIRECTORY_LOG_GROQ = "./.logs/groq_logs"
DIRECTORY_LOG_PEXEL = "./.logs/pexel_logs"

# Log type : directory
LOG_DIRECTORIES = {
    LOG_TYPE_GROQ: DIRECTORY_LOG_GROQ,
    LOG_TYPE_PEXEL: DIRECTORY_LOG_PEXEL
}

# Method to log response from pexel and groq
def log_response(log_type, query,response):
    try:
        log_entry = {
            "query": query,
            "response": response,
            "epoch": int(datetime.now().timestamp()),
            "timestamp": datetime.now().isoformat()
        }
        
        # Generate file name
        filename = '{}_{}.json'.format(datetime.now().strftime("%Y%m%d_%H%M%S"), log_type)
        
        # Get dir
        directory = LOG_DIRECTORIES.get(log_type)
        if not directory:
            raise ValueError(f"Invalid log type: {log_type}")

        # mkdir if not exist
        try:
            if not os.path.exists(directory):
                os.makedirs(directory)
        except OSError as e:
            raise OSError(f"Failed to create directory {directory}: {str(e)}")
            
        filepath = os.path.join(directory, filename)

        # Write log
        try:
            with open(filepath, "w") as outfile:
                outfile.write(json.dumps(log_entry) + '\n')
        except IOError as e:
            raise IOError(f"Failed to write log file {filepath}: {str(e)}")
            
    except Exception as e:
        # Log the error
        print(f"Error logging response: {str(e)}")
        raise


def main():
    log_response(LOG_TYPE_GROQ, "GROQ: Test query", "GROQ: Test response")
    log_response(LOG_TYPE_PEXEL, "PEXEL: Test query", "PEXEL: Test response")
    print("Test complete.")

if __name__ == "__main__":
    main()
