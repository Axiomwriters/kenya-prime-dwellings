# Agent Onboarding Animation - Storyboard & Script

## Animation Overview

| Attribute | Value |
|-----------|-------|
| **Duration** | 45-60 seconds |
| **Format** | Lottie/JSON (after Figma export) or HTML/CSS |
| **Target** | Agent onboarding guide on webapp |
| **Theme** | Savanah Dwelling Green (#16a34a) + White + Dark Gray |

---

## Scene 1: INTRO (5 seconds)

### Visual Elements
- **Background**: White with subtle green gradient mesh
- **Logo**: Savanah Dwelling logo pops in center
- **Text**: "Welcome to Savanah Dwelling" fades in below logo
- **Subtext**: "Your journey as a Real Estate Agent starts here"
- **Animation**: Logo scales from 0 to 1 with bounce easing, text fades in with 0.3s delay

### Script/Voiceover (Optional)
> "Welcome to Savanah Dwelling, Kenya's trusted real estate platform."

---

## Scene 2: ROLE SELECTION (8 seconds)

### Visual Elements
- **Screen**: Sign-up page with 4 role cards
- **Highlight**: Green glow on "Real Estate Agent" card
- **Animation**: 
  - 4 cards slide in from bottom (staggered, 0.1s each)
  - Agent card pulses green to indicate selection
- **Colors**: 
  - Primary: #16a34a (Savanah Green)
  - Secondary: #f8fafc (Light Gray)
  - Accent: #22c55e (Lighter Green)

### Script/Voiceover (Optional)
> "Choose your path. Select 'Real Estate Agent' to start listing properties."

### On-Screen Text
- "Select: Real Estate Agent" (appears with checkmark)

---

## Scene 3: SIGN UP FORM (8 seconds)

### Visual Elements
- **Screen**: Email/Password form
- **Fields**: First Name, Last Name, Email, Password
- **Animation**:
  - Form fields animate in one by one (0.2s stagger)
  - Password strength indicator fills green as user types
- **Success State**: Green checkmark appears next to "Strong Password"

### Script/Voiceover (Optional)
> "Enter your details. Create a secure password to protect your account."

### On-Screen Text
- "Fill in your credentials"
- "Password: Strong ✓"

---

## Scene 4: EMAIL VERIFICATION (6 seconds)

### Visual Elements
- **Screen**: 6-digit code input
- **Animation**:
  - Email inbox icon bounces
  - Code boxes fill in one by one with green highlight
  - Green checkmark appears on completion
- **Email Preview**: Shows styled email from "Savanah Dwelling"

### Script/Voiceover (Optional)
> "Check your email. Enter the 6-digit code we sent you."

### On-Screen Text
- "Verify your email"
- "Code accepted ✓"

---

## Scene 5: ID UPLOAD (10 seconds)

### Visual Elements
- **Screen**: ID verification with phone camera view
- **UI Elements**:
  - ID card outline (front) appears
  - "Front" label pulses
- **Animation**:
  - ID card slides into the frame
  - Green corner markers appear on successful scan
  - "Front - Verified ✓" appears
  - Then: ID flips to show back side
  - "Back - Verified ✓" appears
- **Progress Bar**: 33% → 66%

### Script/Voiceover (Optional)
> "Verify your identity. Upload photos of your ID, front and back."

### On-Screen Text
- "Step 1 of 3: Identity"
- "ID Front ✓"
- "ID Back ✓"

---

## Scene 6: SELFIE VERIFICATION (8 seconds)

### Visual Elements
- **Screen**: Camera view with face outline
- **UI Elements**:
  - Oval face guide appears (green dashed line)
  - "Position your face" instruction
- **Animation**:
  - User's face (silhouette) appears in frame
  - Green border captures around face
  - Face outline turns solid green with checkmark
- **Progress Bar**: 66% → 90%

### Script/Voiceover (Optional)
> "Take a selfie. Position your face within the frame for verification."

### On-Screen Text
- "Step 2 of 3: Selfie"
- "Face verified ✓"

---

## Scene 7: PHONE OTP VERIFICATION (8 seconds)

### Visual Elements
- **Screen**: Phone number input + OTP
- **UI Elements**:
  - Kenya flag (+254) appears
  - Phone number input field
  - "Send Code" button pulses green
- **Animation**:
  - SMS icon appears, envelope opens
  - OTP code reveals with digit-by-digit animation
  - Green success banner appears
- **Progress Bar**: 90% → 100%

### Script/Voiceover (Optional)
> "Secure your account. Verify your phone number with a one-time code."

### On-Screen Text
- "Step 3 of 3: Phone"
- "OTP sent ✓"
- "Phone verified ✓"

---

## Scene 8: SUCCESS / DASHBOARD (6 seconds)

### Visual Elements
- **Screen**: Animated transition to dashboard
- **UI Elements**:
  - Confetti animation (green theme)
  - "Verification Complete!" banner
  - Dashboard preview fades in
- **Animation**:
  - Checkmark spins with green glow
  - Screen transitions to dashboard view
  - Stats cards animate in (Properties, Views, Messages icons)
  - "Welcome Agent!" text appears

### Script/Voiceover (Optional)
> "You're all set! Welcome to your agent dashboard. Start listing properties and grow your business."

### On-Screen Text
- "Welcome to your Dashboard!"
- "3 Properties | 0 Views | 0 Messages"

---

## Scene 9: OUTRO (4 seconds)

### Visual Elements
- **Background**: White with green gradient
- **Logo**: Center screen, small
- **Text**: "Savanah Dwelling - Kenya's Trusted Real Estate Platform"
- **Call to Action**: "Start Now" button pulses
- **Animation**:
  - Logo scales in
  - Text fades in
  - Button pulses infinitely (until clicked)

### Script/Voiceover (Optional)
> "Join thousands of agents on Kenya's #1 real estate platform."

### On-Screen Text
- "savanah-dwelling.co.ke"
- [Get Started Button]

---

## Technical Specifications

### Color Palette (Savanah Dwelling Theme)
| Name | Hex | Usage |
|------|-----|-------|
| Primary Green | #16a34a | Main accent, buttons, success states |
| Light Green | #22c55e | Highlights, hover states |
| Dark Green | #15803d | Active states, headers |
| Background | #FFFFFF | Main background |
| Surface | #F8FAFC | Cards, inputs |
| Text Primary | #111827 | Main text |
| Text Secondary | #6B7280 | Subtitles, hints |
| Border | #E5E7EB | Input borders |
| Error | #EF4444 | Error states |

### Animation Guidelines
- **Easing**: Cubic-bezier(0.4, 0, 0.2, 1) for smooth motion
- **Duration**: 300-500ms for micro-interactions, 800-1200ms for scene transitions
- **Stagger**: 50-100ms delay between list items
- **Loop**: Intro/outro can loop; main flow plays once

### Figma Creation Steps
1. Create frames at 1920x1080 (or 1080x1920 for mobile)
2. Use green (#16a34a) as primary color
3. Add "Savanah Dwelling" logo
4. Use LottieFiles plugin to animate
5. Export as JSON for web embedding

### HTML/CSS Implementation
- Use CSS animations with @keyframes
- Implement as React component
- Make responsive (mobile + desktop)
- Add play/pause controls

---

## Integration Points

| Page | Integration Method |
|------|-------------------|
| `/sign-up` | Add as hero animation before form |
| `/verification` | Add as intro animation on page load |
| `/agent/dashboard` | Show as welcome animation on first visit |
| Landing Page | Full animation as onboarding video |

---

**End of Storyboard**
