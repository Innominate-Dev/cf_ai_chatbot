// Durable Object class for chat memory 

export class ChatObject {
  constructor(controller, env) {
    this.storage = controller.storage;
    this.env = env;
  }

  async fetch(request) {
    const { prompt } = await request.json();
    let messages = (await this.storage.get("messages")) || [];
    messages.push({ role: "user", content: prompt });

    const response = await this.env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      { messages: messages }
    );
    const aiResponse = response.response;

    messages.push({ role: "assistant", content: aiResponse });
    await this.storage.put("messages", messages);

    return new Response(JSON.stringify({ response: aiResponse }));
  }
}

/* Main Worker fetches the Durable Object and forwards requests 
it also generates new cookies for new users so that its not stored as one chat for every person
and people can still refer back to the chat even if they refresh the page
*/

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Only handle POST requests to the /chat endpoint
    if (request.method === "POST" && url.pathname === "/chat") {
      let userId = request.headers.get("cookie")
        ?.split(';')
        .find(c => c.trim().startsWith("user-id="))
        ?.split('=')[1];
      
      let responseHeaders = {};

      // If no user ID is found, generate a new one
      if (!userId) {
        // Create a new unique ID for this anonymous user
        userId = crypto.randomUUID();
        responseHeaders['Set-Cookie'] = `user-id=${userId}; Path=/; HttpOnly; SameSite=Lax`;
      }

      // Route the request to the correct Durable Object instance for this user
      const id = env.CHAT_OBJECT.idFromName(userId);
      const stub = env.CHAT_OBJECT.get(id);

      const doResponse = await stub.fetch(request);
      const response = new Response(doResponse.body, doResponse);
      
      // Add the Set-Cookie header if it was generated
      if (responseHeaders['Set-Cookie']) {
        response.headers.append('Set-Cookie', responseHeaders['Set-Cookie']);
      }
      
      return response;
    }
    
    // For all other requests, serve files from the `public` directory.
    return env.ASSETS.fetch(request);
  },
};
