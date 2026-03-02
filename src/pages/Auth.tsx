// src/pages/Auth.tsx — just the button section (replace the two Button blocks)
<Button
  type="button"
  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-base"
  onClick={() => navigate('/sign-in')}
>
  Sign In
</Button>

<Button
  type="button"
  className="w-full bg-primary mt-3 hover:bg-primary/90 text-primary-foreground h-11 text-base"
  onClick={() => navigate('/sign-up')}
>
  Create Account
</Button>
