export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('Next.js server starting...')
    console.log('Database will be initialized on first API request')
  }
}

