import re
from bible.bible_aliases import BOOK_ALIASES

def parse_range(reference: str):
    match = re.match(r"([^\d]+)\s*(\d+):(\d+)(?:-(\d+))?", reference.strip(), re.IGNORECASE)
    if not match:
        raise ValueError("Invalid reference format")

    book_raw, chapter, start_verse, end_verse = match.groups()

    if re.match(r'[a-zA-Z]', book_raw.strip()[0]):
        book_key = book_raw.strip().lower()
        book = BOOK_ALIASES.get(book_key, book_raw.strip())
    else:
        book = BOOK_ALIASES.get(book_raw.strip(), book_raw.strip())

    chapter = int(chapter)
    start = int(start_verse)
    end = int(end_verse) if end_verse else start

    return book, chapter, start, end
