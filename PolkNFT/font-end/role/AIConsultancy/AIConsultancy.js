const axios = require("axios")

function AIConsultancy(prompt) {
    const options = {
        method: "POST",
        url: "https://api.edenai.run/v2/text/chat",
        headers: {
            authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY_AI}`,
        },
        data: {
            providers: "openai",
            text: prompt,
            chatbot_global_action: "Act as an assistant",
            previous_history: [],
            temperature: 0.0,
            max_tokens: 150,
            fallback_providers: "",
        },
    };

    return axios
        .request(options)
        .then((response) => {
            console.log(response);
            const consultancy = response.data?.openai?.message?.[1].message;
            return consultancy;
        })
        .catch((error) => {
            console.log(error);
        });
}

export default AIConsultancy;