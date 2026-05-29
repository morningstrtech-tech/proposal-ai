import 'dotenv/config';
import postgres from 'postgres';

// Try multiple connection formats
const urls = [
  // Original direct
  process.env.DATABASE_URL,
  // Pooler format (transaction mode)
  `postgresql://postgres.ufjyehjphhzxtnmcgvqj:${encodeURIComponent('Ms.tech1012026')}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`,
  // Pooler format (session mode)
  `postgresql://postgres.ufjyehjphhzxtnmcgvqj:${encodeURIComponent('Ms.tech1012026')}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
];

for (const url of urls) {
  const label = url.includes('pooler') ? (url.includes('6543') ? 'Pooler (transaction)' : 'Pooler (session)') : 'Direct';
  console.log(`\nTesting: ${label}...`);
  const sql = postgres(url, { ssl: 'require', connect_timeout: 10 });
  try {
    const result = await sql`SELECT 1 as ok`;
    console.log(`  ✅ SUCCESS! Connected.`);
    console.log(`  URL: ${url.replace(/:[^:@]+@/, ':***@')}`);
    await sql.end();
    process.exit(0);
  } catch (e) {
    console.log(`  ❌ FAILED: ${e.message}`);
    await sql.end();
  }
}

console.log('\nAll connection attempts failed.');
