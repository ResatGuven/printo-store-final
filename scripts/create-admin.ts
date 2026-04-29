/**
 * Admin kullanıcı oluşturma scripti
 * Kullanım: npx tsx scripts/create-admin.ts
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve))
}

async function main() {
  console.log('\n🖨️  PRINTO Admin Kullanıcı Oluşturma\n')

  const name = await ask('Ad Soyad: ')
  const email = await ask('E-posta: ')
  const password = await ask('Şifre (min 8 karakter): ')

  if (password.length < 8) {
    console.error('❌ Şifre en az 8 karakter olmalıdır')
    process.exit(1)
  }

  const exists = await prisma.adminUser.findUnique({ where: { email } })
  if (exists) {
    const overwrite = await ask(`⚠ Bu e-posta zaten kayıtlı. Üzerine yaz? (y/N): `)
    if (overwrite.toLowerCase() !== 'y') {
      console.log('İptal edildi.')
      process.exit(0)
    }
    const hashed = await bcrypt.hash(password, 12)
    await prisma.adminUser.update({ where: { email }, data: { name, password: hashed } })
    console.log('✅ Admin kullanıcısı güncellendi!')
  } else {
    const hashed = await bcrypt.hash(password, 12)
    await prisma.adminUser.create({ data: { name, email, password: hashed } })
    console.log(`\n✅ Admin kullanıcısı oluşturuldu!`)
    console.log(`   E-posta  : ${email}`)
    console.log(`   Giriş    : /admin/login\n`)
  }

  rl.close()
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  rl.close()
  process.exit(1)
})
