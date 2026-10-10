# Dinesh Babu G — Personal Portfolio

A responsive portfolio built with plain HTML, CSS, and JavaScript. No frameworks or build tools are needed.

```
dinesh-portfolio/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── profile.jpg
    ├── warehouse-project.png
    ├── Dinesh-Resume.pdf
    ├── hackathon-technofete.jpeg
    └── hackathon-magnovite.pdf
```

The `assets` files are **your own files**. They are not included, and the site handles them gracefully until you add them (see the table in step 3).

---

## 1. Create the project folder

1. Create a folder named `dinesh-portfolio` (for example on your Desktop).
2. Inside it, create a sub-folder named `assets`.

## 2. Create the files in VS Code

1. Install [VS Code](https://code.visualstudio.com/) if you do not have it.
2. In VS Code choose **File → Open Folder** and select `dinesh-portfolio`.
3. Use the **New File** icon in the Explorer panel to create `index.html`, `style.css`, `script.js`, and `README.md`.
4. Paste the matching code into each file and save with `Ctrl + S` (`Cmd + S` on Mac).

## 3. Add your assets

Copy your files into `dinesh-portfolio/assets/` and rename them **exactly** like this (names are case-sensitive on GitHub Pages):

| File | What it is | If missing |
|---|---|---|
| `profile.jpg` | Your photo (square works best) | A "DG" initials badge is shown |
| `warehouse-project.png` | Screenshot of the warehouse project | A labelled illustration is shown |
| `Dinesh-Resume.pdf` | Your resume | Resume buttons are hidden and a note appears* |
| `hackathon-technofete.jpeg` | TechnoFête'26 certificate (original) | A "file not found" message; buttons disabled* |
| `hackathon-magnovite.pdf` | MAGNOVITE 2026 certificate (original) | A "file not found" message; buttons disabled* |

\* Missing-file detection works when the site is served over `http(s)` (VS Code Live Server or GitHub Pages). If you simply double-click `index.html` (a `file://` address), browsers do not allow the check, so the buttons stay visible and will only work once the files exist.

Do not edit or re-save the certificates. Keep the originals untouched.

### Resume
Copy your resume PDF to `assets/Dinesh-Resume.pdf`. Both resume buttons (hero and My Resume) use this file.

### Profile image
Copy your photo to `assets/profile.jpg`. Keep it under about 500 KB so the page loads quickly.

### Optional: HCL Python certificate
If you have the certificate file, save it as `assets/hcl-python-certificate.pdf`. A "View Certificate" button appears automatically on the Python Programming card (when served over http/https). To use a different filename, change the `href` of the `python-cert-btn` link in `index.html`.

### Optional: project links
In `index.html`, find the project card buttons and put your real URLs in `data-url`:

```html
<a class="btn btn-primary btn-sm" data-url="https://your-live-demo-url" ...>View Project</a>
<a class="btn btn-outline btn-sm" data-url="https://github.com/your-repo" ...>Source Code</a>
```

Buttons with an empty `data-url` stay hidden.

## 4. Run the website locally

**Easiest:** double-click `index.html`.

**Recommended (file checks and PDF previews work best):**
1. In VS Code open **Extensions**, search for **Live Server**, and install it.
2. Right-click `index.html` and choose **Open with Live Server**.
3. The site opens at `http://127.0.0.1:5500`.

## 5. Check it on mobile

- **In the browser:** press `F12` (or `Ctrl+Shift+I`), then click the device toggle icon. Try 360px, 390px, 768px, 1024px, and 1440px widths.
- **On your phone:** connect the phone and computer to the same Wi-Fi, run Live Server, and open `http://<your-computer-IP>:5500` on the phone.
- Check the menu button, the certificate previews, the modal, and the contact form.

## 6. Upload to GitHub

1. Create a free account at [github.com](https://github.com) and click **New repository**.
2. Name it `dinesh-portfolio` (or `dineshbabu-G.github.io` to get a shorter address), keep it **Public**, and create it.
3. Install [Git](https://git-scm.com/downloads), then in the VS Code terminal (`Ctrl + ~`) run:

```bash
git init
git add .
git commit -m "Add portfolio website"
git branch -M main
git remote add origin https://github.com/dineshbabu-G/dinesh-portfolio.git
git push -u origin main
```

(Use your repository's URL if you named it differently.)

Your repository will be public, so anyone can download the files in `assets/`. Only upload documents you are happy to share.

## 7. Publish with GitHub Pages

1. In your repository open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/ (root)**, then click **Save**.
4. After a minute or two your site is live at `https://dineshbabu-g.github.io/dinesh-portfolio/`.

## 8. Update the portfolio later

1. Edit the files in VS Code (for example add a new project card in `index.html`).
2. Save, then run:

```bash
git add .
git commit -m "Update portfolio"
git push
```

3. GitHub Pages refreshes automatically in a minute or two.

### Adding another project
Copy the whole `<article class="card project-card reveal">…</article>` block inside `#projects-grid` in `index.html`, then change the title, description, technology tags, image path, and `data-url` links.

---

## Contact form

The site has no backend, so the form works honestly through your email app: after validation it opens a pre-filled `mailto:` message, and the visitor must press Send there. The page never claims a message was delivered.

To receive messages directly, you can connect a form service such as [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com). Create a form there, then change the `<form>` tag to use the service's `action` URL with `method="POST"` and adjust the submit handler in `script.js`.