import logging
import os

class SimpleLogger:
    def __init__(self, log_file='app.log', level=logging.INFO):
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(level)

        # Create handlers
        file_handler = logging.FileHandler(f"logs/{log_file}")
        console_handler = logging.StreamHandler()

        # Set level for handlers
        file_handler.setLevel(level)
        console_handler.setLevel(level)

        # Create formatters and add it to handlers
        log_format = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(log_format)
        console_handler.setFormatter(log_format)

        # Add handlers to the logger
        self.logger.addHandler(file_handler)
        self.logger.addHandler(console_handler)

    def log_msg(self, message):
        self.logger.info(message)

    def get_logger(self):
        return self.logger
