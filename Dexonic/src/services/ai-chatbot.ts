import { AIChatbot } from '@/models';
import { post } from '@/utils/axios';

const aiChatbot = async (message: string): Promise<AIChatbot[]> => {
    try {
        console.log('Sending message to API:', message);
        const data = await post(`/ai-chat/chat`, { query: message });
        console.log('API response data: ', data);

        if (Array.isArray(data)) {
            return data.map((item: AIChatbot) => ({
                query: item.query,
                reply: item.reply,
            }));
        } else if (typeof data === 'string') {
            return [{ query: message, reply: data }];
        } else {
            console.error('Unexpected API response format:', data);
            return [];
        }
    } catch (error) {
        console.error('Error in aiChatbot function:', error);
        return [];
    }
};

export { aiChatbot };
