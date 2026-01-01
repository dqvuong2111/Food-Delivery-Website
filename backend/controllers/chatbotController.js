import { Mistral } from "@mistralai/mistralai";
import foodModel from "../models/foodModel.js";

const mistral = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY,
});

const chat = async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message) {
            return res.json({ success: false, message: "Message is required" });
        }

        if (!process.env.MISTRAL_API_KEY) {
            return res.json({ success: false, message: "AI service not configured. Please add MISTRAL_API_KEY to .env" });
        }

        // Fetch current menu data for context  
        // Include items that are available OR don't have the available field set
        const foods = await foodModel.find({
            $or: [
                { available: true },
                { available: { $exists: false } }
            ]
        });

        console.log(`[Chatbot] Found ${foods.length} available items:`, foods.map(f => f.name));

        // Build menu context
        const categories = [...new Set(foods.map(f => f.category))];
        const menuContext = foods.map(f =>
            `• ${f.name}: ${f.description}. Price: ${f.price.toLocaleString()} ₫. Category: ${f.category}`
        ).join('\n');

        console.log(`[Chatbot] Menu context:\n${menuContext}`);

        const systemPrompt = `You are a friendly and helpful AI assistant for "BKFood" food delivery restaurant. Your job is to help customers with their questions about our menu, orders, and services.

RESTAURANT INFORMATION:
- Name: BKFood - Delicious Meals Delivered
- Location: Hanoi, Vietnam
- We offer online ordering and delivery within Hanoi only
- Operating hours: Check with the store
- Delivery fee and time may vary

AVAILABLE MENU CATEGORIES:
${categories.join(', ')}

TOTAL AVAILABLE ITEMS: ${foods.length}

CURRENT MENU ITEMS (ALL ${foods.length} ITEMS):
${menuContext}

RESPONSE FORMAT RULES:
1. When listing menu items or dishes, use NUMBERED LIST format:
   1. **Dish Name** - Description. Price: $X
   2. **Dish Name** - Description. Price: $X
   
2. When giving instructions or step-by-step guides, use DASH format:
   - Step 1: Do this
   - Step 2: Do that
   
3. Use bold (**text**) for item names and prices
4. Keep responses concise and easy to read

CRITICAL GUIDELINES:
- Be friendly, concise, and helpful
- When asked about menu items or "what food do you have", LIST ALL ${foods.length} ITEMS using numbered format - do not skip any items
- Always provide accurate prices and descriptions exactly as shown above
- If asked about items not on the menu, politely say we don't have that item
- For order issues or complaints, be empathetic and suggest contacting support
- Don't make up information about items not listed
- Use a warm, conversational tone

COMMON QUESTIONS YOU CAN HELP WITH:
- Menu items, prices, and descriptions
- Food categories and recommendations  
- General restaurant information
- How to place an order
- Delivery information (Hanoi only)`;

        // Build messages array for Mistral
        const messages = [
            { role: "system", content: systemPrompt },
            ...history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            })),
            { role: "user", content: message }
        ];

        const response = await mistral.chat.complete({
            model: "mistral-large-latest",
            messages: messages,
        });

        const responseText = response.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

        res.json({
            success: true,
            message: responseText
        });

    } catch (error) {
        console.error("Chatbot error:", error.message);
        console.error("Full error:", error);
        res.json({
            success: false,
            message: error.message || "Sorry, I'm having trouble responding right now. Please try again."
        });
    }
};

export { chat };
