// src/pages/SignUp.tsx
import { SignUp } from '@clerk/clerk-react'  // ← switch to clerk-react (not react-router)
import { useState, useEffect } from 'react'

export default function SignUpPage() {
  const [selectedRole, setSelectedRole] = useState('buyer')

  // Persist role to localStorage (Redirect.tsx reads this as fallback)
  useEffect(() => {
    localStorage.setItem('selectedRole', selectedRole)
  }, [selectedRole])

  return (
    <div className='w-full flex flex-col items-center mt-10 gap-6'>
      <div className="w-[400px]">
        <label className="font-semibold text-foreground">Select your role:</label>
        <select
          className="w-full border p-2 rounded-full mt-2"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="buyer">Buyer / Client</option>
          <option value="agent">Agent</option>
          <option value="host">Host</option>
          <option value="professional">Professional</option>
        </select>
      </div>

      {/*
        key={selectedRole} forces a full remount of <SignUp> when the
        role changes — this ensures Clerk initialises a fresh sign-up
        attempt with the correct unsafeMetadata value every time.
      */}
      <SignUp
        key={selectedRole}
        routing="path"
        path="/sign-up"
        fallbackRedirectUrl="/redirect"
        unsafeMetadata={{ role: selectedRole }}
      />
    </div>
  )
}
