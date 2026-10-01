import os

os.makedirs('logos', exist_ok=True)

svg_a = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <path d="M 128,24 L 218,76 L 218,180 L 128,232 L 38,180 L 38,76 Z" fill="none" stroke="#000" stroke-width="24" stroke-linejoin="round"/>
  <path d="M 128,128 L 38,76" fill="none" stroke="#000" stroke-width="24"/>
  <path d="M 128,128 L 218,76" fill="none" stroke="#000" stroke-width="24"/>
  <path d="M 128,128 L 128,232" fill="none" stroke="#000" stroke-width="24"/>
  <circle cx="128" cy="128" r="32" fill="#fff" stroke="#000" stroke-width="24"/>
</svg>'''

svg_b = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <path d="M 52,112 L 128,36 L 204,112" fill="none" stroke="#000" stroke-width="28" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M 52,144 L 128,220 L 204,144" fill="none" stroke="#000" stroke-width="28" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="128" cy="128" r="24" fill="#000"/>
</svg>'''

svg_c = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <polygon points="128,40 216,192 40,192" fill="none" stroke="#000" stroke-width="24" stroke-linejoin="round"/>
  <path d="M 88,144 L 128,184 L 224,88" fill="none" stroke="#000" stroke-width="24" stroke-linejoin="round" stroke-linecap="round"/>
</svg>'''

def make_lockup(symbol):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 256">
  <g transform="translate(0, 0)">
    {symbol}
  </g>
  <text x="280" y="172" font-family="system-ui, -apple-system, sans-serif" font-size="120" font-weight="800" fill="#000" letter-spacing="-2">PR<tspan font-weight="400">ism</tspan></text>
</svg>'''

with open('logos/concept-a.svg', 'w') as f: f.write(svg_a)
with open('logos/concept-b.svg', 'w') as f: f.write(svg_b)
with open('logos/concept-c.svg', 'w') as f: f.write(svg_c)
with open('logos/lockup-a.svg', 'w') as f: f.write(make_lockup(svg_a))
with open('logos/lockup-b.svg', 'w') as f: f.write(make_lockup(svg_b))
with open('logos/lockup-c.svg', 'w') as f: f.write(make_lockup(svg_c))
