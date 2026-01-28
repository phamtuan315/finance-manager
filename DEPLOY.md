# Hướng dẫn Deploy lên Vercel

## Bước 1: Chuẩn bị

1. **Tạo tài khoản Vercel**
   - Truy cập https://vercel.com
   - Đăng ký/Đăng nhập bằng GitHub account

2. **Chuẩn bị Supabase**
   - Đảm bảo đã chạy schema SQL trong Supabase Dashboard
   - Lấy Project URL và Anon Key từ Settings > API

## Bước 2: Deploy từ GitHub

### Cách 1: Deploy qua Vercel Dashboard (Khuyến nghị)

1. Truy cập https://vercel.com/new
2. Import repository `phamtuan315/finance-manager`
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./finance-manager`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add Environment Variables:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

5. Click "Deploy"

### Cách 2: Deploy qua Vercel CLI

1. Cài đặt Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Đi vào thư mục project:
   ```bash
   cd finance-manager
   ```

3. Login vào Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. Thêm environment variables:
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

6. Deploy production:
   ```bash
   vercel --prod
   ```

## Bước 3: Cấu hình Domain (Optional)

1. Vào Vercel Dashboard > Settings > Domains
2. Thêm custom domain của bạn
3. Cấu hình DNS records theo hướng dẫn

## Bước 4: Cấu hình Supabase

1. Vào Supabase Dashboard > Settings > API
2. Thêm Vercel deployment URL vào "Site URL"
3. Thêm URL vào "Redirect URLs" cho authentication:
   ```
   https://your-app.vercel.app/**
   ```

## Kiểm tra

1. Truy cập URL deployment
2. Test đăng ký/đăng nhập
3. Test các tính năng CRUD
4. Kiểm tra responsive trên mobile

## Troubleshooting

### Lỗi 404 khi refresh page
- Đảm bảo có file `vercel.json` với rewrites config

### Lỗi kết nối Supabase
- Kiểm tra environment variables
- Đảm bảo VITE_ prefix

### Build failed
- Kiểm tra dependencies trong package.json
- Clear cache: `vercel --force`

## Auto-deployment

Vercel tự động deploy khi:
- Push code lên branch main (production)
- Tạo pull request (preview deployment)

## Monitoring

- Dashboard: https://vercel.com/dashboard
- Analytics: Xem traffic và performance
- Logs: Xem build và runtime logs
