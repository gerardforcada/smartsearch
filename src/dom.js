import GPT from './gpt.js';

// DOM class manages the interaction with the DOM
export default class DOM {
    // Initialize DOM class with the given provider and set up properties
    constructor(provider) {
        this.provider = provider;
        this.hookModeActive = false;
        this.loader = "src/assets/logo-loader.svg";
        this.openAiLogo = "src/assets/logo-openai.svg";
        this.eventAttribute = 'data-smartsearch-registered';
        this.gpt = new GPT();
    }

    // Register keydown event for search box and logo elements
    registerEvent() {
        const searchBox = this.getSearchDocument();

        if (searchBox) {
            if (!searchBox.getAttribute(this.eventAttribute)) {
                searchBox.addEventListener('keydown', (e) => this.onKeyDown(e));
                searchBox.setAttribute(this.eventAttribute, 'true');
            }
            return;
        }

        setTimeout(() => this.registerEvent(), 1000);
    }

    // Handle keydown events for search box
    async onKeyDown(e) {
        if (this.hookModeActive) {
            if (e.key === 'Enter') {
                this.provider.onEnterPressedWhileOpenAIMode(e);
            }
            this.hookSearch(e);
        } else if (e.key === '?' && e.target.value === '') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            this.enableHookMode();
        }
    }

    // Handle search query when hook mode is active
    async hookSearch(e) {
        if (e.key === 'Enter') {
            this.showLoadingAnimation();
            try {
                const response = await this.gpt.query(e.target.value, this.provider);
                this.provider.pasteContent(e, response.result);
            } catch (error) {
                alert(`[SmartSearch] ${error}`);
            } finally {
                this.disableHookMode();
            }
        } else if (e.key === 'Escape') {
            this.disableHookMode();
        }
    }

    // Get the search box element
    getSearchDocument() {
        return document.querySelector(this.provider.getSearchSelector());
    }

    // Enable hook mode and update the logo
    async enableHookMode() {
        this.hookModeActive = true;
        this.updateLogo(await this.svgToElement(this.openAiLogo));
    }

    // Disable hook mode and restore the original logo
    async disableHookMode() {
        this.hookModeActive = false;
        this.updateLogo(await this.svgToElement(this.provider.getLogo()));
    }

    // Show the loading animation
    async showLoadingAnimation() {
        this.updateLogo(await this.svgToElement(this.loader));
    }

    // Update the logo with the given element
    async updateLogo(newLogoElement) {
        const logo = this.getLogoDocument();
        if (logo) {
            this.replaceContent(logo, newLogoElement);
        }
    }

    // Get the logo element
    getLogoDocument() {
        return document.querySelector(this.provider.getLogoSelector());
    }

    // Convert the SVG path to an element
    async svgToElement(svgPath) {
        const response = await fetch(chrome.runtime.getURL(svgPath));
        const svgText = await response.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svg = svgDoc.querySelector("svg g");
        return svg;
    }

    // Replace content of the parent element with the new child element
    replaceContent(parentElement, newChildElement) {
        parentElement.innerHTML = '';
        parentElement.appendChild(newChildElement);
    }
}