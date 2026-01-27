# Push to GitHub Instructions

After creating your GitHub repository, run these commands:

```bash
cd finance-manager

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/finance-manager.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Alternative: Using SSH

If you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/finance-manager.git
git branch -M main
git push -u origin main
```

## Verify

After pushing, visit:
https://github.com/YOUR_USERNAME/finance-manager

You should see all your code there!
