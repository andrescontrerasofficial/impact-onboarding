# The Impact Team — Whop Onboarding App Setup Guide

This guide walks you through every single step to get your onboarding app live on Whop. Follow it in order.

---

## PART 1: Install the Tools You Need

### Step 1: Install Node.js
1. Go to **https://nodejs.org**
2. Download the **LTS** version (the green button)
3. Run the installer and click through all the defaults
4. To verify it worked, open your **Terminal** (Mac) or **Command Prompt** (Windows) and type:
```
node --version
```
You should see something like `v20.x.x`

### Step 2: Install pnpm (faster package manager)
In your Terminal, run:
```
npm install -g pnpm
```

### Step 3: Make Sure You Have VSCode
You said you already have it — great. If not, download it from **https://code.visualstudio.com**

---

## PART 2: Create Your Whop App

### Step 1: Go to the Whop Developer Dashboard
1. Go to **https://whop.com/dashboard**
2. Click on your company/org
3. Go to the **Developer** section in the sidebar
4. Click **Create App** and name it something like `Impact Team Onboarding`

### Step 2: Get Your Credentials
Once the app is created, you'll see an **Environment Variables** section. You need:
- `WHOP_API_KEY` — click reveal and copy it
- `WHOP_APP_ID` — this is your app ID (starts with `app_`)
- `WHOP_AGENT_USER_ID` — your agent user ID (starts with `user_`)

Save all three somewhere safe — you'll need them in a minute.

