#!/usr/bin/env python3
"""
export_catalogue.py
───────────────────
Reads SHRI_Enterprises_Ecommerce_Catalogue_Organized.xlsx
and writes catalogue_products.json for the Node.js importer.

Usage:
    python3 export_catalogue.py                          # uses default path
    python3 export_catalogue.py path/to/catalogue.xlsx  # custom path

Output:
    catalogue_products.json  (same directory as this script)
"""

import sys
import json
import math
import pandas as pd
from pathlib import Path

XLSX_PATH = sys.argv[1] if len(sys.argv) > 1 else (
    Path(__file__).parent.parent / 'SHRI_Enterprises_Ecommerce_Catalogue_Organized.xlsx'
)

def clean_str(val):
    if val is None or (isinstance(val, float) and math.isnan(val)):
        return ''
    return str(val).strip()

def main():
    print(f'📂  Reading: {XLSX_PATH}')
    df = pd.read_excel(XLSX_PATH, sheet_name='Master Catalogue', header=3)
    df.columns = ['_drop', 'sno', 'name', 'description', 'category',
                  'subcategory', 'min_order', 'box_qty', 'rate', 'price_range']

    # Keep only numeric S.No rows (skip headers, blank rows, section titles)
    df = df.dropna(subset=['sno'])
    df = df[df['sno'].astype(str).str.match(r'^\d+(\.\d+)?$')]
    df['sno']       = df['sno'].astype(float).astype(int)
    df['rate']      = pd.to_numeric(df['rate'], errors='coerce').fillna(0)
    df['min_order'] = pd.to_numeric(df['min_order'], errors='coerce').fillna(1).astype(int)
    df['box_qty']   = pd.to_numeric(df['box_qty'], errors='coerce').fillna(1).astype(int)

    records = []
    for _, row in df.iterrows():
        records.append({
            'sno':              int(row['sno']),
            'name':             clean_str(row['name']),
            'shortDescription': clean_str(row['description']),
            'category':         clean_str(row['category']),
            'subcategory':      clean_str(row['subcategory']),
            'moq':              int(row['min_order']),
            'boxQty':           int(row['box_qty']),
            'price':            float(row['rate']),
            'priceRange':       clean_str(row['price_range']),
        })

    out_path = Path(__file__).parent.parent / 'catalogue_products.json'
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(records, f, indent=2, ensure_ascii=False)

    print(f'✅  Exported {len(records)} products → {out_path}')

    # Quick sanity check
    cats = {r['category'] for r in records}
    print(f'📂  Categories found: {len(cats)}')
    for c in sorted(cats):
        print(f'    • {c}')

if __name__ == '__main__':
    main()
