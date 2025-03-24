
# Supabase Setup Guide

## 1. Get Your Supabase Credentials

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Select your project
3. Go to Project Settings → API
4. Copy your "Project URL" (this is your `VITE_SUPABASE_URL`)
5. Copy your "anon" public key (this is your `VITE_SUPABASE_ANON_KEY`)

## 2. Create Environment Variables File

Create a file named `.env.local` in the root of your project (the same level as package.json) with the following content:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the placeholders with your actual values.

## 3. Restart Your Development Server

Stop your development server if it's running, and restart it with:

```
npm run dev
```

or

```
yarn dev
```

## 4. Test Your Connection

Fill out and submit the email form on your site. If everything is set up correctly:
- The form should submit successfully
- You should see a "Success!" toast message
- The email should be stored in your `deadpunch_email_capture` table in Supabase