### Step 3: Configure App Settings
In your app's settings page:
- Set **Base URL** to `https://your-app-name.vercel.app` (you'll update this after deploying)
- Set **App Path** to `/experiences/[experienceId]`
- Set **Dashboard Path** to `/dashboard/[companyId]`

---

## PART 3: Set Up GoHighLevel Inbound Webhook

This is how the app will send lead data + their selected avatar/bucket to your CRM.

### Step 1: Create a GHL Workflow
1. In GoHighLevel, go to **Automation** → **Workflows**
2. Click **Create Workflow** → **Start from Scratch**
3. Name it `Whop Onboarding Lead Tagger`

### Step 2: Add an Inbound Webhook Trigger
1. Click **Add New Trigger**
2. Search for **Inbound Webhook**
3. Click it — GHL will generate a unique **Webhook URL**
4. **Copy this URL** — you'll need it for your `.env.local` file

### Step 3: Build the Workflow Logic
After the webhook trigger, add these steps:

**Step A: Create/Update Contact**
- Action: **Create/Update Contact**
- Map the fields from the webhook data:
  - First Name → `{{first_name}}`
  - Last Name → `{{last_name}}`  
  - Email → `{{email}}`
  - Full Name → `{{name}}`

**Step B: Add Tag based on bucket**
- Action: **If/Else** condition
- If `{{bucket}}` equals `new_to_workforce` → Add Tag: `Onboarding - New to Workforce`
- Else if `{{bucket}}` equals `career_switcher` → Add Tag: `Onboarding - Career Switcher`  
- Else if `{{bucket}}` equals `already_in_sales` → Add Tag: `Onboarding - Already in Sales`

For the Career Switcher and Already in Sales branches, also add:
- Action: **Add Tag** → `High Priority Lead`

This way your sales team knows who to reach out to.

### Step 4: Publish the Workflow
Click **Publish** (toggle it on) so it's live.

---

## PART 4: Set Up the Code Project

### Step 1: Open Terminal in VSCode
1. Open VSCode
2. Press `` Ctrl+` `` (backtick) to open the built-in terminal
3. Navigate to where you want the project. For example:
```bash
cd ~/Desktop
```

### Step 2: Create the Next.js Project
Run this command:
```bash
pnpm create next-app impact-onboarding --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```
When it asks questions, accept the defaults.

### Step 3: Go into the project folder
```bash
cd impact-onboarding
```

### Step 4: Install the Whop packages
```bash
pnpm add @whop/api @whop/iframe @whop-apps/dev-proxy
```

### Step 5: Create your .env.local file
In VSCode, create a new file in the root of your project called `.env.local` and paste in:
```
WHOP_API_KEY=your_whop_api_key_here
WHOP_APP_ID=your_app_id_here
NEXT_PUBLIC_WHOP_APP_ID=your_app_id_here
WHOP_AGENT_USER_ID=your_agent_user_id_here
GHL_WEBHOOK_URL=your_gohighlevel_inbound_webhook_url_here
```
Replace each value with the real ones you saved earlier.

### Step 6: Copy in all the code files
Now you need to replace/create the files in your project with the code files I've provided. Here's exactly what to do:

1. **Delete** the existing `app/page.tsx` and `app/layout.tsx` and `app/globals.css`
2. **Copy in** the files I've given you, maintaining the exact folder structure:

```
app/
├── globals.css          ← replace existing
├── layout.tsx           ← replace existing  
├── page.tsx             ← replace existing
├── experiences/
│   └── [experienceId]/
│       └── page.tsx     ← create this folder structure + file
├── dashboard/
│   └── [companyId]/
│       └── page.tsx     ← create this folder structure + file
├── api/
│   └── tag-lead/
│       └── route.ts     ← create this folder structure + file
├── components/
│   └── OnboardingFlow.tsx  ← create this folder + file
└── lib/
    ├── whop-api.ts      ← create this folder + file
    └── iframe-sdk.ts    ← create this file
```

Also update:
- `next.config.ts` in the root (replace existing)
- `tailwind.config.ts` in the root (replace existing)
- `package.json` — add the whop-proxy script (I'll show you exactly what to add)

### Step 7: Add the dev proxy script
Open `package.json` and find the `"scripts"` section. Add the whop-proxy line so it looks like:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "whop-proxy": "whop-proxy"
}
```

---

## PART 5: Test Locally

### Step 1: Run the dev server
```bash
pnpm dev
```
Your app should now be running at `http://localhost:3000`

### Step 2: Test inside Whop
1. Go to your Whop dashboard
2. Navigate to your community/group
3. Go to **Tools** section and add your app
4. In the top right of the window, find the translucent settings icon
5. Select **localhost** — default port 3000 should work
6. You should see your onboarding flow inside the Whop iframe

---

## PART 6: Deploy to Vercel (Free)

### Step 1: Push your code to GitHub
1. Go to **https://github.com** and create a new repository called `impact-onboarding`
2. In your VSCode terminal, run:
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/impact-onboarding.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to **https://vercel.com** and sign up with your GitHub account
2. Click **Add New Project**
3. Select your `impact-onboarding` repository
4. Before deploying, add your **Environment Variables**:
   - `WHOP_API_KEY`
   - `WHOP_APP_ID`
   - `NEXT_PUBLIC_WHOP_APP_ID`
   - `WHOP_AGENT_USER_ID`
   - `GHL_WEBHOOK_URL`
5. Click **Deploy**

### Step 3: Update your Whop App URL
1. Copy your Vercel deployment URL (something like `https://impact-onboarding.vercel.app`)
2. Go back to your Whop Developer Dashboard
3. Update the **Base URL** to your Vercel URL

---

## PART 7: Add Your Real Content

Once everything is deployed and working, you'll want to customize:

1. **Page 2 — VSL Video**: Replace the placeholder video URL in `OnboardingFlow.tsx` with your actual video embed URL
2. **Page 2 — Testimonials**: Replace the placeholder testimonials with real ones
3. **Page 4 — Features**: Replace the placeholder features with your actual features and demo video URLs
4. **Page 5 — Next Steps**: Replace the placeholder steps for each bucket with your actual next steps

Search for `TODO:` comments in the code to find every spot that needs your real content.

---

## Troubleshooting

**App not loading in Whop iframe?**
- Make sure your Base URL and App Path are set correctly in the Whop dashboard
- Make sure you're using the correct environment variables

**GHL not receiving data?**
- Check that your `GHL_WEBHOOK_URL` in `.env.local` is correct
- Make sure the GHL workflow is **published** (toggled on)
- Test the webhook URL manually using a tool like Postman or just check the GHL workflow logs

**Styles look wrong?**
- Run `pnpm build` to make sure there are no build errors
- Clear your browser cache and reload

---

That's it. You're live. 🔥
