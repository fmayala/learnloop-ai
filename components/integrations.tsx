'use client'
import { signIn } from 'next-auth/react'
import { Button } from './ui/button'
import Image from 'next/image'
import { unlinkIntegration } from '@/app/actions/auth/actions-integrations'
import { IconSpinner } from './ui/icons'
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { AccountIntegration } from './types/types'

// Intake an array of integrations and return a list of them
export const Integrations = ({
  userId,
  integrations
}: {
  userId: string,
  integrations: AccountIntegration[]
}) => {
  const [loadingIntegration, setLoadingIntegration] = useState<string | null>(null)
  const router = useRouter();

  const handleUnlink = async (integrationName: string) => {
    setLoadingIntegration(integrationName)
    const result = await unlinkIntegration(userId, integrationName.toLowerCase())
    setLoadingIntegration(null)
    if (result.success) {
      // Refresh the page or update state to reflect changes
      router.refresh()
    } else {
      console.error(result.error)
    }
  }

  return (
    <section>
      <h1 className="text-lg text-muted-foreground mb-6">Integrations</h1>
      {integrations.map((integration: AccountIntegration) => (
        <div key={integration.name} className="flex flex-row items-center mb-4">
          <Image src={integration.icon} width={24} height={24} alt={integration.name} />
          <p className="ml-2">{integration.name}</p>
          {integration.isLinked ? (
            <Button 
              className="ml-4 dark:bg-zinc-900 dark:hover:bg-zinc-300/10 border border-border text-foreground hover:bg-muted hover:text-foreground focus-visible:ring-accent" 
              onClick={() => handleUnlink(integration.name)}
              disabled={loadingIntegration === integration.name}
            >
              {loadingIntegration === integration.name ? (
                <IconSpinner className="animate-spin size-4" />
              ) : (
                'Unlink'
              )}
            </Button>
          ) : (
            <Button className="ml-4 dark:bg-zinc-900 dark:hover:bg-zinc-300/10 border border-border text-foreground hover:bg-muted hover:text-foreground focus-visible:ring-accent" onClick={() => signIn(integration.link, { callbackUrl: '/profile' })}>
              Connect
            </Button>
          )}
        </div>
      ))}
    </section>
  )
}
// <IconSpinner className="animate-spin size-4 mr-2" />
