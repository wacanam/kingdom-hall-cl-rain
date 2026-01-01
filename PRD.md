# Planning Guide

Kingdom Hall CleanSync 2026 is a mobile-first scheduling application that helps Diclum Congregation members view their assigned cleaning dates for the Kingdom Hall throughout 2026, with seamless calendar integration.

**Experience Qualities**: 
1. **Serene** - The interface should feel calm and peaceful, using soft colors and generous spacing to create a stress-free experience
2. **Effortless** - Navigation between groups and viewing schedules should be intuitive with zero learning curve
3. **Reliable** - Users should instantly trust the schedule data and calendar export functionality

**Complexity Level**: Light Application (multiple features with basic state)
This is a straightforward scheduling viewer with group selection, date filtering, and calendar export functionality - it doesn't require complex state management or authentication.

## Essential Features

**Group Selection Interface**
- Functionality: Displays 6 group cards (Groups 1-6) for user selection
- Purpose: Allows users to quickly identify and select their assigned cleaning group
- Trigger: App launch or "Change Group" button press
- Progression: App loads → User sees welcome hero → User taps group card → Smooth transition to dashboard
- Success criteria: Selected group persists in state and user reaches their personalized dashboard

**Next Assignment Hero Card**
- Functionality: Identifies and displays the very next upcoming cleaning assignment from today's date
- Purpose: Provides immediate visibility into the most relevant information - when the user needs to clean next
- Trigger: Group selection or dashboard view
- Progression: Dashboard loads → Algorithm finds next date ≥ today → Displays date + task type → Shows "Coming Soon" badge if within 3 days
- Success criteria: Correct next date displayed with proper task type (Main Hall or CR), proximity badge appears when appropriate

**Calendar Export (.ics generation)**
- Functionality: Generates downloadable .ics file containing all 2026 assignments for selected group
- Purpose: Enables users to integrate cleaning schedule into their personal calendar apps
- Trigger: User taps "📅 Add to My Calendar" button
- Progression: User taps button → Algorithm filters all 2026 dates for group → Generates .ics with all-day events → Browser downloads file → Success toast appears
- Success criteria: Valid .ics file downloads, imports correctly into calendar apps (Google Calendar, Apple Calendar, Outlook), toast notification confirms success

**Full Schedule Timeline**
- Functionality: Displays scrollable vertical timeline of all remaining 2026 assignments
- Purpose: Provides comprehensive view of year-long schedule for planning ahead
- Trigger: Dashboard view after group selection
- Progression: Dashboard loads → Master schedule filtered by group → Dates rendered as timeline → User scrolls to view future dates
- Success criteria: All dates displayed in chronological order with correct task badges, clear visual distinction between Main Hall and CR assignments

## Edge Case Handling

- **No Upcoming Dates**: If user views schedule after last 2026 date, display message "All 2026 cleaning complete! Thank you for your service."
- **Same-Day Assignment**: If today is a cleaning day, the "Next Up" card should show today with special "Today!" badge
- **Browser Compatibility**: Ensure .ics download works across Chrome, Safari, Firefox, and mobile browsers
- **Small Screens**: Timeline cards stack properly on very narrow screens (320px+)
- **Rapid Group Switching**: Debounce or handle quick successive group selections gracefully

## Design Direction

The design should evoke feelings of peace, clarity, and spiritual purpose. Users should feel supported and organized, not overwhelmed. The interface should honor the sacred nature of caring for a place of worship while maintaining modern usability standards. Clean lines, generous whitespace, and thoughtful micro-interactions create an experience that feels both professional and warm.

## Color Selection

A calming, professional palette that balances trust with approachability.

