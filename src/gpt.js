export default class GPT {
    constructor() {
        this.running = false;
    }

    // Query GPT-3 with input and provider settings
    async query(input, provider) {
        if (!this.running) {
            this.running = true;

            const data = await this.getStorageData();

            if (!data.apiToken) {
                this.running = false;
                throw new Error("API token not set in plugin settings");
            }

            try {
                const messages = this.createMessages(input, provider, data.userPrompts);
                const requestBody = this.buildRequestBody(messages, data);
                const response = await this.fetchGPTResponse(requestBody, data.apiToken);

                this.running = false;
                return {result: response.choices[0].message.content.trim()};
            } catch (error) {
                this.running = false;
                throw new Error('Error fetching GPT-3 response');
            }
        }
    }

    // Get storage data
    getStorageData() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['apiToken', 'model', 'maxTokens', 'temperature', 'userPrompts'], (data) => {
                resolve(data);
            });
        });
    }

    // Create messages by processing user prompts and replacing variables with collected data
    createMessages(input, provider, userPrompts) {
        const providerName = provider.getName();
        const messages = userPrompts.map((prompt) => {
            const content = prompt.content.replace(/\{\{input\}\}/g, input).replace(/\{\{providerName\}\}/g, providerName);
            return {role: prompt.role, content: content};
        });
        return messages;
    }

    // Build request body for GPT-3 query
    buildRequestBody(messages, data) {
        return JSON.stringify({
            max_tokens: parseInt(data.maxTokens, 10),
            n: 1,
            stop: null,
            temperature: parseFloat(data.temperature, 10),
            model: data.model,
            messages: messages
        });
    }

    // Fetch GPT-3 response
    async fetchGPTResponse(requestBody, apiToken) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            },
            body: requestBody
        });

        return response.json();
    }
}
