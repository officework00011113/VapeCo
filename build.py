from pathlib import Path
import re, json
from html import escape
p=Path(__file__).resolve().parent
content_config=json.loads((p/'site-content.json').read_text(encoding='utf8'))
asset_dimensions=json.loads((p/'asset-dimensions.json').read_text(encoding='utf8'))
def image(path,alt,css_class,loading='lazy'):
 dimensions=asset_dimensions[path]
 return f'<img src="{escape(path,quote=True)}" alt="{escape(alt,quote=True)}" class="{css_class}" width="{dimensions["width"]}" height="{dimensions["height"]}" loading="{loading}" decoding="async">'
def announcement():
 config=content_config.get('announcement',{})
 text=str(config.get('text','')).strip()
 if not config.get('enabled',False) or not text:return ''
 return '<div class="announcement">'+escape(text)+'</div>'
# These mappings preserve only the original homepage placements. They are not
# evidence that imagery or approved content exists for a category detail page.
home_images={
 'Starter Kits':('029_SM2.webp','Starter kit devices','tile-art'),
 'Pod Devices':('035_black-leather-oxva-nexlim-2-dual-mesh-2026_3.webp','OXVA NeXLIM pod device','tile-art'),
 'Disposables':('031_SM3.webp','Disposable vape devices','tile-art'),
 'E-Liquids':('030_SM1.webp','E-liquid bottles','tile-art'),
 'Nicotine Salts':('037_saltnic_drytobacco_25mg.png','Dry Tobacco nicotine salt bottle','tile-art'),
}
def home_image(name):
 filename,alt,css_class=home_images[name]
 return image('assets/reference-images/'+filename,alt,css_class)
pages=['Home','About Us','Contact Us','Complaints','Privacy Policy','Return Policy','Age Verification','Price Beating','Blog','Blog Article','Locations','Search','Brands','Categories']
cats=['Vaporizers','Starter Kits','Pod Devices','Digital Mods','Full Kits','Disposables','E-Liquids','Nicotine Salts','Menthol Flavors','Tobacco Flavors','Fruit Flavors','Dessert Flavors','Coils and Pods','Accessories','Chargers','Batteries','Tanks','New In','Sale']
brands=['Vgod','Tokyo','Blvk','Pop','Prohibition','Nasty','Ripe Vapes','Naked']
cities=[]
def slug(x):return re.sub('[^a-z0-9]+','-',x.lower()).strip('-')
def url(x):return 'index.html' if x=='Home' else slug(x)+'.html'
def a(x):return f'<a href="{url(x)}">{x}</a>'
def ph(x):return f'<div class="ph"><small>IMAGE PLACEHOLDER</small><strong>{x}</strong><small>Replace with approved asset</small></div>'
def tiles(xs,homepage=False):return '<div class="tiles">'+''.join(f'<a class="tile" href="{url(x)}">{home_image(x) if homepage and x in home_images else ph(x)}<h3>{x}</h3><span>View information →</span></a>' for x in xs)+'</div>'
nav=['Home','Brands','Vaporizers','E-Liquids','New In','Coils and Pods','Accessories','Sale','Disposables','Locations']
def navigation():
 groups=[('Brands',['Brands']+brands),('Categories',['Categories']+cats),('Information',['About Us','Contact Us','Complaints','Blog','Privacy Policy','Return Policy','Age Verification'])]
 out='<a href="index.html">Home</a>'
 for label,items in groups:
  out+=f'<div class="nav-group"><a class="nav-main" href="{url("About Us") if label=="Information" else url(label)}">{label}</a><button class="nav-expand" type="button" aria-label="Expand {label}" aria-expanded="false" aria-haspopup="true">⌄</button><div class="submenu">'+''.join(a(x) for x in items)+'</div></div>'
 out+=''.join(a(x) for x in ['Locations','New In','Sale','Disposables'])
 return out
