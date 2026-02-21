# 🏥 ANEMIA DETECTION WEBSITE - COMPLETE FIGMA DESIGN GUIDE

## 📐 FRAME SETUP

### Main Desktop Frame
- **Size:** 1440 × 900
- **Background:** Linear Gradient (135°)
  - **Top Left:** #2ECC71 (Medical Green)
  - **Bottom Right:** #3498DB (Medical Blue)

---

## 🎨 COLOR PALETTE (Save as Figma Styles)

### Primary Colors
- **Medical Green:** `#2ECC71`
- **Dark Green:** `#27AE60`
- **Medical Blue:** `#3498DB`
- **Dark Blue:** `#2980B9`
- **Alert Red:** `#E74C3C`
- **Dark Red:** `#C0392B`

### Neutral Colors
- **Soft White:** `#F8F9FA`
- **Dark Navy:** `#1F2D3D`
- **Gray:** `#717182`
- **Light Gray:** `#ECECF0`

### Usage
- Primary Green → Buttons, Success states, Icons
- Blue → Secondary actions, Links
- Red → Alerts, Warning states
- White → Text on dark backgrounds
- Dark Navy → Primary text

---

## 🏗 STRUCTURE - SECTION BY SECTION

### 1️⃣ NAVBAR (Fixed Top)
**Height:** 80px  
**Background:** White with 10% opacity + Backdrop blur (20px)  
**Border Bottom:** 1px, White 20% opacity

**Layout:**
```
[Logo + Icon] ←→ [Home | How It Works | About | Contact] ←→ [Get Started Button]
```

**Logo:**
- Green Activity icon (24×24) in white rounded square
- Text: "Anemia AI" (20px, Bold, White)

**Links:**
- Font: 16px, Medium, White
- Hover: White 80%

