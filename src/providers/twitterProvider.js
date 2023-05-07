export default class TwitterProvider {
    getName() {
        return "Twitter";
    }

    getUrl() {
        return "^https:\\/\\/twitter\\.com";
    }    

    getLogo() {
        return 'src/assets/logo-twitter.svg';
    }

    getSearchSelector() {
        return '[data-testid="SearchBox_Search_Input"]';
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