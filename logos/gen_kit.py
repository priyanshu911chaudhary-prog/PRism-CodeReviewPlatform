import os

os.makedirs('kit', exist_ok=True)

symbol = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <path d="M 128,24 L 218,76 L 218,180 L 128,232 L 38,180 L 38,76 Z" fill="none" stroke="#000" stroke-width="24" stroke-linejoin="round"/>
  <path d="M 90,106 L 38,76 M 166,106 L 218,76 M 128,172 L 128,232" fill="none" stroke="#000" stroke-width="24" stroke-linecap="round"/>
  <circle cx="128" cy="128" r="32" fill="none" stroke="#000" stroke-width="24"/>
</svg>'''

horizontal = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 256">
  <g transform="translate(0, 0)">
    <path d="M 128,24 L 218,76 L 218,180 L 128,232 L 38,180 L 38,76 Z" fill="none" stroke="#000" stroke-width="24" stroke-linejoin="round"/>
    <path d="M 90,106 L 38,76 M 166,106 L 218,76 M 128,172 L 128,232" fill="none" stroke="#000" stroke-width="24" stroke-linecap="round"/>
    <circle cx="128" cy="128" r="32" fill="none" stroke="#000" stroke-width="24"/>
  </g>
  <text x="280" y="168" font-family="system-ui, -apple-system, sans-serif" font-size="144" font-weight="700" letter-spacing="-0.02em" fill="#000">PRism</text>
</svg>'''

stacked = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480">
  <g transform="translate(72, 40)">
    <path d="M 128,24 L 218,76 L 218,180 L 128,232 L 38,180 L 38,76 Z" fill="none" stroke="#000" stroke-width="24" stroke-linejoin="round"/>
    <path d="M 90,106 L 38,76 M 166,106 L 218,76 M 128,172 L 128,232" fill="none" stroke="#000" stroke-width="24" stroke-linecap="round"/>
    <circle cx="128" cy="128" r="32" fill="none" stroke="#000" stroke-width="24"/>
  </g>
  <text x="200" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="100" font-weight="700" letter-spacing="-0.02em" fill="#000" text-anchor="middle">PRism</text>
</svg>'''

with open('kit/final-symbol.svg', 'w') as f: f.write(symbol)
with open('kit/final-horizontal.svg', 'w') as f: f.write(horizontal)
with open('kit/final-stacked.svg', 'w') as f: f.write(stacked)
