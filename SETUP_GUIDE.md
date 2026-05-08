# Manabbondhu NGO Website - Setup Guide

## Features

### 1. Membership System
- **Photo Upload**: Members can upload their profile photo (JPG, PNG - Max 5MB)
- **ID Card Generation**: Automatic ID card PDF download with member details
- **Member Database**: All applications stored in Supabase
- **Admin Approval**: Admin dashboard to approve/reject membership applications

### 2. Dynamic CMS
- **Site Content Editor**: Edit all homepage text content from admin dashboard
- **Gallery Management**: Add/edit/delete images for different sections
- **Real-time Updates**: Changes reflect immediately on the website

### 3. Admin Dashboard
- **Content Management**: Hero, Stats, About, Services, CTA sections
- **Gallery Management**: Image upload and organization by section
- **Member Management**: View and approve/reject membership applications
- **Message Management**: View and manage contact form submissions
- **User Management**: Promote/demote admin roles

## Setup Instructions

### 1. Supabase Configuration

#### Create Storage Bucket
Navigate to Supabase dashboard and call the init-storage edge function to create the `member-photos` bucket:

```bash
curl -X POST https://your-supabase-url/functions/v1/init-storage \
  -H "Authorization: Bearer your-anon-key"
```

Or it will be created automatically on first photo upload attempt.

#### Storage Bucket Policy
If you need to set it up manually, go to Supabase Storage and ensure the `member-photos` bucket has:
- **Name**: `member-photos`
- **Public**: Yes (enabled)
- **Policy**: Allow authenticated users to upload and read

### 2. First-Time Admin Setup

1. Go to `/admin/login`
2. Click **"First-time Setup"**
3. Enter admin credentials (email, password, full name)
4. Click **"Create Admin Account"**
5. Sign in with your credentials

### 3. Environment Variables for Vercel

Add these to your Vercel project (Settings > Environment Variables):

```
VITE_SUPABASE_URL=https://fqmtuoqrlkhgolkhwloe.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxbXR1b3FybGtoZ29sa2h3bG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMjk1NjYsImV4cCI6MjA5MzcwNTU2Nn0.fQraoQJdWtm0_yFjS3jMftbcbcpRK8HL-eBTmrCBswE
```

## Member Registration Flow

### 1. User Fills Membership Form
- Personal details (name, email, phone, DOB, occupation)
- Address information (address, city, state, pincode)
- Membership type selection (General, Volunteer, Lifetime)
- Motivation text
- **Photo upload** (optional but recommended)

### 2. Admin Reviews Application
- Go to Admin Dashboard > Members
- View pending applications
- Approve or reject applications

### 3. Member Gets ID Card
- Upon successful application, member receives ID card
- ID card includes:
  - Manabbondhu logo
  - Member photo
  - Member details (name, email, phone, location)
  - Unique membership ID
  - Membership date
  - Membership type
- Download as PDF button for easy printing/storage

## Admin Dashboard Sections

### Content Management
- **Hero Section**: Badge, title, description, CTAs
- **Statistics**: 4 stat blocks with values and labels
- **About Section**: Subtitle, paragraphs, stat badge
- **Services Section**: 3 service cards with titles and descriptions
- **CTA Section**: Call-to-action title, description, buttons

### Gallery Management
- Organize images by section (hero, about, services, gallery)
- Add images with alt text and optional captions
- Edit or delete existing images
- Drag to reorder (sort_order field)

### Members Management
- View all membership applications
- Filter by status (pending, approved, rejected)
- Search members by name or email
- Approve or reject pending applications
- Toggle approval status for existing members

### Messages Management
- View all contact form submissions
- See message details (name, email, subject, message)
- Delete messages

### Users Management
- View all system users
- Promote users to admin role
- Demote admins to regular users

## Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **PDF Generation**: jsPDF + html2canvas
- **Icons**: Lucide React
- **Deployment**: Vercel

## Database Schema

### Members Table
```sql
CREATE TABLE members (
  id uuid PRIMARY KEY
  full_name text
  email text
  phone text
  address text
  city text
  state text
  pincode text
  date_of_birth date
  occupation text
  membership_type text
  why_join text
  photo_url text
  status text (default: 'pending')
  created_at timestamptz
)
```

### Site Content Table
```sql
CREATE TABLE site_content (
  id uuid PRIMARY KEY
  section text
  key text
  value text
  created_at timestamptz
  UNIQUE(section, key)
)
```

### Gallery Images Table
```sql
CREATE TABLE gallery_images (
  id uuid PRIMARY KEY
  section text
  url text
  alt text
  caption text
  sort_order int
  created_at timestamptz
)
```

## Security

- **RLS Enabled**: All tables have Row Level Security
- **Public Read**: Site content and gallery images are public
- **Admin Only**: Only admins can create/edit/delete content
- **User Photos**: Stored securely in Supabase Storage
- **Authentication**: Supabase Auth for admin dashboard

## Troubleshooting

### Photos Not Uploading
1. Check if `member-photos` bucket exists in Supabase Storage
2. Verify bucket is set to public
3. Check browser console for error messages
4. Ensure file is under 5MB

### Admin Dashboard Not Loading
1. Verify you're signed in as an admin
2. Check environment variables are correctly set
3. Clear browser cache and try again

### Content Not Appearing
1. Save changes in admin dashboard
2. Refresh the website
3. Check database queries in Supabase dashboard

## Support

For issues or questions, contact the development team or check the Supabase documentation at https://supabase.com/docs
