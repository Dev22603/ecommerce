import os

# Function to check if a file is an image (you can extend this list if needed)
def is_image(file_name):
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg']
    return any(file_name.lower().endswith(ext) for ext in image_extensions)

def print_folder_structure(path, indent=0, file_handle=None):
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        
        # Skip node_modules and .git folder
        if item == 'node_modules' or item == '.git':
            continue
        elif os.path.isdir(item_path):  # If it's a directory
            file_handle.write('  ' * indent + item + '\n')
            print_folder_structure(item_path, indent + 1, file_handle)
        elif not is_image(item):  # If it's not an image file
            file_handle.write('  ' * indent + item + '\n')

if __name__ == "__main__":
    project_path = "D:\Medkart\E-Commerce"
    output_file = "folder_structure.txt"

    if os.path.isdir(project_path):
        with open(output_file, "w") as file:
            file.write(f"Folder structure of {project_path}:\n")
            print_folder_structure(project_path, 0, file)
        print(f"Folder structure saved to {output_file}")
    else:
        print("Invalid folder path.")
