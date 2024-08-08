import { auth, db } from '@/auth'
import EditAndPublish from '@/components/quiz/edit-and-publish-classic'
import { Button } from '@/components/ui/button'
import { Account } from '@/lib/db/output_types'
import Link from 'next/link'

export default async function EditPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!session || !userId) {
    return null
  }

  // Check if user has a canvas account linked
  let acc: Account | undefined = await db
  .selectFrom('Account')
  .selectAll()
  .where('userId', '=', userId)
  .where('provider', '=', 'canvas')
  .executeTakeFirst();

  if (!acc) {
    return (
      <div className="flex flex-col mx-10 mt-8">
        <h1 className="text-lg">
          You do not have a Canvas account linked
        </h1>
        <p className="text-base text-muted-foreground mt-2">
          Please link your Canvas account to continue.
        </p>
        <Link href="/profile" className="mt-6">
          <Button>Go to Profile</Button>
        </Link>
      </div>
    )
  }

  // Get token using user id, then prisma query to find Account with id, and provider of canvas
  return (
    <div className="flex flex-col mx-10 mt-8">
      <EditAndPublish session={session} />
    </div>
  )
}
