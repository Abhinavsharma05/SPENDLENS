export const tools = {
  cursor: {
    name: "Cursor",
    plans: [
      { id: "hobby", name: "Hobby", defaultPrice: 0 },
      { id: "pro", name: "Pro", defaultPrice: 20 },
      { id: "business", name: "Business", defaultPrice: 40 }
    ]
  },
  github_copilot: {
    name: "GitHub Copilot",
    plans: [
      { id: "individual", name: "Individual", defaultPrice: 10 },
      { id: "business", name: "Business", defaultPrice: 19 },
      { id: "enterprise", name: "Enterprise", defaultPrice: 39 }
    ]
  },
  claude: {
    name: "Claude",
    plans: [
      { id: "free", name: "Free", defaultPrice: 0 },
      { id: "pro", name: "Pro", defaultPrice: 20 },
      { id: "team", name: "Team", defaultPrice: 30 }
    ]
  },
  chatgpt: {
    name: "ChatGPT",
    plans: [
      { id: "free", name: "Free", defaultPrice: 0 },
      { id: "plus", name: "Plus", defaultPrice: 20 },
      { id: "team", name: "Team", defaultPrice: 30 },
      { id: "enterprise", name: "Enterprise", defaultPrice: 60 }
    ]
  },
  anthropic_api: {
    name: "Anthropic API",
    plans: [
      { id: "payg", name: "Pay-as-you-go", defaultPrice: 0 }
    ]
  },
  openai_api: {
    name: "OpenAI API",
    plans: [
      { id: "payg", name: "Pay-as-you-go", defaultPrice: 0 }
    ]
  },
  gemini: {
    name: "Gemini",
    plans: [
      { id: "free", name: "Free", defaultPrice: 0 },
      { id: "advanced", name: "Advanced", defaultPrice: 20 }
    ]
  },
  v0: {
    name: "v0 (Vercel)",
    plans: [
      { id: "free", name: "Free", defaultPrice: 0 },
      { id: "premium", name: "Premium", defaultPrice: 20 }
    ]
  }
};