- **Primary Color (Deep Royal Blue #2563EB)**: Communicates trust, reliability, and spiritual calm - used for primary actions and key interactive elements
- **Secondary Colors**: 
  - Slate-500 (#64748B) for body text - professional and highly readable
  - Slate-300 (#CBD5E1) for borders and subtle dividers
  - Emerald-500 (#10B981) for CR/Restroom task badges - represents cleanliness
  - Sky-500 (#0EA5E9) for Main Hall task badges - represents openness
- **Accent Color (Amber-500 #F59E0B)**: Warm, attention-grabbing highlight for the "Coming Soon" badge and special states
- **Foreground/Background Pairings**: 
  - Background (White #FFFFFF): Deep Royal Blue text (#2563EB) - Ratio 8.6:1 ✓
  - Background (White #FFFFFF): Slate-500 text (#64748B) - Ratio 5.8:1 ✓
  - Primary Blue (#2563EB): White text (#FFFFFF) - Ratio 8.6:1 ✓
  - Emerald badge (#10B981): White text (#FFFFFF) - Ratio 4.9:1 ✓
  - Amber badge (#F59E0B): White text (#FFFFFF) - Ratio 4.7:1 ✓

## Font Selection

Typography should feel modern, clean, and exceptionally readable on mobile devices with a clear visual hierarchy that guides the eye.

- **Typographic Hierarchy**: 
  - H1 (Hero Headline): Inter Bold/32px/tight letter-spacing (-0.02em) - Used for "Kingdom Hall Cleaning Schedule 2026"
  - H2 (Dashboard Title): Inter SemiBold/24px/normal letter-spacing - Used for "Group X Schedule"
  - H3 (Card Titles): Inter SemiBold/20px/normal letter-spacing - Used for "Next Up" and section headers
  - Body Large (Dates): Inter Medium/18px/relaxed line-height (1.6) - Used for date display in cards
  - Body Regular (Descriptions): Inter Regular/16px/relaxed line-height (1.6) - Used for general text
  - Small (Badges): Inter SemiBold/14px/uppercase/wide letter-spacing (0.05em) - Used for task type badges

## Animations

Animations should create a sense of smoothness and delight without slowing down task completion.

- **Page Transitions**: Crossfade with slight scale (0.95 → 1.0) when transitioning between Welcome and Dashboard (300ms ease-out)
- **Card Hover/Tap**: Subtle scale-up to 1.02 with soft shadow increase on group selection cards (150ms ease-out)
- **Button Press**: Scale down to 0.98 on press, bounce back to 1.0 (100ms ease-in-out) - creates satisfying tactile feedback
- **Timeline Entry**: Staggered fade-in as timeline items appear (50ms delay between items, 200ms duration)
- **Success Toast**: Slide-up from bottom with spring physics for calendar download confirmation
- **Badge Pulse**: Gentle pulse animation on "Coming Soon" and "Today!" badges (2s infinite ease-in-out)

## Component Selection

- **Components**: 
  - Card (shadcn) - Base component for group selection cards, Next Up hero, and timeline items with glassmorphism via backdrop-blur
  - Badge (shadcn) - Task type indicators (Main Hall/CR) and proximity alerts (Coming Soon/Today!)
  - Button (shadcn) - Primary CTA for calendar export and group change navigation
  - Separator (shadcn) - Visual dividers between timeline sections
  - ScrollArea (shadcn) - Smooth scrolling container for timeline
- **Customizations**: 
  - Glassmorphism cards: white background with bg-opacity-80, backdrop-blur-lg, and subtle border
  - Timeline design: Vertical timeline with circular icons (Main Hall = Home icon, CR = Droplet icon) in gradient circles (blue for upcoming, gray for past), connected by gradient vertical line
  - Timeline cards: Glass cards with hover scale effect, displaying day of week in small blue text, large date, and task badge
  - Hero icon: Dynamic rotating cleaning materials using Phosphor and Lucide icons (Broom, Toilet, Bathtub, Soap, Bucket, Droplet, Sparkles, Wind, Waves) that change every 2 seconds with smooth fade transitions
  - Next Up card: Full gradient background (blue-400 to blue-600) with floating animated cleaning icons (Broom, Sparkle, Heart, Sun/Droplets) that gently float around the card
  - Sticky header: Gradient blue header (blue-600 to blue-700) with white text, centered group number, and frosted glass "Change Group" button
  - Section headers: Small gradient bar accent (8px × 3px rounded) followed by bold uppercase text for visual hierarchy
- **States**: 
  - Group Cards: default (white + shadow), hover (scale + shadow increase), active (scale down + blue border)
  - Primary Button: default (blue + white text), hover (darker blue), pressed (scale down), loading (spinner + disabled state)
  - Timeline Items: upcoming (full opacity, blue gradient circle icon, glass card with shadow), past (70% opacity, gray gradient circle icon, muted card)
  - Badges: Main Hall (sky-500 bg), CR (emerald-500 bg), Coming Soon (amber-500 bg with pulse), Today (red-500 bg with pulse)
  - Change Group Button: frosted glass effect (white/20 bg with backdrop-blur), hover (white/30 bg), tap (scale down)
- **Icon Selection**: 
  - Dynamic cleaning materials (welcome hero) - rotating icons representing various cleaning tools and cleanliness
  - Calendar (export button) - universal symbol for calendar integration
  - ArrowLeft (back button) - standard navigation back
  - Check (task completion indicator) - confirms assignment
  - Home (Main Hall badge and timeline icon) - represents the main building
  - Droplet (CR badge and timeline icon) - represents water/restrooms
  - Broom, Sparkle, Heart, Sun, Moon (Next Up floating icons) - create friendly, welcoming atmosphere
- **Spacing**: 
  - Container padding: p-4 (16px) on mobile, p-6 (24px) on tablet+, pb-20 (80px) bottom padding to ensure last item is visible
  - Card gaps: gap-4 (16px) for group grid, gap-3 (12px) for timeline items (tighter for more compact feel)
  - Section spacing: space-y-8 (32px) between major sections, mb-12 (48px) for upcoming section
  - Internal card padding: p-6 (24px) for hero cards, p-5 (20px) for timeline items (increased for breathing room)
  - Timeline connector: left-[23px] positioning to align with center of circular icons
- **Mobile**: 
  - Group grid: 2 columns on mobile (grid-cols-2), 3 columns on tablet+ (md:grid-cols-3)
  - Hero card: Full width on mobile, max-w-2xl centered on desktop
  - Timeline: Single column at all breakpoints with full-width cards, flex-col on mobile, flex-row on desktop for card content
  - Button: Full width on mobile (w-full), auto width on desktop
  - Sticky header: Responsive layout with proper spacing, centered group info, and adequate button sizes for touch
  - Text sizing: Base 16px on mobile, scales up slightly (1.05x) on desktop for comfortable reading distance
