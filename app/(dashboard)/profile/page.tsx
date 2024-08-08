import { auth, db } from '@/auth'
import { Integrations } from '@/components/integrations'
import { AccountIntegration } from '@/components/types/types'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'

export default async function Profile() {
  const session = await auth()

  if (!session) {
    return <div>You are not signed in</div>
  }

  // Query user information
  const user = await db.selectFrom('User')
    .selectAll()
    .where('id', '=', session.user.id)
    .executeTakeFirst()

  // Check if Canvas account is linked
  const canvasLinkedAccount = await db.selectFrom('Account')
    .selectAll()
    .where('userId', '=', session.user.id)
    .where('provider', '=', 'canvas')
    .executeTakeFirst()

  const canvasLinked: boolean = canvasLinkedAccount ? true : false

  // Count lesson sessions
  const sessionCount = await db.selectFrom('LessonSession')
    .select(db.fn.count('id').as('count'))
    .where('userId', '=', session.user.id)
    .executeTakeFirst()

  const sessions = sessionCount?.count as number || 0

  // Count lessons
  const lessonCount = await db.selectFrom('Lesson')
    .select(db.fn.count('id').as('count'))
    .where('userId', '=', session.user.id)
    .executeTakeFirst()

  const lessons = lessonCount?.count as number || 0

  // Count documents
  const documentCount = await db.selectFrom('Document')
    .select(db.fn.count('id').as('count'))
    .where('userId', '=', session.user.id)
    .executeTakeFirst()

  const documents = documentCount?.count as number || 0

  const integrations: AccountIntegration[] = [
    {
      name: 'Canvas',
      icon: '/canvas.svg',
      description: 'Connect your Canvas account to access your lessons and quizzes.',
      link: 'canvas',
      isLinked: canvasLinked
    }
  ]

  return (
    <div className="flex flex-col p-10 space-y-10">
      <div className="flex flex-row">
        <Image
          className="size-16 transition-opacity duration-300 rounded-full select-none ring-1 ring-zinc-100/10 hover:opacity-80"
          src={session?.user?.image ? `${session.user.image}` : ''}
          alt={session?.user.name ?? 'Avatar'}
          height={48}
          width={48}
        />
        <h1 className="ml-4 text-md self-center">{session?.user.name}</h1>
      </div>
      <Integrations userId={session?.user.id} integrations={integrations} />
      <section className='space-y-6'>
        <h1 className="text-lg text-muted-foreground mb-6">Limits</h1>
        <div>
          <Label>Lesson Session Usage</Label>
          <div className="flex flex-row items-center">
            <Progress value={(sessions / (user?.max_lesson_sessions || 0)) * 100} className="h-2 w-[40rem] self-center" />
            <h1 className="ml-4">
              {sessions} / {user?.max_lesson_sessions} Sessions
            </h1>
          </div>
        </div>
        <div>
          <Label>Lesson Creation Usage</Label>
          <div className="flex flex-row">
            <Progress value={(lessons / (user?.max_lesson_creation || 0) * 100)} className="h-2 w-[40rem] self-center" />
            <h1 className="ml-4">
              {lessons} / {user?.max_lesson_creation} Creations
            </h1>
          </div>
        </div>
        <div>
          <Label>Document Usage</Label>
          <div className="flex flex-row">
            <Progress value={(documents / (user?.max_documents || 0) * 100)} className="h-2 w-[40rem] self-center" />
            <h1 className="ml-4">
              {documents} / {user?.max_documents} Documents
            </h1>
          </div>
        </div>
      </section>
    </div>
  )
}
