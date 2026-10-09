# Regenerates assets/og-image.png (1200x630) from assets/logo.svg. Run: python3 make_og.py
import asyncio, pathlib
from playwright.async_api import async_playwright
logo = pathlib.Path('assets/logo.svg').read_text()
html = f"""<html><body style="margin:0;width:1200px;height:630px;background:#0a0a0b;color:#f2f2f0;font-family:Inter,Segoe UI,Arial,sans-serif;display:flex;align-items:center;gap:56px;padding:0 96px;box-sizing:border-box">
<div style="width:180px;height:180px;flex:none">{logo.replace('<svg','<svg width="180" height="180"')}</div>
<div><div style="font:500 22px monospace;color:#a2a3a6;margin-bottom:18px">● open to junior Cloud / DevOps roles</div>
<div style="font-size:76px;font-weight:700;letter-spacing:-2px;line-height:1">Serag Abotaleb</div>
<div style="font-size:32px;color:#a2a3a6;margin-top:18px">Cloud &amp; DevOps · AWS · Networking · Linux</div></div></body></html>"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':1200,'height':630})
        await pg.set_content(html); await pg.screenshot(path='assets/og-image.png'); await b.close()
asyncio.run(main())
