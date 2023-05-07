# SmartSearch

## Description

Chrome extension to transform natural language queries into advanced search queries.


<p align="center">
<img src="https://user-images.githubusercontent.com/19436470/236651934-c13e1a0f-30f0-42cc-baf2-534f89e4c983.gif" alt="google_AdobeExpress" width="600">
</p>

Currently supports:
- Google
- Gmail
- Twitter

## Plugin configuration

1. Install the extension

2. Go to the extension options

3. Configure the OpenAI API key

### Plugin usage

1. Press `?` in the search bar to enable the OpenAI mode

2. Write your query in natural language

3. Press `Enter` to convert the query into an advanced search query

To exit the OpenAI mode while writting, press `Esc`.

----------------

### Installation (for development)

1. Clone the repository

2. Install dependencies
```
npm install
```

3. Build the extension
```
npm run build
# or npm run watch to build on file changes
```

2. Go to `chrome://extensions/` in your browser

3. Enable developer mode

4. Click on "Load unpacked extension"

5. Select the repository folder

----------------

## Adding new providers

1. Create a new file in `src/providers/` with the following structure:
```js
export default class YourProvider {
    getName() {
        return "The provider name. It will be used to tell OpenAI for which provider the query is intended";
    }

    getUrl() {
        return "A regex pattern to match the provider url";
    }

    getLogo() {
        return 'The path of the provider logo: the image shown in the search bar';
    }

    getSearchSelector() {
        return 'The query selector to find the search bar in the website';
    }

    getLogoSelector() {
        return 'The query selector to find the provider logo in the website';
    }

    onEnterPressedWhileOpenAIMode(e) {
        // Stop the propagation of the original event. Usually, this would work:
        // e.preventDefault();
        // e.stopPropagation();
        // But it may change depending on the provider.
    }

    pasteContent(e, result) {
        // The actions to perform to paste the result in the search bar.
        // Some providers may require to dispatch events to simulate user input.
    }
}
```

2. Register the provider in `src/providerDetector.js`:
```js
import YourProvider from './providers/YourProvider';

export default class ProviderDetector {

    constructor() {
        this.providers = [..., YourProvider];
    }

    ...
}
```

3. Add the provider logo in `src/assets/`

4. Add the provider url to the `manifest.json` so the plugin can be loaded in the provider website:
```json
"content_scripts": [
    {
        "matches": [
            "https://twitter.com/*",
            "https://*.google.com/*",
            "https://*.yourprovider.com/*"
        ],
        "js": ["dist/contentScript.bundle.js"],
        "css": ["style.css"]
    }
],
```
