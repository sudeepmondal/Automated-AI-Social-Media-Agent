// ============================================================
// AI SOCIAL AGENT - API TEST SCRIPT
// ============================================================
// Run this in browser console OR Node.js to test all APIs
// before importing into n8n
// ============================================================

// -------- CONFIG (আপনার values দিন) --------
const CONFIG = {
  OPENROUTER_API_KEY: "sk-or-v1-YOUR_KEY_HERE",
  FB_PAGE_ID: "YOUR_PAGE_ID",
  FB_PAGE_ACCESS_TOKEN: "YOUR_ACCESS_TOKEN",
};

// ============================================================
// TEST 1: OpenRouter LLM API
// ============================================================
async function testOpenRouter() {
  console.log("\n🧠 Testing OpenRouter API...");
  
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CONFIG.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://localhost:5678",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [
          {
            role: "user",
            content: 'Say "OpenRouter API working!" in JSON format: {"status": "working", "message": "..."}'
          }
        ],
        max_tokens: 100
      })
    });
    
    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      console.log("✅ OpenRouter API: WORKING");
      console.log("   Response:", data.choices[0].message.content);
    } else {
      console.log("❌ OpenRouter API: FAILED");
      console.log("   Error:", JSON.stringify(data));
    }
  } catch (err) {
    console.log("❌ OpenRouter API: ERROR -", err.message);
  }
}

// ============================================================
// TEST 2: Pollinations.ai Image Generation (FREE - No API Key)
// ============================================================
async function testPollinations() {
  console.log("\n🎨 Testing Pollinations.ai Image API...");
  
  const testPrompt = "A beautiful sunrise over mountains, cinematic, ultra HD";
  const encodedPrompt = encodeURIComponent(testPrompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&model=flux&nologo=true&seed=12345`;
  
  console.log("   Image URL:", imageUrl);
  
  try {
    const response = await fetch(imageUrl);
    
    if (response.ok && response.headers.get("content-type")?.includes("image")) {
      console.log("✅ Pollinations.ai: WORKING");
      console.log("   Image size:", response.headers.get("content-length"), "bytes");
      console.log("   Content type:", response.headers.get("content-type"));
    } else {
      console.log("⚠️  Pollinations.ai: Response received but check manually");
      console.log("   Status:", response.status);
      // Still might work - open the URL in browser to check
      console.log("   Test URL (open in browser):", imageUrl);
    }
  } catch (err) {
    console.log("❌ Pollinations.ai: ERROR -", err.message);
    console.log("   Try opening this URL in browser:", imageUrl);
  }
}

// ============================================================
// TEST 3: Facebook Page API
// ============================================================
async function testFacebook() {
  console.log("\n📘 Testing Facebook API...");
  
  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${CONFIG.FB_PAGE_ID}?fields=id,name&access_token=${CONFIG.FB_PAGE_ACCESS_TOKEN}`
    );
    
    const data = await response.json();
    
    if (data.id) {
      console.log("✅ Facebook API: WORKING");
      console.log("   Page Name:", data.name);
      console.log("   Page ID:", data.id);
    } else {
      console.log("❌ Facebook API: FAILED");
      console.log("   Error:", JSON.stringify(data.error));
    }
  } catch (err) {
    console.log("❌ Facebook API: ERROR -", err.message);
  }
}

// ============================================================
// TEST 4: Full Pipeline Simulation (Dry Run)
// ============================================================
async function testFullPipeline() {
  console.log("\n🚀 Testing Full Pipeline (Dry Run - No Facebook post)...");
  
  // Step 1: Generate content idea
  console.log("\n  Step 1: Generating content idea...");
  let contentIdea = "Transform your morning routine for maximum productivity";
  
  try {
    const ideaResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CONFIG.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://localhost:5678",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [{
          role: "user",
          content: 'Generate a viral social media post idea. Niche: motivation. Respond ONLY in JSON: {"idea": "...", "theme": "...", "mood": "..."}'
        }],
        max_tokens: 200
      })
    });
    const ideaData = await ideaResponse.json();
    const rawContent = ideaData.choices[0].message.content;
    const cleaned = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    contentIdea = parsed.idea;
    console.log("  ✅ Content Idea:", contentIdea);
  } catch (e) {
    console.log("  ⚠️  Using default idea:", contentIdea);
  }
  
  // Step 2: Build image URL
  console.log("\n  Step 2: Building image URL...");
  const imagePrompt = `${contentIdea}, cinematic style, ultra HD, dramatic lighting, vibrant colors, no text`;
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1080&height=1080&model=flux&nologo=true&seed=${Date.now()}`;
  console.log("  ✅ Image URL built (open to verify):", imageUrl.substring(0, 80) + "...");
  
  // Step 3: Generate caption
  console.log("\n  Step 3: Generating caption...");
  let caption = "Default caption with hashtags";
  try {
    const captionResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CONFIG.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://localhost:5678",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [{
          role: "user",
          content: `Write a Facebook caption for: "${contentIdea}". Include emojis and 8 hashtags. Respond ONLY in JSON: {"caption": "..."}`
        }],
        max_tokens: 400
      })
    });
    const capData = await captionResponse.json();
    const rawCap = capData.choices[0].message.content;
    const cleanedCap = rawCap.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsedCap = JSON.parse(cleanedCap);
    caption = parsedCap.caption;
    console.log("  ✅ Caption generated:", caption.substring(0, 100) + "...");
  } catch (e) {
    console.log("  ⚠️  Caption generation failed");
  }
  
  console.log("\n✅ PIPELINE TEST COMPLETE!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Content Idea:", contentIdea);
  console.log("Image URL:", imageUrl.substring(0, 80) + "...");
  console.log("Caption Preview:", caption.substring(0, 150) + "...");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

// ============================================================
// RUN ALL TESTS
// ============================================================
async function runAllTests() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   AI SOCIAL AGENT - API TEST SUITE       ║");
  console.log("╚══════════════════════════════════════════╝");
  
  await testOpenRouter();
  await testPollinations();
  await testFacebook();
  await testFullPipeline();
  
  console.log("\n\n✅ All tests completed!");
  console.log("If all tests passed, import the workflow to n8n.");
}

// Browser এ run করতে: runAllTests()
// Node.js এ run করতে: node test_apis.js
runAllTests();