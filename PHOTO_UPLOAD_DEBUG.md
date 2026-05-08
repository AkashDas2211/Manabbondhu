# Photo Upload & ID Card Display - Troubleshooting Guide

## How It Works

### Photo Upload Flow
1. **User uploads photo** in membership form
2. **Member record created** in database with empty photo_url
3. **Photo uploaded** to Supabase Storage (`member-photos` bucket)
4. **Photo URL stored** in members table (photo_url field)
5. **ID Card displays** with photo from database

### Data Flow
```
Upload Form
    ↓
member table (initial insert with empty photo_url)
    ↓
Supabase Storage (photo file uploaded)
    ↓
member table (updated with photo_url)
    ↓
Admin Dashboard retrieves member data
    ↓
ID Card component displays photo_url
```

## Key Components

### 1. Membership Form (`src/pages/Membership.tsx`)
- Accepts photo file upload
- Validates file size (max 5MB) and type (JPG, PNG)
- Shows preview before submission
- Uploads to Supabase Storage after member record created
- Updates member record with photo URL

### 2. ID Card Component (`src/components/IDCardDownload.tsx`)
- Receives member object with photo_url
- Displays photo in portrait ID card
- Uses html2canvas + jsPDF for PDF generation
- Supports CORS from Supabase Storage URLs

### 3. Admin Dashboard (`src/pages/AdminDashboard.tsx`)
- Fetches members with all fields including photo_url
- Shows "ID Card" button only for approved members
- Opens modal with ID card preview
- Allows download of ID card as PDF

## Database Schema

### Members Table
```sql
CREATE TABLE members (
  id uuid PRIMARY KEY,
  full_name text,
  email text,
  phone text,
  city text,
  state text,
  membership_type text,
  status text DEFAULT 'pending',
  photo_url text DEFAULT '',  -- Stores Supabase Storage public URL
  created_at timestamptz DEFAULT now(),
  ...
);
```

### Storage Bucket
```
Bucket: member-photos
Public: true
Path format: members/{memberId}-{timestamp}.{ext}
Example: members/a1b2c3d4-1234567890.jpg
```

## Common Issues & Solutions

### Issue: Photo Not Showing in ID Card

**Cause 1: Photo URL not saved to database**
- Check: Open browser DevTools > Network tab
- Look for failed requests to Supabase API
- Solution: Ensure upload completes before update query

**Cause 2: Storage bucket doesn't exist**
- Check: Go to Supabase dashboard > Storage
- Solution: Bucket is created automatically on first upload
- Fallback: Run migration `create_member_photos_bucket`

**Cause 3: CORS issue with photo URL**
- Check: Browser console for CORS errors
- Solution: Ensure Supabase bucket is set to public
- html2canvas configured with CORS support

**Cause 4: Photo URL invalid or expired**
- Check: Copy URL from database and test in browser
- Solution: Public URLs from Supabase Storage don't expire
- Format should be: `https://{subdomain}.supabase.co/storage/v1/object/public/member-photos/members/{filename}`

### Issue: Upload Fails

**Cause 1: File too large**
- Solution: Max file size is 5MB
- Check file size before upload

**Cause 2: Invalid file type**
- Solution: Only JPG and PNG accepted
- Check file extension and MIME type

**Cause 3: No internet connection**
- Solution: Check network connectivity
- Retry upload when connection restored

**Cause 4: Storage bucket not created**
- Solution: Run init-storage edge function
- Or manually create bucket in Supabase dashboard

## Debugging Steps

### 1. Check Database
```sql
-- Verify member has photo_url
SELECT id, full_name, photo_url, status FROM members WHERE id = '{member_id}';
```

### 2. Check Storage
- Go to Supabase Dashboard > Storage > member-photos
- Verify files exist in `members/` folder
- Check file permissions (should be public)

### 3. Check URL
- Copy photo_url from database
- Paste in browser address bar
- Should display the photo

### 4. Check Browser Console
- Open DevTools > Console
- Look for error messages during upload
- Check Network tab for failed requests

### 5. Check Member Record Fetch
- In Admin Dashboard, open DevTools > Network
- Look for `/members` query response
- Verify photo_url field is present and populated

## Testing Checklist

- [ ] Upload photo in membership form
- [ ] Photo preview displays correctly
- [ ] Form submission succeeds
- [ ] Member record created in database
- [ ] Photo file appears in Storage > member-photos
- [ ] Admin approves membership
- [ ] Admin clicks "ID Card" button
- [ ] ID Card modal opens
- [ ] Photo displays in ID card
- [ ] Download PDF includes photo
- [ ] PDF opens correctly in reader

## Configuration Files

### Environment Variables (.env)
```
VITE_SUPABASE_URL=https://fqmtuoqrlkhgolkhwloe.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Supabase Client (src/lib/supabase.ts)
- Uses anon key for public access
- Credentials in environment variables
- CORS enabled for Supabase domain

## Performance Tips

1. **Compress photos before upload**
   - Use image compression tools
   - Recommended: 500-1000 KB per photo

2. **Optimize ID Card PDF generation**
   - html2canvas runs client-side (no server load)
   - Scale set to 3 for high quality
   - Consider reducing for faster generation

3. **Cache management**
   - Supabase Storage URLs are permanent
   - No need to clear cache
   - Photos persist indefinitely

## Security

### RLS Policies
- Public read access to photos
- Authenticated users can upload
- Only admins can approve members

### Data Privacy
- Photos stored in secure Supabase Storage
- Public URL generated for display
- No sensitive data in photo metadata

### File Validation
- Server-side type checking (if added)
- Client-side size validation (5MB)
- Unique filenames prevent conflicts

## Support

For additional help:
1. Check Supabase documentation: https://supabase.com/docs/guides/storage
2. Review error messages in browser console
3. Check database queries in Supabase dashboard
4. Verify network connectivity and bucket permissions
