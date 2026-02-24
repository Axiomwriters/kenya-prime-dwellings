import { SignUp } from '@clerk/react-router'

export default function SignUpPage () {
  return (
    <div className='w-full flex justify-center mt-10'>
      <SignUp 
        routing="path"
        path="/sign-up"
        fallbackRedirectUrl="/agent"
      />
    </div>
  )
}