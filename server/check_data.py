import pandas as pd

df = pd.read_pickle('books_metadata.pkl')
print(f'Total books: {len(df)}')
print(f'\nColumn names: {df.columns.tolist()}')
print('\n--- First 10 books categories ---')
for i in range(min(10, len(df))):
    cat = df.iloc[i].get('categories', 'N/A')
    title = df.iloc[i].get('title', 'N/A')
    print(f'{i}: "{cat}" - {title[:60]}')

print('\n--- Category value distribution ---')
cats = df['categories'].fillna('EMPTY').astype(str)
print(cats.value_counts().head(20))

print(f'\n--- Books with non-empty categories ---')
non_empty = df[df['categories'].notna() & (df['categories'] != '')]
print(f'Count: {len(non_empty)}')
if len(non_empty) > 0:
    print('Sample:')
    for i in range(min(5, len(non_empty))):
        print(f'  - {non_empty.iloc[i]["categories"]} | {non_empty.iloc[i]["title"][:60]}')
