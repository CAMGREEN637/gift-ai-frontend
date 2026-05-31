import os
from PIL import Image


def split_grid_image_smart(image_path, rows=3, cols=3):
    if not os.path.exists(image_path):
        print(f"Error: Could not find '{image_path}' in this directory.")
        return

    # Open the image
    img = Image.open(image_path)
    orig_width, orig_height = img.size

    # 1. AUTO-FIX: Crop to a perfect center square to eliminate screenshot padding
    min_dim = min(orig_width, orig_height)
    left_margin = (orig_width - min_dim) // 2
    top_margin = (orig_height - min_dim) // 2
    right_margin = left_margin + min_dim
    bottom_margin = top_margin + min_dim

    # This isolates just the square 3x3 grid area
    img_squared = img.crop((left_margin, top_margin, right_margin, bottom_margin))
    width, height = img_squared.size

    # 2. Calculate exact slide dimensions from the clean square
    slide_width = width // cols
    slide_height = height // rows

    print(f"Original size: {orig_width}x{orig_height}")
    print(f"Cleaned grid area: {width}x{height}")
    print(f"Slicing into 9 individual {slide_width}x{slide_height} slides...\n")

    count = 1
    for r in range(rows):
        for c in range(cols):
            left = c * slide_width
            top = r * slide_height
            right = left + slide_width
            bottom = top + slide_height

            slide = img_squared.crop((left, top, right, bottom))
            output_name = f"slide_{count}.png"
            slide.save(output_name, "PNG")

            print(f"Saved: {output_name}")
            count += 1

    print("\nDone! Check your folder—the borders and text should now be perfectly aligned.")


if __name__ == "__main__":
    split_grid_image_smart("grid.png")