import GmailProvider from "./providers/gmailProvider";
import GoogleProvider from "./providers/googleProvider";
import TwitterProvider from "./providers/twitterProvider";

// ProviderDetector class is used to identify which provider matches the current URL
export default class ProviderDetector {
    constructor() {
        this.providers = [TwitterProvider, GoogleProvider, GmailProvider];
    }

    // Find a matching provider for the given URL
    findMatchingProvider(url) {
        for (const Provider of this.providers) {
            const instance = new Provider();
            const regex = new RegExp(instance.getUrl());
            if (regex.test(url)) {
                return instance;
            }
        }

        return null;
    }

    // Get the matching provider for the current URL
    getProviderForCurrentUrl() {
        const matchingProvider = this.findMatchingProvider(window.location.href);

        if (matchingProvider) {
            return matchingProvider;
        }

        console.log('No provider detected for the current URL: ' + window.location.href);
    }

    // Check if the given URL matches any of the available providers
    urlMatchesProvider(url) {
        return this.findMatchingProvider(url) !== null;
    }
}
