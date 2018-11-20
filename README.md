# 🗂 Wafffle.io Card Cannon
A GitHub App for bootstrapping a Waffle.io board with issues.

Useful for educators to easily create Waffle.io boards prepopulated with cards, labels, epics, and dependencies for curriculum.

## How It Works

The GitHub App listens for `issue.opened` webhook events and creates new issues based on the [/cards/...](./cards/) config directory of this project.

## Usage

1. Ensure the Card Cannon app is running.  See [Installation](#Installation) below.
2. Create a new GitHub repo if needed.
3. Create a new Waffle.io project and board if needed.
4. Install the GitHub App in the desired repo from https://github.com/settings/apps/your-app-name/installations.

5. From your Waffle.io board, create a new issue titled `bootstrap my board`.

## Examples

Example of running on a Waffle.io board
![GitHub Logo](./docs/demo.gif)

## Installation

### Locally

1. Clone this repo locally.  Updated card contents in [/cards/...](./cards/) as desired.
2. [Create](https://github.com/settings/apps) a new GitHub App with the following settings:
* GitHub App Name - give your app a name
* Homepage URL - set to your project's repo, your website, etc
* Webhook URL - create a webhook url for development at smee.io; add it here
* Permissions - Issues - Read & Write
* User Permissions - No Access
* Subscribe to Events - Issues (must set Permissions above before this option will be available)
* Where can this GitHub App be installed? - set based on your preference
3. After creating the GitHub App, select the Generate A Private Key option and download the generated *.pem file to the root of this project.
4. Create a `.env` file in the root of this project, updated with values for your GitHub App:
```
APP_ID=<your app id>
WEBHOOK_PROXY_URL=<your smee.io url>
```
5. Run `npm install`.
6. Run `nodemon` to start app.
7. Install the GitHub App in the desired repo from https://github.com/settings/apps/your-app-name/installations.
8. create a new issue titled `bootstrap my board`.

### Production
1. Fork this repo.  Updated card contents in [/cards/...](./cards/) as desired.
1. Created a GitHub App if not already created (see above).
2. Create a new [Glitch}(https://glitch.com/) project using the [clone from repo option](https://medium.com/glitch/import-code-from-anywhere-83fb60ea4875) to clone this repo or your forked repo on GitHub. Glitch provides free hosting for projects with low usage (max 4000 web requests per hour).
3. Create a `.data/private-key.pem` file, updated with the contents of your local *.pem file.
4. Create a `.env` file in the root of this project, updated with values for your GitHub App:
```
APP_ID=<your app id>
PRIVATE_KEY_PATH=.data/private-key.pem
NODE_ENV=production
```
5. Install the GitHub App in the desired repo from https://github.com/settings/apps/your-app-name/installations.
6. Create a new issue titled `bootstrap my board`.

## Resources

https://github.com/octokit/rest.js
https://probot.github.io/docs/
http://help-center.glitch.me/help/ 


## Contributing

If you have suggestions for how this project could be improved, or want to report a bug, open an issue!  Or pull request! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2018 Waffle.io <team@waffle.io> (www.waffle.io)