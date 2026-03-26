# 🤖 AI Social Media Agent
### Fully Automated Daily Facebook Post Generator using n8n + Free AI APIs

![Workflow](https://img.shields.io/badge/n8n-Workflow-orange?style=for-the-badge&logo=n8n)
![AI](https://img.shields.io/badge/Groq-LLM-00A67E?style=for-the-badge)
![Facebook](https://img.shields.io/badge/Facebook-Graph_API-1877F2?style=for-the-badge&logo=facebook)
![Free](https://img.shields.io/badge/Cost-100%25_FREE-brightgreen?style=for-the-badge)

---

## 📌 Overview

**AI Social Media Agent** is a fully automated workflow built with **n8n** that generates and posts unique AI-created content to Facebook **every day — without any human intervention.**

Every 24 hours, the agent:
- 🧠 Generates a **unique viral content idea** using Groq LLM
- ✍️ Writes an **engaging caption** with emojis and trending hashtags
- 🖼️ Fetches a **relevant image** automatically
- 📘 **Posts everything to Facebook** via Meta Graph API
- 📝 **Logs the result** for tracking

> Built entirely with **free tools** — no paid APIs required.

---

## 🎬 Demo

```
⏰ 10:00 AM Daily
      ↓
🧠 Groq AI generates: idea + caption + image prompt
      ↓
🖼️  Image fetched automatically
      ↓
📘 Posted to Facebook Page
      ↓
✅ Logged with post ID + timestamp
```

**Sample Output:**
> 🤯 Ever learn something new and suddenly see it *everywhere*?!
> That's the Baader-Meinhof Phenomenon — and algorithms make it stronger!
> #Mindset #TechFacts #Psychology #GrowthMindset ...

---

## 🛠️ Tech Stack

| Tool | Purpose | Cost |
|------|---------|------|
| [n8n Desktop](https://n8n.io) | Workflow automation engine | FREE |
| [Groq API](https://console.groq.com) | LLM — content & caption generation | FREE (14,400 req/day) |
| [Picsum Photos](https://picsum.photos) | Random high-quality images | FREE |
| [Meta Graph API](https://developers.facebook.com) | Facebook Page posting | FREE |

---

## 🔄 Workflow Architecture

```
┌─────────────────────────────────────────────────────┐
│                  n8n Workflow                        │
│                                                      │
│  ⏰ Schedule      → Runs daily at 10:00 AM           │
│       ↓                                              │
│  🧠 Groq LLM     → Generates idea + caption         │
│       ↓                                              │
│  ⚙️  Parse Node  → Extracts JSON + builds image URL │
│       ↓                                              │
│  📘 Facebook API → Posts photo + caption            │
│       ↓                                              │
│  ✅ Log Result   → Saves post ID + status           │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Windows / Mac / Linux PC
- [Node.js](https://nodejs.org) (v18+)
- Facebook Page (personal or business)
- Internet connection

---

### Step 1 — Install n8n

```bash
npm install n8n -g
n8n start
```

Then open: **http://localhost:5678**

Or download **n8n Desktop App** from https://n8n.io/get-started

---

### Step 2 — Get Free API Keys

#### 🟢 Groq API Key (FREE — 14,400 requests/day)
1. Go to https://console.groq.com
2. Sign Up → API Keys → **Create API Key**
3. Copy: `gsk_xxxxxxxxxxxxxxxxxxxx`

#### 🔵 Facebook Page Access Token
1. Go to https://developers.facebook.com
2. Create App → **Other** → **Business**
3. Add Product → **Facebook Login**
4. Go to https://developers.facebook.com/tools/explorer/
5. Select your App → **Get Page Access Token**
6. Add permissions:
   - ✅ `pages_show_list`
   - ✅ `pages_read_engagement`
   - ✅ `pages_manage_posts`
7. Click **Generate Access Token** → Copy token

---

### Step 3 — Import Workflow

1. Open n8n → **http://localhost:5678**
2. Click **"Workflows"** → **"Add Workflow"**
3. Click **"⋯"** (three dots) → **"Import from File"**
4. Select `n8n-workflows/simple_workflow.json`
5. Click **Import**

---

### Step 4 — Configure API Keys

Open **"🧠 Generate All Content (LLM)"** node:

```
Header: Authorization → Bearer YOUR_GROQ_API_KEY
```

Open **"📘 Post to Facebook"** node → Form-Data:

```
access_token → YOUR_FB_PAGE_ACCESS_TOKEN
```

Update Page ID in URL:
```
https://graph.facebook.com/v19.0/YOUR_PAGE_ID/photos
```

---

### Step 5 — Activate

1. Click **"Execute Workflow"** to test manually
2. Check your Facebook Page — new post should appear ✅
3. Toggle **"Active"** switch ON in top-right
4. Done! Posts automatically every day at 10 AM 🎉

---

## 📁 Project Structure

```
ai-social-agent/
├── n8n-workflows/
│   ├── simple_workflow.json          # ← START HERE (beginner friendly)
│   └── ai_social_agent_workflow.json # Full version with Google Sheets logging
├── scripts/
│   ├── test_apis.js                  # Test all APIs before importing
│   └── facebook_setup.js            # Facebook token setup helper
├── docs/
│   ├── SETUP_GUIDE.md               # Detailed step-by-step guide
│   └── CHEATSHEET.md                # Quick reference
├── .env.example                     # Environment variables template
└── README.md                        # This file
```

---

## ⚙️ Configuration

### Change Posting Time

Open **"⏰ Daily Trigger"** node → Update Cron Expression:

| Time | Cron |
|------|------|
| 9:00 AM | `0 9 * * *` |
| 10:00 AM | `0 10 * * *` |
| 12:00 PM | `0 12 * * *` |
| 8:00 PM | `0 20 * * *` |

### Change Content Niche

In **"🧠 Generate All Content (LLM)"** node, update the prompt:

```
Niche: motivation, technology, mindset, facts
```

Change to your preferred niche:
```
Niche: fitness, health, nutrition, workout tips
Niche: business, entrepreneurship, startups
Niche: travel, photography, adventure
Niche: cooking, recipes, food culture
```

---

## 🔧 Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `404 No endpoints found` | Wrong model name | Use `llama-3.3-70b-versatile` |
| `429 Rate limit exceeded` | Too many test runs | Wait 1 hour or create new account |
| `400 Invalid image URL` | URL too long | Reduce prompt to under 60 chars |
| `190 Invalid Token` | FB token expired | Generate new token from Graph Explorer |
| `324 Missing image` | Image URL not accessible | Use direct image URL |
| `405 Method not allowed` | Wrong HTTP method | Set method to `POST` |

---

## 📊 Free API Limits

| Service | Daily Free Limit | Notes |
|---------|-----------------|-------|
| Groq | 14,400 requests | More than enough for daily posts |
| Picsum Photos | Unlimited | No account needed |
| Meta Graph API | 200 calls/hour | Unlimited for basic posting |

---

## 🗺️ Roadmap

- [ ] Instagram auto-posting support
- [ ] AI image generation (when free API is stable)
- [ ] Multiple niche rotation
- [ ] Google Sheets logging integration
- [ ] Telegram error notifications
- [ ] Content history to avoid repetition
- [ ] Multi-language caption support

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 🙏 Acknowledgements

- [n8n](https://n8n.io) — Powerful open-source workflow automation
- [Groq](https://groq.com) — Ultra-fast free LLM inference
- [Meta for Developers](https://developers.facebook.com) — Facebook Graph API
- [Picsum Photos](https://picsum.photos) — Beautiful free stock photos

---

## 📬 Connect

If this project helped you, please ⭐ **star the repository!**

Made with ❤️ using n8n + Groq + Facebook API

---

> ⚠️ **Note:** Keep n8n Desktop App running (minimized) for automatic daily posts. Facebook Page Access Token expires every 60 days — regenerate when needed.