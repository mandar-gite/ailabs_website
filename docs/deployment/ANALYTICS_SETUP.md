# Analytics Setup Guide

## Google Analytics 4 Setup

### Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon in bottom left)
3. In the **Property** column, click **Create Property**
4. Enter property details:
   - **Property name:** 72° AI Labs
   - **Time zone:** India Standard Time (IST)
   - **Currency:** Indian Rupee (INR)
5. Click **Next** and fill in business information
6. Click **Create** and accept terms

### Step 2: Get Your Tracking ID

1. In Admin > Property > Data Streams
2. Click **Add stream** > **Web**
3. Enter website details:
   - **Website URL:** https://72ai.in
   - **Stream name:** 72° AI Labs Website
4. Click **Create stream**
5. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 3: Add Tracking ID to Website

1. Create a `.env` file in the project root (if it doesn't exist):

```bash
touch .env
```

2. Add your GA4 tracking ID:

```env
PUBLIC_GA4_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual tracking ID.

### Step 4: Verify Installation

1. **Local testing:**
   ```bash
   npm run dev
   ```
   - Open http://localhost:4321
   - Open browser DevTools > Console
   - Look for GA4 network requests to `google-analytics.com`

2. **Production verification:**
   - After deploying, go to GA4 > Reports > Realtime
   - Visit your live site
   - You should see your visit appear in realtime report within 30 seconds

### Step 5: Configure Enhanced Measurement (Optional)

In GA4 > Admin > Data Streams > Your Stream > Enhanced measurement:

Enable these automatic events:
- ✓ Page views
- ✓ Scrolls (90% depth)
- ✓ Outbound clicks
- ✓ Site search
- ✓ File downloads
- ✓ Form interactions

---

## Microsoft Clarity Setup (Optional but Recommended)

Clarity provides heatmaps and session recordings for free.

### Step 1: Create Clarity Account

1. Go to [Microsoft Clarity](https://clarity.microsoft.com/)
2. Sign up with Microsoft account (free)
3. Click **Add new project**
4. Enter:
   - **Project name:** 72° AI Labs
   - **Website URL:** https://72ai.in
5. Copy your **Project ID** (format: alphanumeric string)

### Step 2: Add Clarity ID to Website

Add to your `.env` file:

```env
PUBLIC_CLARITY_ID=your_clarity_project_id
```

### Step 3: Verify Installation

1. Go to Clarity dashboard
2. Wait 2-3 minutes after visiting your site
3. Check if recordings appear under **Recordings** tab

---

## Custom Event Tracking

The website includes a utility file for tracking custom events.

### Usage Example

```typescript
import { analytics } from '@/utils/analytics';

// Track form submission
analytics.formSubmit('contact_form');

// Track button click
analytics.buttonClick('Get Started', 'hero_section');

// Track CTA click
analytics.ctaClick('Contact Us', '/contact');

// Track problem selection
analytics.problemSelect('Data scattered across systems');

// Track project view
analytics.projectView('FastAccounting', 'Finance Automation');
```

### Pre-configured Events

The following events are ready to track:

- **Form Events:** `form_start`, `form_submit`, `form_error`
- **Buttons:** `button_click`
- **CTAs:** `cta_click`
- **Navigation:** `link_click`
- **Problem Selection:** `problem_select`
- **Project Views:** `project_view`
- **Engagement:** `scroll_depth`
- **External Links:** `external_link_click`
- **Downloads:** `file_download`
- **Video:** `video_play`
- **WhatsApp:** `whatsapp_click`

---

## Recommended GA4 Custom Reports

### 1. Conversion Funnel Report

Track: Homepage → Problem Selection → Form Start → Form Submit

**Custom Exploration:**
1. GA4 > Explore > Blank
2. Add events in sequence:
   - `page_view` (page_location contains "72ai.in")
   - `problem_select`
   - `form_start`
   - `form_submit`
3. Visualize as funnel

### 2. CTA Performance Report

**Custom Report:**
- Dimension: `event_name`, `button_name`, `click_location`
- Metric: Event count
- Filter: `event_name = button_click OR cta_click`

### 3. Project Interest Report

**Custom Report:**
- Dimension: `project_name`, `project_category`
- Metric: Event count
- Filter: `event_name = project_view`

---

## Key Metrics to Monitor

### Week 1 Baseline
- [ ] Total users
- [ ] Page views
- [ ] Average session duration
- [ ] Bounce rate
- [ ] Top pages

### Ongoing Tracking
- [ ] Form submissions (conversions)
- [ ] CTA click-through rates
- [ ] Problem selection patterns
- [ ] Project page views
- [ ] User journey paths
- [ ] Traffic sources
- [ ] Device breakdown

---

## Privacy & GDPR Compliance

### Current Setup (Compliant)
✓ GA4 automatically anonymizes IP addresses
✓ No PII collected in events
✓ Analytics load conditionally (only if env vars set)

### Recommended (Future Phase)
- [ ] Add cookie consent banner
- [ ] Update privacy policy to mention GA4 + Clarity
- [ ] Provide opt-out mechanism
- [ ] Add data retention settings (14 months default)

---

## Troubleshooting

### Events not showing in GA4

1. **Check console for errors:**
   - Open DevTools > Console
   - Look for GA4-related errors

2. **Verify tracking ID:**
   - Check `.env` file has correct `PUBLIC_GA4_ID`
   - Format must be `G-XXXXXXXXXX`

3. **Check network requests:**
   - DevTools > Network tab
   - Filter for "google-analytics"
   - Should see requests to `google-analytics.com/g/collect`

4. **Wait for processing:**
   - Realtime reports: 30 seconds
   - Standard reports: 24-48 hours

### Clarity not recording

1. **Verify script loads:**
   - View page source
   - Search for "clarity.ms"
   - Script should be present in `<head>`

2. **Check project status:**
   - Clarity dashboard > Settings
   - Status should be "Active"

3. **Clear browser cache and try again**

---

## Next Steps

After analytics is running:

1. **Set up conversion events in GA4:**
   - Mark `form_submit` as conversion
   - Track conversion rate

2. **Create custom audiences:**
   - "Engaged users" (session > 2 min)
   - "Problem selectors" (clicked problem)
   - "High intent" (viewed multiple projects)

3. **Set up alerts:**
   - Form submission spike/drop
   - Traffic anomalies
   - Error rate increases

4. **Weekly review:**
   - Check top pages
   - Review conversion funnel
   - Identify drop-off points
   - Adjust content/UX accordingly

---

## Cost

**Google Analytics 4:** Free (up to 10 million events/month)
**Microsoft Clarity:** Free (unlimited)

**Total:** $0/month
