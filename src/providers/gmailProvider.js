export default class GmailProvider {
    getName() {
        return "Gmail";
    }

    getUrl() {
        return "^https:\\/\\/(mail\\.)?google\\.";
    }

    getLogo() {
        return 'src/assets/logo-google.svg';
    }

    getSearchSelector() {
        return 'input[name="q"]';
    }

    getLogoSelector() {
        return 'form[role="search"] button:last-of-type svg';
    }

    onEnterPressedWhileOpenAIMode(e) {
        e.stopImmediatePropagation(); 
    }

    pasteContent(e, result) {
        e.target.value = result;
        e.target.dispatchEvent(new Event('change', { bubbles: true }));
    }
}