class ChatbotService {
  async chat(message) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in ChatbotService:", error);
      throw error;
    }
  }
}

// Export 1 instance của class
const chatbotService = new ChatbotService();
export default chatbotService;
