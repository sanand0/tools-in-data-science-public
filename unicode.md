## Unicode

Ever noticed when you copy-paste some text and get garbage symbols? Or see garbage when you load a CSV file? This video explains why. It covers how computers store text (called character encoding) and why it sometimes goes wonky.

Learn about ASCII (the original 7-bit encoding system that could only handle 128 characters), why that wasn't enough for global languages, and how modern solutions like Unicode save the day by letting us use any character from any language.

Some programs try to guess encodings (sometimes badly!). A signature called BOM (Byte Order Mark)helps computers know exactly how to read text files correctly.

Learn how Unicode, UTF-8 and character encoding works. This is a common gotcha when building apps that handle international text - something bootcamps often skip but developers and data scientists regularly face in the real world.

Unicode is fundamental for data scientists working with international data. Here are key concepts you need to understand:

- **Character Encodings**: Different ways to represent text in computers
  - ASCII (7-bit): Limited to 128 characters, English-only
  - UTF-8: Variable-width encoding, backwards compatible with ASCII
  - UTF-16: Fixed-width encoding, used in Windows and Java
  - UTF-32: Fixed-width encoding, memory inefficient but simple

Common encoding issues you'll encounter:

```python
# Reading files with explicit encoding
with open('file.txt', encoding='utf-8') as f:
    text = f.read()

# Handling encoding errors
import pandas as pd
df = pd.read_csv('data.csv', encoding='utf-8', errors='replace')

# Detecting file encoding
import chardet
with open('unknown.txt', 'rb') as f:
    result = chardet.detect(f.read())
print(result['encoding'])
```

[![Code Pages, Character Encoding, Unicode, UTF-8 and the BOM - Computer Stuff They Didn't Teach You #2 (17 min)](https://i.ytimg.com/vi_webp/jeIBNn5Y5fI/sddefault.webp)](https://youtu.be/jeIBNn5Y5fI)
