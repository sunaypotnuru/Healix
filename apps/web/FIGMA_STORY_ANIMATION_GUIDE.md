# 🏥 ANEMIA DETECTION WEBSITE - STORY ANIMATION HOMEPAGE (FIGMA)

## 🎯 OVERVIEW

This guide will help you create a **4-frame story animation** in Figma that shows:
1. **Scene 1:** Patient outside hospital
2. **Scene 2:** Patient entering hospital
3. **Scene 3:** Doctor approaching patient inside
4. **Scene 4:** Doctor treating patient

---

## 🎨 1️⃣ MAIN FRAME SETUP

### Create Desktop Frame
- **Name:** Desktop - Anemia Hero
- **Size:** 1440 × 900

### Background Gradient
- **Type:** Linear Gradient (135° angle)
- **Color 1 (Top Left):** `#E8F8F5` (Soft Medical Green)
- **Color 2 (Bottom Right):** `#D6EAF8` (Soft Medical Blue)

### Why These Colors?
Soft, calming medical colors instead of vibrant ones. This creates a professional healthcare feel.

---

## 📐 2️⃣ LAYOUT STRUCTURE

### Grid Layout (2 Columns)
```
|← Left Content (Static) →|← Animation Scene (Dynamic) →|
|        600px width       |        700px width          |
```

### Left Side (Static Content)
- Position: `X: 60, Y: 200`
- Width: 600px
- This content **stays the same** across all 4 frames

### Right Side (Animation Area)
- Position: `X: 700, Y: 150`
- Size: 700 × 600px
- Background: White 40% opacity + Backdrop blur (20px)
- Border: 1px, White 60%
- Corner radius: 24px
- This area **changes** in each frame

---

## 🟢 LEFT SIDE CONTENT (STATIC - Create Once)

### Components (Top to Bottom)