def shell(title,content):
 return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title} | Vape Co</title><meta name="description" content="Vape Co informational website"><link rel="stylesheet" href="style.css"></head><body><a class="skip" href="#main">Skip to content</a>{announcement()}<header><div class="wrap head"><button id="menu" aria-label="Toggle menu" aria-controls="nav" aria-expanded="false">☰</button><a href="index.html">{image('assets/logo.png','Vape Co','logo','eager')}</a><form action="search.html"><input name="q" aria-label="Search website" placeholder="Search brands, categories, information..."><button aria-label="Search">⌕</button></form><a href="contact-us.html">☎ Contact</a><a href="locations.html">⌖ Stores</a></div><nav id="nav" aria-label="Main navigation"><div class="wrap links">{navigation()}</div></nav></header><main id="main">{content}</main><footer><div class="wrap foot"><div>{image('assets/logo.png','Vape Co','logo','eager')}<p>Approved company description pending.</p><p>Contact and social links pending.</p></div><div><h3>Categories</h3>{''.join(a(x) for x in cats[::3])}</div><div><h3>Information</h3>{''.join(a(x) for x in pages[1:11])}</div><div><h3>Store directory</h3>{''.join(a(x) for x in cities)}</div></div><p class="copyright">© 2026 Vape Co · Content awaiting approval</p></footer><div id="age" class="age" hidden><div class="dialog" role="dialog" aria-modal="true" aria-labelledby="age-title">{image('assets/logo.png','Vape Co','logo','eager')}<h2 id="age-title">Age confirmation — 18+</h2><p>Information on this website is intended for adults. Please confirm your age.</p><button id="adult">I am 18 or older</button><button id="minor">I am under 18</button><p id="age-msg" role="status"></p><small>This popup is not a substitute for legally required verification.</small></div></div><script src="page-directory.js"></script><script src="site.js"></script><script src="sample-prices.js"></script><script src="cart.js"></script></body></html>'''
def write(x,content):
 target=p/('index.html' if x=='Home' else url(x))
 # Deployed HTML pages are manually maintained with premium styling, cart and footer.
 # Never overwrite an existing page with the older generic scaffolding template.
 # This generator can only scaffold pages that do not yet exist.
 if target.exists():
  return
 target.write_text(shell(x,content),encoding='utf8')
hero='<section class="hero"><button id="prev" aria-label="Previous slide">‹</button><div class="slide"><div><small>VAPE CO / PROMOTIONAL PLACEHOLDER</small><h1>Discover Vape Co</h1><p>Approved campaign copy and banner artwork will be added here.</p><a class="btn" href="about-us.html">About us</a></div>'+image('assets/reference-images/004_7_8.webp','Uwell Caliburn product range banner','hero-art','eager')+'</div><div class="slide" hidden><div><small>EXPLORE INFORMATION</small><h1>Brands & Categories</h1><p>Second editable campaign slide.</p><a class="btn" href="brands.html">Explore brands</a></div>'+image('assets/reference-images/008_5_8_1.webp','OXVA NeXLIM device range banner','hero-art')+'</div><button id="next" aria-label="Next slide">›</button><div class="dots" aria-label="Select slide"><button data-slide="0" aria-label="Slide one">●</button><button data-slide="1" aria-label="Slide two">○</button></div></section>'
benefits='<div class="wrap benefits">'+''.join(f'<div><b>{icon}</b><strong>{text}</strong><small>Editable supporting text</small></div>' for icon,text in [('◇','Delivery information'),('✓','Brand information'),('▦','Category directory'),('☎','Customer support'),('⌖','Store directory')])+'</div>'
write('Home',hero+benefits+'<div class="wrap">'+ '<section><h2>Explore categories</h2>'+tiles(cats[:4],homepage=True)+'</section><section><h2>Promotional features</h2><div class="promos">'+ph('Promo banner A')+ph('Promo banner B')+'</div></section><section><h2>Featured information</h2><div class="tabs" role="tablist" aria-label="Featured categories"><button role="tab" aria-selected="true" data-tab="0" class="selected">Featured</button><button role="tab" aria-selected="false" data-tab="1">Latest</button><button role="tab" aria-selected="false" data-tab="2">Popular</button></div><div id="tab-content" role="tabpanel">'+tiles(cats[4:8],homepage=True)+'</div></section><section><h2>Brands</h2>'+tiles(brands[:8],homepage=True)+'</section><section><h2>About Vape Co</h2><p>[Approved company background, editorial text and SEO copy placeholder.]</p></section></div>')
write('About Us','<div class="wrap page"><h1>About Us</h1><div class="two"><div><h2>Our story</h2><p>[Verified company history pending.]</p><h2>Our approach</h2><p>[Approved business information pending.]</p></div>'+ph('Company image')+'</div></div>')
form='<form class="contact" novalidate><label>Name *<input name="name" required></label><label>Email *<input name="email" type="email" required></label><label>Phone<input name="phone" type="tel"></label><label>Message *<textarea name="message" rows="5" required></textarea></label><button>Validate message</button><p class="status" role="status"></p><small>Demo form only. No backend is connected and no message is sent.</small></form>'
write('Contact Us','<div class="wrap page"><h1>Contact Us</h1><div class="two"><div><h2>Contact information</h2><p>[Phone, email, address, opening hours pending.]</p></div>'+form+'</div></div>')
write('Complaints','<div class="wrap page"><h1>Complaints & Suggestions</h1><p>[Approved complaints procedure and response times pending.]</p>'+form+'</div>')
for name,headings in [('Privacy Policy',['Introduction','Information collected','Use of information','Cookies','Retention','Your rights','Contact']),('Return Policy',['Eligibility','Conditions','How to request','Exceptions','Refunds','Contact']),('Age Verification',['Requirements','Verification procedure','Acceptable identification','Enforcement','Contact']),('Price Beating',['Eligibility','Submission','Exclusions','Approval'])]:
 write(name,'<div class="wrap page policy"><h1>'+name+'</h1><p class="notice">Policy template: approved legal wording required.</p><h2>Contents</h2>'+''.join(f'<a href="#{slug(x)}">{x} · </a>' for x in headings)+''.join(f'<section id="{slug(x)}"><h2>{x}</h2><p>[Approved {x.lower()} policy wording pending.]</p></section>' for x in headings)+'</div>')
write('Blog','<div class="wrap page"><h1>Blog</h1><div class="blog-grid"><article class="blog-card">'+ph('Article image')+'<div class="blog-body"><p class="meta">[Publication date] · [Author]</p><h2>Article title placeholder</h2><p>[Approved short article excerpt pending.]</p><a class="btn" href="blog-article.html">Read more</a></div></article></div><nav aria-label="Blog pagination"><span>Page 1 of 1 · Additional articles pending</span></nav></div>')
write('Blog Article','<div class="wrap page policy"><a href="blog.html">← Blog</a><h1>Article title placeholder</h1><p>[Date] · [Author]</p>'+ph('Article hero image')+'<h2>Introduction</h2><p>[Approved article body pending.]</p></div>')
write('Locations','<div class="wrap page"><h1>Store Information</h1><p>Verified store addresses and opening hours are not yet published. Please use the contact page for general enquiries.</p></div>')
for x in cities:write(x,'<div class="wrap page"><a href="locations.html">← Locations</a><h1>'+x+'</h1>'+ph('Store photograph or map')+'<p>[Confirm location, address, phone and opening hours.]</p></div>')
write('Brands','<div class="wrap page"><h1>Brands</h1><p>Brand directory placeholders — associations with Vape Co not confirmed.</p>'+tiles(brands)+'</div>')
write('Categories','<div class="wrap page"><h1>Categories</h1>'+tiles(cats)+'</div>')
for x in brands+cats:
 overview=content_config.get('overviews',{}).get(slug(x),'[Approved informational description pending.]')
 write(x,'<div class="wrap page"><h1>'+x+'</h1>'+ph(x+' artwork')+'<h2>Overview</h2><p>'+escape(overview)+'</p></div>')
write('Search','<div class="wrap page"><h1>Search</h1><form action="search.html" class="searchpage"><label for="query">Search pages</label><input id="query" name="q" placeholder="Search website"><button>Search</button></form><div id="results" aria-live="polite"></div></div>')
directory=[(x,url(x)) for x in pages+cats+brands+cities]+[('Your Cart (Demo)','cart.html')]
(p/'pages.json').write_text(json.dumps(directory,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(p/'page-directory.js').write_text('window.VAPECO_PAGES = '+json.dumps(directory,ensure_ascii=False)+';\n',encoding='utf8')
print(f'Built {len(directory)} pages; page indexes regenerated. Run python3 package.py to create the ZIP.')
