import os
import requests
from bs4 import BeautifulSoup
import urllib.parse
import re
import mimetypes

# Function to download an image from URL
def download_image(image_url, folder_name, image_name):
    try:
        response = requests.get(image_url, stream=True)
        content_type = response.headers.get('Content-Type')

        # Determine the file extension
        extension = mimetypes.guess_extension(content_type) or '.jpg'

        # Ensure the folder exists
        os.makedirs(folder_name, exist_ok=True)

        # Build the image filename
        img_filename = os.path.join(folder_name, f"{image_name}{extension}")
        img_filename = sanitize_filename(img_filename)

        # Save the image
        with open(img_filename, 'wb') as f:
            f.write(response.content)
        print(f"Image saved: {img_filename}")
    except Exception as e:
        print(f"Error downloading {image_url}: {e}")

# Function to sanitize filenames
def sanitize_filename(filename):
    invalid_chars = r'[<>:"/\\|?*]'
    return re.sub(invalid_chars, "_", filename)

# Function to search for images using Google and download them
def search_and_download_images(product_name, folder_name):
    search_url = f"https://www.google.com/search?hl=en&tbm=isch&q={urllib.parse.quote(product_name)}"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }
    response = requests.get(search_url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find image tags
    img_tags = soup.find_all('img')

    count = 1
    for img in img_tags[1:]:  # Skip the first image
        if count > 5:  # Limit to 5 images
            break
        img_url = img.get('src')

        # Check if the URL is valid
        if img_url and img_url.startswith("https://encrypted-tbn0.gstatic.com/images"):
            full_img_url = re.sub(r'&amp;', '&', img_url).split('&')[0]
            download_image(full_img_url, folder_name, count)
            count += 1

# Main function
def main():
    categories = [
        'Electronics', 'Clothing', 'Home Appliances', 'Books', 'Toys',
        'Beauty & Personal Care', 'Sports & Outdoors', 'Furniture',
        'Automotive', 'Food & Beverages'
    ]

    products = {
        'Electronics': ['Smartphone', 'Laptop', 'Headphones', 'Smartwatch', 'Camera'],
        'Clothing': ['T-shirt', 'Jeans', 'Dress', 'Jacket', 'Sweater'],
        'Home Appliances': ['Refrigerator', 'Washing Machine', 'Air Conditioner', 'Microwave', 'Blender'],
        'Books': ['Fiction Book', 'Non-fiction Book', 'Mystery Novel', 'Science Book', 'History Book'],
        'Toys': ['Lego Set', 'Doll', 'Puzzle', 'Remote Car', 'Action Figure'],
        'Beauty & Personal Care': ['Shampoo', 'Conditioner', 'Face Cream', 'Lipstick', 'Perfume'],
        'Sports & Outdoors': ['Tennis Racket', 'Football', 'Basketball', 'Yoga Mat', 'Bicycle'],
        'Furniture': ['Sofa', 'Dining Table', 'Bed', 'Chair', 'Bookshelf'],
        'Automotive': ['Car Seat Cover', 'Tire', 'Car Stereo', 'Brake Pads', 'Car Battery'],
        'Food & Beverages': ['Coffee', 'Tea', 'Juice', 'Snacks', 'Chocolates']
    }

    for idx, category in enumerate(categories, start=1):
        category_folder = f"{idx:02d}_{sanitize_filename(category)}"
        print(f"\nProcessing Category: {category} (Folder: {category_folder})")

        for product in products.get(category, []):
            product_folder = os.path.join(category_folder, sanitize_filename(product))
            print(f"\n  Searching for: {product} in {category}")
            search_and_download_images(product, product_folder)

if __name__ == "__main__":
    main()
