import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Layout from '@/components/layout/Layout'
import study from '@/public/study.json'
import LottieComponent from '@/components/lottie'
import { GetStartedButton } from '@/components/get-started-button'

async function Home() {
  const session = await auth()
  // redirect to home if user is already logged in
  if (session?.user) {
    redirect('/')
  }

  return (
    <Layout>
      <div className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col mx-20">
            <LottieComponent animationData={study} width={1000} />
          </div>
          <div className="flex flex-col mx-20 justify-center">
            {/* Add your Hero content here for the left column */}
            <h1 className="text-2xl font-bold mb-4 mt-10">
              Learn differently with AI.
            </h1>
            <p className="mb-4">
              → Utilize an AI-powered revolving exercise lesson tool to learn
              better than before.
            </p>

            <h1 className="font-normal mb-4">
              → Revolutionize your study sessions with Learnloop&apos;s
              AI-powered quiz generator. Upload your textbook, select chapters,
              and get a tailored quiz instantly. Beyond quizzes, envision a
              future with Learnloop&apos;s expanding AI tools, including an
              interactive coding playground.
            </h1>
            {/* Login button on the right column for larger screens, it stacks below the hero content on smaller screens */}
            {/* <LoginButton className='w-96' /> */}
            <GetStartedButton className={'inline-flex w-full cursor-pointer rounded-sm py-3 text-center'}>
              Get Started
            </GetStartedButton>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