#### 1. Badge
- **Position:** Top
- **Size:** Auto-layout horizontal
- **Padding:** 8px vertical, 16px horizontal
- **Background:** White 80% + Backdrop blur (20px)
- **Border:** 1px, Green (#2ECC71) 20%
- **Corner radius:** 24px (pill shape)
- **Shadow:** 0px 4px 12px rgba(0,0,0,0.08)

**Content:**
```
[Activity Icon 16×16] "AI-Powered Medical Technology"
```
- Icon: Green (#2ECC71)
- Text: 14px, SemiBold, Dark (#1F2D3D)
- Gap: 8px

#### 2. Main Heading
- **Font:** Poppins or Inter Bold
- **Size:** 56px (Desktop)
- **Color:** #1F2D3D (Dark Navy)
- **Line height:** 1.2
- **Margin bottom:** 24px

**Text:**
```
AI-Powered
Anemia Detection
```
"Anemia Detection" should be colored **#2ECC71** (Green)

#### 3. Subtext
- **Font:** Regular
- **Size:** 18px
- **Color:** #1F2D3D with 70% opacity
- **Max width:** 520px
- **Line height:** 1.6
- **Margin bottom:** 32px

**Text:**
```
Smart medical screening begins with care. Experience 
non-invasive anemia detection through advanced 
conjunctiva analysis.
```

#### 4. CTA Button
- **Size:** Auto-layout
- **Padding:** 24px vertical, 32px horizontal
- **Background:** White
- **Border:** 2px, Green (#2ECC71) 20%
- **Corner radius:** 30px
- **Shadow:** 0px 12px 24px rgba(46, 204, 113, 0.15)

**Content:**
```
[Upload Icon 20×20] "Start Screening"
```
- Icon + Text: Green (#2ECC71)
- Font: 18px, SemiBold
- Gap: 8px

**Hover State:**
- Transform: Scale 1.05
- Shadow: Stronger (0px 16px 32px)

#### 5. Scene Indicator Dots (Bottom)
- **Margin top:** 48px
- **Layout:** Horizontal, 8px gap

Create 4 dots:
- **Inactive:** Width 8px, Height 8px, Circle, Green 30%
- **Active:** Width 32px, Height 8px, Rounded rectangle, Green 100%

#### 6. Scene Description Text
- **Position:** Below dots
- **Font:** 14px, Medium
- **Color:** Dark 60%
- **Margin top:** 16px

**Text changes per scene:**
- Scene 1: "Patient arrives at hospital"
- Scene 2: "Patient enters medical facility"
- Scene 3: "Doctor approaches for examination"
- Scene 4: "Medical screening in progress"

---

## 🎬 3️⃣ CREATE 4 ANIMATION FRAMES

### Frame Naming Convention
1. `Scene 1 - Patient Outside`
2. `Scene 2 - Patient Entering`
3. `Scene 3 - Doctor Approaching`
4. `Scene 4 - Doctor Treating`

### How to Set Up
1. Create the first frame completely
2. Duplicate it 3 times (Cmd/Ctrl + D)
3. Rename each duplicate
4. Modify ONLY the right animation area in each frame

---

## 🚶 SCENE 1 - PATIENT OUTSIDE HOSPITAL

### Background
- Import hospital building image
- Position: Right side (X: 300)
- Size: Cover the right 60% of the scene
- Opacity: 80%
- Add gradient overlay: White 80% → Transparent (left to right)

### Hospital Sign (Blue Cross)
- **Position:** Top right (X: 520, Y: 80)
- **Size:** 80 × 80px
- **Background:** #3498DB (Medical Blue)
- **Corner radius:** 16px
- **Shadow:** 0px 8px 16px rgba(52, 152, 219, 0.3)

**Content:**
- White plus symbol (+): 40px, Bold
- Text "HOSPITAL": 10px, White, Bold

**Animation:**
- Scale: 0 → 1
- Rotate: -10° → 0°
- Duration: 600ms
- Delay: 500ms
- Easing: Spring

### Patient Character
- **Position:** Left side (X: 100, Y: 350)
- **Size:** 128 × 128px
- **Shape:** Circle
- **Border:** 4px, White
- **Shadow:** 0px 12px 24px rgba(0,0,0,0.15)

**Import:** Patient walking image (realistic photo or illustration)

**Shadow Under Patient:**
- Position: Below patient (Y offset: 8px)
- Size: 96 × 16px
- Shape: Ellipse
- Color: Black 10%
- Blur: 12px

---

## 🚪 SCENE 2 - PATIENT ENTERING

### Background
- Import hospital entrance/door image
- Position: Center
- Size: Fill frame
- Opacity: 60%
- Add gradient: White 60% → Transparent

### Patient Character
- **Position:** Center (X: 350, Y: 350)
- **Size:** 160 × 160px (larger)
- **Border:** 4px, White
- **Shadow:** Stronger (0px 16px 32px)

**Key Changes from Scene 1:**
- Patient moved from left (X: 100) to center (X: 350)
- Slightly larger size (128px → 160px)
- Stronger shadow (closer to camera)

### Entrance Arrow (Guide)
- **Position:** Right side (X: 550, Y: 300)
- **Size:** 64 × 64px
- **Background:** #2ECC71 (Green)
- **Shape:** Circle
- **Shadow:** 0px 8px 16px

**Icon:** Right arrow (→), White, Bold stroke

**Animation:**
- Slide in from left (X: -50 → 0)
- Opacity: 0 → 1
- Duration: 800ms
- Delay: 300ms

---

## 👨‍⚕️ SCENE 3 - DOCTOR APPROACHING

### Background
- Import hospital interior/corridor image
- Position: Fill
- Opacity: 50%
- Add gradient: White 40% → Transparent → White 60% (top to bottom)

### Patient Character
- **Position:** Right side (X: 500, Y: 350)
- **Size:** 144 × 144px
- **Border:** 4px, White
- **Shadow:** 0px 14px 28px

**Patient is now positioned on the right, waiting for doctor**

### Doctor Character (Main Focus)
- **Position:** Left side (X: 120, Y: 340)
- **Size:** 176 × 176px
- **Shape:** Circle
- **Border:** 4px, #2ECC71 (Green border for doctor)
- **Shadow:** 0px 16px 32px rgba(46, 204, 113, 0.2)

**Import:** Doctor in white coat image (professional photo)

**Gradient Overlay on Doctor:**
- Type: Linear, bottom to top
- Color: Green (#2ECC71) 10% → Transparent

### Doctor Badge
- **Position:** Top right of doctor circle (X offset: -16, Y: 16)
- **Size:** 48 × 48px
- **Background:** #2ECC71 (Green)
- **Shape:** Circle
- **Shadow:** 0px 4px 12px

**Icon:** Activity/heartbeat icon, White, 24px

**Animation:**
- Scale pulse: 1 → 1.1 → 1
- Duration: 2000ms
- Loop: Infinite

### Shadow Under Doctor
- Size: 128 × 20px
- Color: Black 15%
- Blur: 16px

---

## 🩺 SCENE 4 - DOCTOR TREATING

### Background
- Import examination room image
- Opacity: 40%
- Gradient overlay: White 50% → White 70%

### Medical Examination Bed
- **Position:** Bottom right (X: 450, Y: 400)
- **Size:** 192 × 128px
- **Background:** White 90% + Backdrop blur
- **Border:** 2px, Blue (#3498DB) 30%
- **Corner radius:** 16px
- **Shadow:** 0px 8px 24px

**Bed Icon (Top Right):**
- Size: 32 × 32px
- Background: Blue (#3498DB)
- Circle with medical icon (💊)

### Patient on Bed
- **Position:** Above bed, slightly right (X: 500, Y: 320)
- **Size:** 128 × 128px
- **Border:** 4px, White
- **Circle crop**

**Breathing Animation:**
- Scale: 1 → 1.02 → 1
- Duration: 2500ms
- Loop: Infinite
- Easing: Ease In-Out

### Doctor - Examining Position
- **Position:** Center-left (X: 250, Y: 340)
- **Size:** 192 × 192px (largest)
- **Border:** 4px, Green (#2ECC71)
- **Shadow:** Strongest (0px 20px 40px)

**Rotation Animation:**
- Rotate: 0° → -8° → 0° → -8° → 0°
- Duration: 3000ms
- Loop: Infinite
- This simulates the doctor leaning in to examine

### Stethoscope
- **Position:** Bottom right of doctor (X offset: 40, Y: 60)
- **Size:** 64 × 64px
- **Background:** #E74C3C (Red)
- **Shape:** Circle
- **Border:** 4px, White
- **Shadow:** 0px 6px 16px

**Icon:** Activity/heartbeat, White, 32px

**Animation:**
- Rotate: 0° → 20° → 0°
- Scale: 1 → 1.1 → 1
- Duration: 3000ms
- Loop: Infinite
- This simulates active examination

### Medical Monitor (Top Left)
- **Position:** (X: 80, Y: 100)
- **Size:** 160 × 120px
- **Background:** #1F2D3D (Dark Navy)
- **Border:** 2px, Green (#2ECC71) 50%
- **Corner radius:** 16px
- **Shadow:** 0px 8px 16px

**Content:**
```
[Green pulsing dot 12×12] "Scanning..."
98%
Analysis Complete
```

**Styling:**
- Dot: Green, pulsing animation
- "Scanning...": 12px, White 80%
- "98%": 24px, Bold, Green
- "Analysis Complete": 10px, White 60%

**Pulsing Dot Animation:**
- Opacity: 1 → 0.3 → 1
- Duration: 1000ms
- Loop: Infinite

### IV Stand (Top Right)
- **Position:** (X: 570, Y: 140)
- **Size:** 64 × 128px
- **Background:** Gradient Blue (#3498DB → #2980B9)
- **Corner radius:** 8px
- **Shadow:** 0px 8px 16px

**Structure:**
- Top circle: 32 × 32px, White 90%
- Connecting line: 4px width, White 60%
- Animated height: 48px → 40px → 48px (drip effect)

---

## 🔗 4️⃣ PROTOTYPE CONNECTIONS (CRITICAL)

### Connection 1: Scene 1 → Scene 2
**Settings:**
- **Trigger:** After Delay
- **Delay:** 800ms
- **Animation:** Smart Animate
- **Duration:** 900ms
- **Easing:** Ease In-Out

**What Animates:**
- Patient moves from left to center
- Patient scales up
- Background changes
- Arrow appears

### Connection 2: Scene 2 → Scene 3
**Settings:** Same as above

**What Animates:**
- Patient moves to right
- Doctor enters from left
- Background changes to interior
- Doctor badge appears

### Connection 3: Scene 3 → Scene 4
**Settings:** Same as above

**What Animates:**
- Patient moves to bed position
- Doctor moves closer and rotates
- Medical equipment appears
- Stethoscope appears

### Connection 4: Scene 4 → Scene 1 (Loop Back)
**Settings:**
- **Trigger:** After Delay
- **Delay:** 2800ms (longer, to show treatment)
- **Animation:** Smart Animate
- **Duration:** 900ms
- **Easing:** Ease In-Out

**Effect:** Creates infinite loop story

---

## ✨ 5️⃣ FLOATING BACKGROUND ELEMENTS

Add these across ALL frames (same layer):

### Medical Icons (Floating)
Create 8 floating icons distributed across the background:

**Icon Types:** Heart, Activity/ECG, Pulse, Medical Cross

**Styling:**
- Size: 64 × 64px
- Color: Green (#2ECC71) or Blue (#3498DB)
- Opacity: 3-8% (very subtle)

**Positions:** Spread across top and middle areas

**Animation (Smart Animate won't handle these, note for developers):**
- Vertical float: Y movement ±30px
- Duration: 4-8 seconds (vary per icon)
- Loop: Infinite

---

## 🎨 6️⃣ COLOR STYLE LIBRARY

Create these color styles in Figma:

### Primary Colors
- `Primary/Green`: #2ECC71
- `Primary/Blue`: #3498DB
- `Primary/Red`: #E74C3C

### Background Colors
- `Background/Soft Green`: #E8F8F5
- `Background/Soft Blue`: #D6EAF8
- `Background/White`: #FFFFFF
- `Background/Light`: #F4F9F9

### Text Colors
- `Text/Primary`: #1F2D3D
- `Text/Secondary`: #1F2D3D at 70%
- `Text/Tertiary`: #1F2D3D at 60%

### Effects
- `White Overlay 40`: White at 40%
- `White Overlay 60`: White at 60%
- `Black Shadow 15`: Black at 15%

---

## 📦 7️⃣ REQUIRED ASSETS (Download Before Starting)

### Realistic Illustrations/Photos
You need to source:

1. **Hospital Building** (exterior, modern)
   - Source: Unsplash, Pexels
   - Search: "modern hospital exterior"

2. **Hospital Entrance** (door, lobby)
   - Source: Unsplash
   - Search: "hospital entrance modern"

3. **Hospital Interior** (corridor, room)
   - Source: Unsplash
   - Search: "hospital interior clean"

4. **Doctor** (professional, white coat)
   - Source: Unsplash, Freepik
   - Search: "doctor professional white coat"

5. **Patient** (walking, casual)
   - Source: Unsplash
   - Search: "person walking hospital"

6. **Examination Room** (bed, equipment)
   - Source: Unsplash
   - Search: "medical examination room"

### Alternative: Vector Illustrations
If you prefer illustrations:

**Sources:**
- **Storyset.com** (Free, customizable, realistic style)
  - Search: "Hospital scene", "Doctor patient"
  - Download as SVG, import to Figma
  
- **Freepik.com** (Free account required)
  - Search: "Hospital illustration realistic"
  - Filter: Vector, Free
  
- **Undraw.co** (Free, no attribution)
  - Search: "Medical", "Doctor"
  - Customize colors to match palette

**Important:** Use consistent style across all scenes (all photos OR all illustrations from same pack).

---

## 🎯 8️⃣ DESIGN BEST PRACTICES

### Consistency
- ✅ Use the same border width (4px) for all character circles
- ✅ Use the same shadow style within each scene
- ✅ Keep corner radius consistent (8px, 16px, 24px)

### Hierarchy
- Largest element in Scene 4 (Doctor treating - most important)
- Patient smaller in Scene 1 (far away)
- Patient medium in Scene 2 (entering)

### Depth
- Add shadows under all characters (creates floating effect)
- Stronger shadows = closer to viewer
- Background always slightly blurred/faded

### Animation Timing
- Each scene should last ~2.8 seconds
- Smooth 900ms transitions between scenes
- Use Ease In-Out for natural motion

### Accessibility
- Ensure text has sufficient contrast (4.5:1 minimum)
- Don't rely on color alone for information
- Keep animations smooth (avoid jarring movements)

---

## 🔍 9️⃣ TESTING YOUR PROTOTYPE

### Present Mode
1. Select first frame (Scene 1)
2. Press **Cmd/Ctrl + Enter** to enter Present mode
3. Watch the full story animation loop

### Check For:
- ✅ Smooth transitions between scenes
- ✅ No jumping or jerky movements
- ✅ Characters move naturally
- ✅ Text remains readable throughout
- ✅ Consistent timing across all scenes
- ✅ Loop back works seamlessly

### Common Issues:
- **Characters jump:** Ensure same layer names across frames
- **No animation:** Check Smart Animate is selected
- **Too fast/slow:** Adjust delay and duration times
- **Blurry images:** Use high-resolution assets (2x minimum)

---

## 📱 🔟 MOBILE RESPONSIVE VARIANT

Create a mobile version:

### Frame Setup
- **Size:** 390 × 844 (iPhone standard)
- **Layout:** Single column (stack vertically)

### Changes:
- Left content moves to top, centered
- Animation scene below, full width
- Reduce font sizes by 30%
- Smaller character circles
- 2 scenes instead of 4 (Scene 2 and Scene 4 only)
- Faster transitions (600ms instead of 900ms)

---

## ✅ FINAL CHECKLIST

Before calling it complete:

**Design:**
- [ ] All 4 frames created and named
- [ ] Left content identical across all frames
- [ ] Right animation area unique per frame
- [ ] All images imported and properly sized
- [ ] Color styles applied consistently
- [ ] Shadows and blurs added
- [ ] Border radius consistent

**Prototype:**
- [ ] Scene 1 → Scene 2 connected
- [ ] Scene 2 → Scene 3 connected
- [ ] Scene 3 → Scene 4 connected
- [ ] Scene 4 → Scene 1 connected (loop)
- [ ] All delays set to 800ms (2800ms for last)
- [ ] All animations set to Smart Animate
- [ ] All durations set to 900ms
- [ ] All easing set to Ease In-Out

**Content:**
- [ ] Scene indicator dots update per frame
- [ ] Scene description text changes per frame
- [ ] All text readable and properly styled
- [ ] Button hover state created

**Polish:**
- [ ] Background floating icons added
- [ ] All animations tested in Present mode
- [ ] Export settings configured
- [ ] Components organized in layers panel

---

## 🎓 ADVANCED TIPS

### Performance
- Keep image file sizes under 500KB each
- Use JPEG for photos, PNG for illustrations
- Apply effects in Figma (don't import pre-blurred images)

### Reusability
- Create components for:
  - Patient character (variant per scene)
  - Doctor character (variant per scene)
  - Medical icons
  - Buttons

### Handoff to Developers
- Use proper naming conventions
- Group related elements
- Add notes for complex animations
- Export assets at 2x and 3x
- Provide color hex codes

### Presentation Tips
- Record the animation using Figma's screen recording
- Export as video for client presentations
- Create a style guide page with colors and typography
- Add descriptions for each scene's purpose

---

## 📚 RESOURCES

### Learning Smart Animate
- Figma Official Documentation: https://help.figma.com/hc/en-us/articles/360039818874
- YouTube: "Figma Smart Animate Tutorial"

### Design Inspiration
- Dribbble: Search "medical website animation"
- Behance: Search "healthcare hero section"

### Free Assets
- Unsplash: https://unsplash.com
- Pexels: https://pexels.com
- Storyset: https://storyset.com
- Undraw: https://undraw.co
- Freepik: https://freepik.com

### Icons
- Lucide Icons: https://lucide.dev
- Feather Icons: https://feathericons.com
- Heroicons: https://heroicons.com

---

## 🚀 EXPORT FOR DEVELOPMENT

When ready to hand off:

### Images
- Export all photos as PNG at 2x resolution
- Name them: `hospital-exterior.png`, `doctor.png`, etc.

### Colors
Export CSS variables:
```css
--primary-green: #2ECC71;
--primary-blue: #3498DB;
--soft-bg-green: #E8F8F5;
--soft-bg-blue: #D6EAF8;
--text-primary: #1F2D3D;
```

### Animation Timing
Document:
- Scene duration: 2800ms
- Transition duration: 900ms
- Easing: ease-in-out

### Spacing
- Element gap: 24px
- Section padding: 60px
- Character sizes: 128px, 144px, 160px, 192px

---

**Created for:** Anemia Detection AI Website  
**Design Type:** Story-Based Hero Animation  
**Framework:** 4-Frame Smart Animate Sequence  
**Tools:** Figma (Prototype Mode)  
**Style:** Professional Medical, Soft Colors, Realistic  
**Target:** Homepage Hero Section

---

## 💡 QUICK START SUMMARY

1. **Create frame** 1440×900, gradient background
2. **Add left content** (static): badge, heading, text, button, dots
3. **Create 4 frames:** Duplicate main frame 3 times
4. **Scene 1:** Patient left, hospital building right
5. **Scene 2:** Patient center, entrance door
6. **Scene 3:** Patient right, doctor left
7. **Scene 4:** Patient on bed, doctor examining
8. **Connect all frames** with Smart Animate (900ms, Ease In-Out)
9. **Loop back** Scene 4 → Scene 1
10. **Test** in Present mode

Done! You now have a professional medical website hero animation in Figma! 🎉
