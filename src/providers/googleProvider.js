export default class GoogleProvider {
    getName() {
        return "Google";
    }

    getUrl() {
        return "^https:\\/\\/(www\\.)?google\\.";
    }

    getLogo() {
        return 'src/assets/logo-google.svg';
    }

    getSearchSelector() {
        return 'textarea[type="search"]';
    }

    getLogoSelector() {
        return 'form[role="search"] svg';
    }

    onEnterPressedWhileOpenAIMode(e) {
        e.preventDefault();
		e.stopPropagation();
    }

    pasteContent(e, result) {
        e.target.value = result;
        e.target.dispatchEvent(new Event('input', { bubbles: true }));
        e.target.dispatchEvent(new Event('change', { bubbles: true }));
    }
}