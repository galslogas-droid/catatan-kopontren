#!/usr/bin/env python3
"""Fix remaining double-encoded UTF-8 icons in index.html"""

with open('d:/Baitina/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

import re
# Find all icon values
icons = re.findall(r"icon:'([^']+)'", content)
unique_icons = set(icons)

print('Current unique icons:')
for icon in sorted(unique_icons):
    print(f'  {repr(icon)}')

# Fix the remaining corrupted icon (Mbako - herbs)
# The corrupted pattern contains a special character sequence
for icon in unique_icons:
    if '°̈' in icon or '°ˆ' in icon:
        print(f'\nFound corrupted icon: {repr(icon)}')
        # Replace with herb icon for Mbako
        content = content.replace(f"icon:'{icon}'", "icon:'🌿'")

# Write back
with open('d:/Baitina/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('\nFile saved.')

# Verify
with open('d:/Baitina/index.html', 'r', encoding='utf-8') as f:
    content = f.read()
icons = re.findall(r"icon:'([^']+)'", content)
unique_icons = set(icons)
print(f'\nFinal unique icons ({len(unique_icons)}):')
for icon in sorted(unique_icons):
    print(f'  {repr(icon)}')

