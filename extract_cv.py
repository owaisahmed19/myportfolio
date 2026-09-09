import pypdf

reader = pypdf.PdfReader('cv_khan.pdf')
print(f"Total Pages: {len(reader.pages)}")

full_text = []
for i, page in enumerate(reader.pages):
    text = page.extract_text()
    full_text.append(f"--- PAGE {i+1} ---\n" + text)

output = "\n\n".join(full_text)
with open('cv_extracted.txt', 'w', encoding='utf-8') as f:
    f.write(output)

print("SUCCESSFULLY SAVED cv_extracted.txt")
print(output[:3000])
