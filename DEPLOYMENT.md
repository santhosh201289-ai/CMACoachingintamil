# Auto-deploy to server (62.72.57.170) on git push

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site
and `rsync`s `dist/` to your server over SSH. One-time setup below.

---

## 1. Create a deploy SSH key (on your local machine)

```bash
ssh-keygen -t ed25519 -C "github-deploy" -f deploy_key -N ""
```

This creates two files:
- `deploy_key`      → **private** key (goes into a GitHub secret)
- `deploy_key.pub`  → **public** key (goes onto the server)

## 2. Authorise the key on the server

```bash
ssh root@62.72.57.170 "mkdir -p ~/.ssh && chmod 700 ~/.ssh"
cat deploy_key.pub | ssh root@62.72.57.170 "cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

(Replace `root` with your SSH user if different.)

## 3. Prepare the web root + install rsync/nginx on the server

SSH in (`ssh root@62.72.57.170`) and run:

```bash
apt update
apt install -y nginx rsync          # Debian/Ubuntu (use yum/dnf on CentOS)
mkdir -p /var/www/cmacoachingintamil

cat >/etc/nginx/sites-available/cmacoachingintamil <<'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name cmacoachingintamil.com www.cmacoachingintamil.com;
    root /var/www/cmacoachingintamil;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}
NGINX

ln -sf /etc/nginx/sites-available/cmacoachingintamil /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default      # optional: remove default site
nginx -t && systemctl reload nginx
```

> If your server uses **Apache** or a **control panel**, just point its web root
> at `/var/www/cmacoachingintamil` instead.

## 4. Add the GitHub repository secrets

GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**.
Add these four:

| Name              | Value                                            |
| ----------------- | ------------------------------------------------ |
| `SSH_PRIVATE_KEY` | the **full contents** of the `deploy_key` file   |
| `SSH_HOST`        | `62.72.57.170`                                   |
| `SSH_USER`        | `root` (or your SSH username)                    |
| `DEPLOY_PATH`     | `/var/www/cmacoachingintamil`                    |

## 5. Deploy

Push to `main` (or **Actions → Build & Deploy → Run workflow**). Then open
**http://cmacoachingintamil.com** — the site is live.

## 6. HTTPS (recommended, one time on the server)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d cmacoachingintamil.com -d www.cmacoachingintamil.com
```

Certbot auto-renews. Done.

---

### Notes
- `rsync --delete` keeps the web root an exact mirror of `dist/`, so removed
  files are cleaned up. Make sure `DEPLOY_PATH` is a **dedicated** folder.
- DNS already points the domain to this server (A record → 62.72.57.170), so no
  DNS changes are needed.
- To deploy manually anytime: `npm run build` then
  `rsync -avz --delete dist/ root@62.72.57.170:/var/www/cmacoachingintamil/`.
