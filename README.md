# For Rawan

A small interactive birthday gift for Rawan's 25th, built to be opened on a phone.

1. **Gift**: tap the box three times to open it.
2. **Cake**: blow out 25 candles, either by blowing into the mic or by tapping them.
3. **Balloons**: pop 25 balloons. Each one reveals a word about her.
4. **Scratch card**: scratch the gold foil to reveal a secret.
5. **Letter**: a letter that types itself out.

## Make it personal

Everything she reads is in `src/content.ts`: the balloon words, the scratch-card secret and the letter. Edit that file; nothing else needs to change.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build into dist/
```

Deploys to Vercel as a Vite project with no extra config. The mic only works over HTTPS, which Vercel provides.
