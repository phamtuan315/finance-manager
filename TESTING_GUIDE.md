# 🧪 TESTING GUIDE - Authentication System

## ⚙️ CẤU HÌNH SUPABASE CHO DEVELOPMENT

### Bước 1: Tắt Email Confirmation (Khuyến nghị cho dev)

1. Truy cập **Supabase Dashboard**: https://supabase.com/dashboard
2. Chọn project `finance-manager`
3. Vào **Settings** (biểu tượng ⚙️  ở sidebar)
4. Click **Authentication**
5. Scroll xuống tìm **"Enable email confirmations"**
6. **Tắt (Toggle OFF)** option này
7. Click **Save** ở cuối trang

### Bước 2: (Optional) Xóa test users cũ

Vào **Authentication > Users**, xóa các test users đã tạo trước đó (nếu có).

---

## 🎯 TEST AUTHENTICATION FLOW

### Test 1: Signup (Đăng ký)

1. **Mở trình duyệt:** http://localhost:5176/
2. Bạn sẽ tự động được redirect đến `/login`
3. Click link **"Đăng ký ngay"** (màu xanh)
4. **Điền form:**
   - Họ và tên: `Nguyễn Văn A`
   - Email: `nguyenvana@gmail.com`
   - Mật khẩu: `password123`
   - Xác nhận mật khẩu: `password123`
5. Click nút **"Đăng ký"**
6. **Expected result:**
   - Message: "Đăng ký thành công!" ✅
   - Tự động redirect đến Dashboard sau 2 giây
   - Thấy tên "Nguyễn Văn A" trên Navbar

### Test 2: Verify Database (Kiểm tra database)

1. **Vào Supabase Dashboard**
2. **Check Authentication > Users:**
   - Thấy user mới với email `nguyenvana@gmail.com`
   - Status: Confirmed (nếu đã tắt email confirmation)
3. **Check Table Editor > profiles:**
   - Thấy 1 row với:
     - `full_name`: "Nguyễn Văn A"
     - `email`: "nguyenvana@gmail.com"
4. **Check Table Editor > categories:**
   - Thấy 13 rows (categories mặc định)
   - 4 categories type `income` (Lương, Thưởng, Đầu tư, Khác)
   - 9 categories type `expense` (Ăn uống, Di chuyển, etc.)

### Test 3: Dashboard View

1. Ở trang Dashboard, verify:
   - ✅ Navbar hiển thị tên user
   - ✅ 4 stat cards (💰 💸 💳 📊)
   - ✅ "Chưa có giao dịch nào"
   - ✅ Nút "Đăng xuất" màu đỏ

### Test 4: Logout (Đăng xuất)

1. Click nút **"Đăng xuất"** trên Navbar
2. **Expected result:**
   - Tự động redirect về `/login`
   - Session bị xóa

### Test 5: Protected Route

1. Sau khi logout, thử truy cập trực tiếp:
   - http://localhost:5176/dashboard
2. **Expected result:**
   - Tự động redirect về `/login`
   - Không thể access dashboard khi chưa login

### Test 6: Login (Đăng nhập)

1. Ở trang `/login`, điền:
   - Email: `nguyenvana@gmail.com`
   - Mật khẩu: `password123`
2. Click **"Đăng nhập"**
3. **Expected result:**
   - Thành công login ✅
   - Redirect đến Dashboard
   - Thấy lại tên user trên Navbar

### Test 7: Wrong Password

1. Logout
2. Thử login với password sai
3. **Expected result:**
   - Hiển thị error message màu đỏ
   - "Invalid login credentials"
   - Không redirect

### Test 8: Already Logged In

1. Đang ở trạng thái logged in
2. Thử access `/login` hoặc `/signup`
3. **Expected result:**
   - Có thể access được (chưa implement auto-redirect)
   - Nếu đăng ký user mới, sẽ logout user hiện tại

---

## ✅ CHECKLIST

- [ ] Email confirmation đã được tắt trong Supabase
- [ ] Signup thành công với user mới
- [ ] Profile tự động được tạo trong database
- [ ] 13 categories mặc định được tạo
- [ ] Dashboard hiển thị đúng thông tin user
- [ ] Logout thành công
- [ ] Protected route hoạt động (redirect về login)
- [ ] Login với credentials đúng thành công
- [ ] Login với password sai hiển thị error
- [ ] Session persistence (reload trang vẫn đăng nhập)

---

## 🐛 TROUBLESHOOTING

### Lỗi: "Email not confirmed"

**Nguyên nhân:** Email confirmation vẫn đang được bật

**Giải pháp:**
1. Vào Supabase Dashboard > Settings > Authentication
2. Tắt "Enable email confirmations"
3. Xóa test users cũ
4. Đăng ký lại

### Lỗi: Categories không được tạo

**Nguyên nhân:** Database triggers chưa chạy hoặc lỗi

**Giải pháp:**
1. Kiểm tra SQL Editor có lỗi không
2. Chạy lại file `supabase-schema.sql`
3. Verify triggers trong Database > Functions

### Lỗi: "Invalid login credentials"

**Nguyên nhân:**
- Password sai
- User chưa confirmed (nếu email confirmation ON)
- User chưa tồn tại

**Giải pháp:**
- Check lại password
- Tắt email confirmation
- Verify user trong Authentication > Users

### Dev server không chạy

**Giải pháp:**
```bash
cd finance-manager
npm run dev
```

---

## 📝 TEST SCRIPTS

Đã tạo 3 test scripts:

1. **test-auth.js** - Kiểm tra Supabase connection và tables
   ```bash
   node test-auth.js
   ```

2. **test-signup.js** - Test full signup/login/logout flow
   ```bash
   node test-signup.js
   ```

3. **check-triggers.js** - Kiểm tra profiles và categories trong DB
   ```bash
   node check-triggers.js
   ```

---

## 🎉 SUCCESS CRITERIA

**Authentication Phase 1 hoàn thành khi:**

✅ User có thể đăng ký tài khoản mới
✅ Profile tự động được tạo với full_name
✅ 13 categories mặc định được tạo cho user
✅ User có thể login với credentials
✅ User có thể logout
✅ Protected routes hoạt động
✅ Session persistence (reload page vẫn đăng nhập)
✅ UI/UX đẹp và responsive

---

**Happy Testing! 🚀**
