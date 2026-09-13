#!/usr/bin/env python3
"""Fix double-encoded UTF-8 characters in index.html"""

with open('d:/Baitina/index.html', 'rb') as f:
    c = f.read()

s = c.decode('utf-8')

# Map all double-encoded sequences to their correct characters
replacements = [
    # U+203A › right single angle quotation mark
    ('Ã¢â€ â€™', '›'),
    ('Ã¢â€‡', '›'),
    ('Ã¢Å"â€œ', '›'),
    ('Ã¢â‚¬Âº', '›'),
    # U+2014 — em dash
    ('Ã¢â€"', '—'),
    ('Ã¢â‚¬â€"', '—'),
    # U+2013 – en dash
    ('Ã¢â€"', '–'),
    # U+2212 − minus sign
    ('Ã¢â€"Â²', '−'),
    ('Ã¢â€"Â¼', '−'),
    # U+00D7 × multiplication
    ('Ãƒ'+'—', '×'),
    ('Ãƒ'+'Â·', '÷'),
    # U+00B0 ° degree
    ('Ã‚°', '°'),
    # U+00A9 © copyright
    ('Ã‚©', '©'),
    # U+2122 ™ trademark
    ('Ã¢â„¢', '™'),
    # U+201C " left double quote
    ('Ã¢â€œ', '"'),
    # U+201D " right double quote
    ('Ã¢â€"', '"'),
    # U+2018 ' left single quote
    ("Ã¢â€˜", "'"),
    # U+2019 ' right single quote
    ("Ã¢â€™", "'"),
    # Units (corrupted Unicode unit symbols)
    ('Ã°Å¸Â¦', 'pcs'),
    ('Ã°Å¸Â¬', 'kg'),
    ('Ã°Å¸Â¯', 'box'),
    ('Ã°Å¸Â¯', 'sachet'),
    ('Ã°Å¸Â¡', 'kg'),
    ('Ã°Å¸ÂÆ', 'bungkus'),
]

changed = 0
for old, new in replacements:
    cnt = s.count(old)
    if cnt > 0:
        print(f'Fixing {repr(old)} -> {repr(new)} ({cnt} times)')
        s = s.replace(old, new)
        changed += cnt

print(f'Total fixes: {changed}')

with open('d:/Baitina/index.html', 'wb') as f:
    f.write(s.encode('utf-8'))

print('File saved.')
