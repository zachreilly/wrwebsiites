# wrwebsites

The public website for wrwebsites (wrwebsites.com). React + Vite, built to plain static files and hosted on Namecheap.

## Deploying

Every push to `main` builds the site and uploads it to Namecheap automatically (see `.github/workflows/deploy.yml`). You can also run it by hand from the **Actions** tab → **Deploy to Namecheap** → **Run workflow**.

It needs these repository secrets (Settings → Secrets and variables → Actions):

| Secret | What to put in it |
| --- | --- |
| `FTP_SERVER` | `ftp.wrwebsites.com` |
| `FTP_USERNAME` | the main cPanel FTP username |
| `FTP_PASSWORD` | that account's password |
| `FTP_DIR` | `public_html/` (wrwebsites.com is the main domain on the hosting account) |

## Building by hand

```
npm install
npm run dev      # local preview while editing
npm run build    # makes the finished site in dist/
```

Upload everything inside `dist/` (including the hidden `.htaccess`) to `public_html/`.

## Forms

The onboarding, consultation and website-update forms post to `/send.php`, which emails them to zachhreillyy@gmail.com (change `$TO_EMAIL` at the top of `client/public/send.php`). Replies go straight to the customer. If emails land in spam, set up SPF and DKIM in cPanel → Email Deliverability.

## Portfolio

Projects on `/portfolio` come from `client/src/data/portfolio.ts`. Add an entry there and put the image in `client/public/portfolio/`.

## Not included yet

The admin dashboard, customer portal and GoCardless payments from the old Replit version were removed for the move to static hosting. They're in the git history if needed for the rebuild.
