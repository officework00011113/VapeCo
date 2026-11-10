# VapeCo — GitHub Pages setup (static website)

1. Unzip the website. Upload **the contents of `vapeco-site/`**, including `index.html`, `style.css`, assets, `.nojekyll`, `email-demo-config.js`, etc., to the root of your GitHub repository.
2. In GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save**. Wait for the deployment address.
3. Open your live `https://...github.io/...` site, accept the age gate, then open **Contact Us**. Fill sample enquiry, click **Send Website Enquiry**.
4. On **first use**, the email service FormSubmit.co sends an activation email to **officework00011113@gmail.com**. Open Gmail (including Spam), click the activation confirmation. Subsequent submissions can then be forwarded to that inbox. The website cannot authorize this for you.
5. Try a second sample enquiry once activated. Email receipt is only confirmed when you actually see it in Gmail.
6. **Demo Checkout**: all example fields are editable. The form can send a **fictional sample/test notification** via the static form service; it does **not place orders**, collect payments or schedule deliveries. Only enter fake test information.
7. **Local files** (`file:///C:/...`) do not provide server-side email; both forms offer a **mailto** option that opens a draft in your email app. The user must click Send in that app. For reliable website-form delivery test the hosted HTTPS version.

### Configuration

Edit `email-demo-config.js` if you want to change the recipient/subject. The service endpoint `https://formsubmit.co/ajax/<your-email>` must match the address. This publicly exposes the receiving address in the site source.

### About the old PHP files

GitHub Pages cannot run PHP. The previous `api/*.php` files have been deliberately excluded from this GitHub Pages package; do not upload PHP for email functionality.

### Typography & slider

Headings: Sora; body: Manrope via Google Fonts. Fallback fonts are included in the CSS stack if Google Fonts are unavailable. No font binaries are bundled.

Homepage banner loops automatically every 4.8 seconds. It pauses when a visitor hovers/focuses the slider, the tab is hidden, the age confirmation is open or reduced-motion settings are enabled. Manual arrows/dots remain functional.

### Important

- No payment processor is connected; demo checkout is not a real purchase workflow.
- Do not put genuine customer payment, address, or order details into the fictional sample form.
- Before sharing publicly, check applicable age-verification and product marketing laws, content approvals, and third-party form service privacy considerations.
