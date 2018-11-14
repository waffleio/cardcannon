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

1. Clone this repo locally.
2. [Create](https://github.com/settings/apps) a new GitHub App.
3. Add the generated *.pem file to the root of this project.
4. Create a smee.io webhook proxy for debugging.
5. Create a `.env` file in the root of this project, updated with values for your GitHub App:
```
APP_ID=<your app id>
WEBHOOK_SECRET=<your app secret>
WEBHOOK_PROXY_URL=<your smee.io url>
```
6. Run `npm install`.
7. Run `nodemon` to start app.
8. Install the GitHub App in the desired repo from https://github.com/settings/apps/your-app-name/installations.
9. create a new issue titled `bootstrap my board`.

### Production
1. Upload source code to Glitch.
2. Create a `.data/private-key.pem` file, updated with the contents of your local *.pem file.
3. Create a `.env` file in the root of this project, updated with values for your GitHub App:
```
APP_ID=<your app id>
WEBHOOK_SECRET=<your app secret>
PRIVATE_KEY_PATH=.data/private-key.pem
NODE_ENV=production
```
4. Install the GitHub App in the desired repo from https://github.com/settings/apps/your-app-name/installations.
5. Create a new issue titled `bootstrap my board`.

## Resources

https://github.com/octokit/rest.js
https://probot.github.io/docs/
http://help-center.glitch.me/help/ 

## Contributing

If you have suggestions for how this project could be improved, or want to report a bug, open an issue!  Or pull request! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2018 Waffle.io <team@waffle.io> (www.waffle.io)