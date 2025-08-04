You can create and push to GitHub entirely from the command line using the **GitHub CLI** (`gh`):

## GitHub CLI

First, check if you have GitHub CLI installed:

```bash
gh --version
```

If you don't have it, install it:

- **macOS**: `brew install gh`
- **Windows**: Download from [cli.github.com](https://cli.github.com)
- **Linux**: Follow instructions at [cli.github.com](https://cli.github.com)

Once installed, you can create and push your repository in one command:

```bash
# Authenticate first (only needed once)
gh auth login

# Create repository and push (all in one command)
gh repo create the-road-to-next-app --public --source=. --remote=origin --push
```

This command will:

- Create a new repository on GitHub
- Set it as your remote origin
- Push your code immediately
