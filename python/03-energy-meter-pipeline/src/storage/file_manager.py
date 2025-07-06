import os
import tempfile
import shutil

def save_processed_data(data, output_path):
    with open(output_path, 'w') as f:
        f.write(str(data))

def backup_data_files(source_dir, backup_dir):
    shutil.copytree(source_dir, backup_dir)
