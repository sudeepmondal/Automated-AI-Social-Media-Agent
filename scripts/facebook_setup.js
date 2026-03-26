// ============================================================
// FACEBOOK API SETUP HELPER
// ============================================================
// এই script দিয়ে Facebook Page Access Token পাবে
// Browser Console এ run করো (https://developers.facebook.com এ)
// ============================================================

// STEP 1: Meta Developer Console এ login করার পর
// এই URL এ যাও: https://developers.facebook.com/tools/explorer/

const FB_SETUP_GUIDE = `
╔══════════════════════════════════════════════════════════════╗
║          FACEBOOK PAGE ACCESS TOKEN - SETUP GUIDE           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  STEP 1: Meta App তৈরি করো                                  ║
║  ─────────────────────────────────────────────              ║
║  1. https://developers.facebook.com এ যাও                   ║
║  2. "My Apps" > "Create App" click করো                      ║
║  3. "Other" select করো > "Next"                             ║
║  4. "Business" type select করো > "Next"                     ║
║  5. App name দাও (যেকোনো name) > "Create App"               ║
║                                                              ║
║  STEP 2: Facebook Login Product Add করো                     ║
║  ─────────────────────────────────────────────              ║
║  1. Dashboard এ "Add Product" এ যাও                         ║
║  2. "Facebook Login" > "Set Up" click করো                   ║
║  3. "Web" platform select করো                               ║
║  4. Site URL: http://localhost:5678 দাও                     ║
║                                                              ║
║  STEP 3: Page Access Token নাও                              ║
║  ─────────────────────────────────────────────              ║
║  1. https://developers.facebook.com/tools/explorer/ যাও    ║
║  2. আপনার App select করো                                    ║
║  3. "User or Page" dropdown থেকে Page select করো            ║
║  4. Permissions এ add করো:                                  ║
║     ✅ pages_show_list                                       ║
║     ✅ pages_read_engagement                                 ║
║     ✅ pages_manage_posts                                    ║
║     ✅ publish_to_groups (optional)                          ║
║  5. "Generate Access Token" click করো                       ║
║  6. Token copy করো - এটাই PAGE_ACCESS_TOKEN                 ║
║                                                              ║
║  STEP 4: Long-Lived Token নাও (60 দিনের)                    ║
║  ─────────────────────────────────────────────              ║
║  নিচের URL এ যাও (values replace করো):                     ║
╚══════════════════════════════════════════════════════════════╝
`;

console.log(FB_SETUP_GUIDE);

// Long-lived token exchange URL generator
function getLongLivedTokenURL(appId, appSecret, shortToken) {
  return `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken}`;
}

// Page Access Token থেকে Page-specific token পাওয়ার function
async function getPageAccessToken(userAccessToken) {
  console.log("📘 Fetching your Facebook Pages...");
  
  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?access_token=${userAccessToken}`
    );
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      console.log("\n✅ Found", data.data.length, "page(s):\n");
      data.data.forEach((page, index) => {
        console.log(`Page ${index + 1}:`);
        console.log(`  Name: ${page.name}`);
        console.log(`  ID: ${page.id}`);
        console.log(`  Access Token: ${page.access_token.substring(0, 30)}...`);
        console.log(`  Category: ${page.category}`);
        console.log("  ---");
      });
      
      console.log("\n📋 Copy the Page ID and Access Token for the page you want to post to.");
      return data.data;
    } else {
      console.log("❌ No pages found. Make sure you have a Facebook Page.");
      console.log("Error:", JSON.stringify(data));
    }
  } catch (err) {
    console.log("❌ Error:", err.message);
  }
}

// Token validity check করো
async function checkTokenValidity(pageId, accessToken) {
  console.log("🔍 Checking token validity...");
  
  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}?fields=id,name,fan_count&access_token=${accessToken}`
    );
    const data = await response.json();
    
    if (data.id) {
      console.log("✅ Token is VALID!");
      console.log("  Page:", data.name);
      console.log("  Followers:", data.fan_count || "N/A");
    } else {
      console.log("❌ Token is INVALID or EXPIRED");
      console.log("  Error:", JSON.stringify(data.error));
    }
  } catch (err) {
    console.log("❌ Check failed:", err.message);
  }
}

// Test post করো (text only)
async function testTextPost(pageId, accessToken, message = "Test post from AI Agent 🤖 (Please ignore)") {
  console.log("📤 Testing Facebook text post...");
  
  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}/feed`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          access_token: accessToken
        })
      }
    );
    const data = await response.json();
    
    if (data.id) {
      console.log("✅ Test post SUCCESS! Post ID:", data.id);
      console.log("   Delete this test post from your Facebook Page.");
    } else {
      console.log("❌ Test post FAILED");
      console.log("   Error:", JSON.stringify(data.error));
    }
  } catch (err) {
    console.log("❌ Post failed:", err.message);
  }
}

// ============================================================
// HOW TO USE:
// ============================================================
// 1. Browser Console এ এই commands run করো:

// আপনার pages এর list দেখতে:
// getPageAccessToken("YOUR_USER_ACCESS_TOKEN_FROM_EXPLORER")

// Token valid কিনা check করতে:
// checkTokenValidity("YOUR_PAGE_ID", "YOUR_PAGE_ACCESS_TOKEN")

// Test post করতে:
// testTextPost("YOUR_PAGE_ID", "YOUR_PAGE_ACCESS_TOKEN")

console.log("=== USAGE ===");
console.log("getPageAccessToken('YOUR_USER_ACCESS_TOKEN')");
console.log("checkTokenValidity('PAGE_ID', 'PAGE_TOKEN')");
console.log("testTextPost('PAGE_ID', 'PAGE_TOKEN')");