**Button:**
- Background: White
- Text: Green (#2ECC71)
- Padding: 12px 24px
- Radius: 8px

---

### 2️⃣ HERO SECTION (Hospital Scene)

#### Left Content Area
**Width:** 600px  
**Auto Layout:** Vertical, 24px spacing

**Badge:**
- Background: White 20% + Backdrop blur
- Border: White 30%
- Padding: 8px 16px
- Radius: 24px (pill shape)
- Icon: Activity (16×16)
- Text: "AI-Powered Medical Technology" (14px)

**Heading:**
- Font: Poppins/Inter Bold
- Size: 56px
- Color: White
- Line height: 1.2
- Text: "AI-Assisted Anemia Detection"

**Subtext:**
- Font: 18px Regular
- Color: White 90%
- Max width: 500px
- Text: "Advanced medical screening using conjunctiva analysis. Non-invasive, instant results powered by cutting-edge AI."

**Buttons:**
- Primary: White bg, Green text, Upload icon
- Secondary: Transparent, White border, White text
- Size: 50px height, 200px width
- Radius: 30px

**Stats Row:**
- 3 columns
- Border top: White 20%
- Padding top: 48px
- Numbers: 32px Bold
- Labels: 14px, White 80%

---

#### Right Hospital Scene (CRITICAL FOR ANIMATION)

**Container:** 600×600px  
**Background:** White 10% + Backdrop blur + Border (White 20%)  
**Radius:** 24px

**Required Image Assets (Download from these sources):**

1. **Storyset.com** (Free, Customizable)
   - Search: "Doctor examining patient"
   - Style: "Realistic" or "3D"
   - Download as SVG

2. **Freepik.com** (Free with attribution)
   - Search: "Hospital room illustration"
   - Search: "Medical examination vector"
   - Download high-quality SVG

3. **Undraw.co** (Free, No attribution)
   - Search: "Doctor"
   - Search: "Medical care"
   - Customize colors to match (#2ECC71, #3498DB)

**Alternative: Use Unsplash for Real Photos**
- Doctor examining patient
- Hospital room equipment
- Stethoscope close-up

---

### 🎬 ANIMATION SETUP (Smart Animate)

#### Layer Structure (Bottom to Top)
```
1. Background Hospital Image (Opacity 20%)
2. Medical Monitor (Top Left)
3. Patient Bed (Bottom Right)
4. Patient Circle (Above bed)
5. Doctor Circle (Main, Animated)
6. Stethoscope Icon (Attached to doctor)
7. Medical Cross (Floating)
8. Pulse Rings (Overlay)
```

#### Frame 1: Doctor Ready
- Doctor position: `X: 120, Y: 200`
- Doctor rotation: `0°`
- Stethoscope position: Attached, bottom right
- Stethoscope rotation: `0°`

#### Frame 2: Doctor Examining
- Doctor position: `X: 180, Y: 180` (Moved 60px right, 20px up)
- Doctor rotation: `-5°` (Slight lean)
- Stethoscope rotation: `15°` (Examining motion)
- Patient scale: `102%` (Breathing effect)

#### Prototype Settings
**Frame 1 → Frame 2:**
- Trigger: After Delay (600ms)
- Animation: Smart Animate
- Duration: 800ms
- Easing: Ease In-Out

**Frame 2 → Frame 1:**
- Same settings
- Creates infinite loop

---

### 📦 DETAILED ELEMENT SPECS

#### Medical Monitor (Top Left)
- Size: 140×100px
- Background: #1F2D3D
- Border: 2px, Green 50%
- Radius: 16px
- Padding: 16px

**Content:**
- Green dot (pulse indicator)
- Text: "Live Monitoring" (12px, White 80%)
- ECG line (animated SVG path)
- BPM: "72 BPM" (24px Bold, Green)

#### Doctor Circle
- Size: 256×256px
- Background: White 90% + Backdrop blur
- Border: 4px, White 70%
- Shadow: 0px 20px 40px rgba(0,0,0,0.2)

**Inside:**
- Doctor image (fill container)
- Gradient overlay: Green 20% from bottom
- Medical badge: Green circle with Activity icon

#### Patient Bed
- Size: 192×128px
- Background: White 80% + Backdrop blur
- Border: 2px, White 50%
- Radius: 16px
- Shadow: Soft

**Patient Circle (Above bed):**
- Size: 80×80px
- Circular crop
- Border: 4px White
- Breathing animation: Scale 100% → 102% (loop)

#### Stethoscope
- Size: 64×64px
- Circular crop
- Border: 4px White
- Position: Attached to doctor, bottom right
- Animation: Rotate 0° → 15° → 0°

#### Medical Cross (Floating)
- Size: 64×64px
- Background: White 90% + Backdrop blur
- Border: 2px, Green 30%
- Radius: 16px

**Cross inside:**
- Red (#E74C3C)
- Vertical bar: 2×32px
- Horizontal bar: 32×2px

**Animation:**
- Vertical: 0 → -20 → 0
- Rotation: 0° → 10° → 0° → -10° → 0°

---

### 3️⃣ HOW IT WORKS SECTION

**Background:** #F8F9FA  
**Padding:** 80px top/bottom

**3 Cards (Grid Layout):**
- Width: 300px each
- Height: 250px
- Radius: 24px
- Background: White
- Shadow: 0px 8px 24px rgba(0,0,0,0.08)

**Card Structure:**
```
[Icon in colored square]
[Title - colored]
[Description - gray]
```

**Icons:**
1. Upload (Green background)
2. Brain (Blue background)
3. CheckCircle (Red background)

**Hover State:**
- Transform: translateY(-10px)
- Shadow: Stronger

---

### 4️⃣ UPLOAD SECTION

**Background:** White

**Left Side: Upload Zone**
- Border: 4px dashed, Gray 300
- Radius: 24px
- Padding: 48px

**Drag Active State:**
- Border: Green
- Background: Green 5%
- Scale: 1.05

**Center Content:**
- Upload icon in gradient square
- Heading: "Drop your image here"
- Button: "Choose File" (Green)
- Divider: "or"
- Secondary button: "Take Photo" (Blue outline)

**Right Side: Guidelines**
- Background: Gradient Green 10% to Blue 10%
- Radius: 24px
- Checkmark list items

---

### 5️⃣ RESULT CARD

**Max Width:** 640px  
**Background:** White  
**Radius:** 24px  
**Shadow:** Large

**Header:**
- Background: Red gradient
- Padding: 32px
- Status text: White, 32px Bold
- Confidence: 56px Bold, White

**Progress Bar:**
- Height: 12px
- Background: Gray 200
- Fill: Red gradient
- Animated width: 0% → 87%

**Details Section:**
- Hemoglobin card: Blue icon, large text
- Recommendation: Green background, checkmark icon

**Buttons:**
- Download: Green gradient
- Consultation: Blue outline

---

### 6️⃣ ABOUT SECTION

**Layout:** 2 columns

**Left: Text + Feature Cards**
- 2×2 grid of mini cards
- Each with colored icon
- Title + description

**Right: Stats Card**
- Background: Green to Blue gradient
- Floating decorative squares
- Main stat: "10K+" large
- 3-column mini stats

**Pulse Ring:**
- Border: White 30%
- Animation: Scale 1 → 1.05 → 1, Opacity 0.5 → 0

---

### 7️⃣ CONTACT SECTION

**Left: Form**
- Background: Light gray gradient
- Input fields: White, 2px border
- Focus state: Green border
- Submit button: Green gradient

**Right: Info Card**
- Background: Green to Blue gradient
- White text
- Icons in frosted circles
- Emergency warning card below

---

### 8️⃣ FOOTER

**Background:** #1F2D3D (Dark Navy)  
**Text:** White

**4 Columns:**
1. Brand + description
2. Quick Links
3. Contact info (icons + text)
4. Social media icons

**Social Icons:**
- Size: 40×40px
- Background: White 10%
- Hover: White 20% + Scale 1.1

**Bottom Bar:**
- Border top: White 10%
- Copyright + Legal links

---

## ✨ ANIMATION EFFECTS TO ADD

### Micro Animations
1. **Buttons:** Scale 1.05 on hover
2. **Cards:** translateY(-10px) on hover
3. **Icons:** Rotate or scale on hover
4. **Floating elements:** Continuous Y motion
5. **Pulse rings:** Scale + fade
6. **Progress bars:** Width animation
7. **Breathing effect:** Subtle scale (1 → 1.02)

### Smart Animate Usage
- Doctor movement between frames
- Stethoscope rotation
- Patient breathing
- Heartbeat monitor
- Floating particles

---

## 🎯 FIGMA PROTOTYPING CHECKLIST

- [ ] All sections in single frame (1440×900)
- [ ] Color styles created and named
- [ ] Components for buttons, cards, icons
- [ ] Doctor scene: 2 frames created
- [ ] Smart Animate connections set
- [ ] Hover states for interactive elements
- [ ] Auto Layout where needed
- [ ] Constraints set for responsiveness
- [ ] Shadows and blurs applied
- [ ] Export settings configured (PNG/SVG)

---

## 📱 RESPONSIVE VARIANT (Mobile)

**Frame:** 390 × 844

**Changes:**
- Stack all sections vertically
- Single column layout
- Reduce font sizes by 25%
- Hospital scene: Smaller, centered
- Hide some decorative elements
- Hamburger menu for navigation

---

## 🔗 RESOURCE LINKS

### Free Illustration Sites
- **Storyset:** https://storyset.com
- **Undraw:** https://undraw.co
- **Freepik:** https://freepik.com (Free account)
- **Icons8 Illustrations:** https://icons8.com/illustrations

### Real Photos
- **Unsplash:** https://unsplash.com
  - Search: "doctor patient", "hospital", "medical care"

### Fonts (Google Fonts)
- **Primary:** Poppins or Inter
- **Weights:** Regular (400), Medium (500), SemiBold (600), Bold (700)

---

## 💡 PRO TIPS

1. **Use glassmorphism:** White 10% + Backdrop blur (20px)
2. **Soft shadows:** Never pure black, use color shadows
3. **Consistent spacing:** Use 8px grid (8, 16, 24, 32, 48, 64)
4. **Rounded corners:** 8px, 16px, 24px for medical feel
5. **Limit animations:** Only animate what adds value
6. **Accessibility:** Ensure text contrast ratios
7. **Export 2x/3x:** For crisp images on retina displays

---

## 🚀 EXPORT SETTINGS

### For Developers
- **Images:** PNG at 2x
- **Icons:** SVG
- **Assets:** Organize in folders by section
- **CSS:** Export color variables
- **Spacing:** Document in style guide

### For Presentation
- **Prototype:** Full screen (Command/Ctrl + Enter)
- **Video:** Record with Figma's built-in recorder
- **PNG/PDF:** Export key frames

---

## ✅ FINAL QUALITY CHECK

- [ ] All images high resolution
- [ ] No pixelated icons
- [ ] Text readable on all backgrounds
- [ ] Colors match medical theme
- [ ] Animations smooth (60fps)
- [ ] Hover states work
- [ ] Mobile version created
- [ ] All links connected in prototype
- [ ] Professional, not cartoon-like
- [ ] Medical accuracy in imagery

---

**Created for:** Anemia Detection AI Website  
**Design System:** Green (#2ECC71) + Blue (#3498DB) Medical Theme  
**Style:** Professional, Realistic, Healthcare-focused  
**Target:** Figma Design Implementation
