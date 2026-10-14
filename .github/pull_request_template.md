## 📌 Mục đích thay đổi (Description)
<!-- Tóm tắt ngắn gọn tính năng, bugfix hoặc thay đổi kỹ thuật được giải quyết trong PR này -->

## 🔗 Liên kết Issue / Ticket
- Issue/Ticket ID: `FLOW-` hoặc `#`

## 🏷️ Loại thay đổi (Type of Change)
- [ ] 🚀 **Feature**: Tính năng mới
- [ ] 🐛 **Bugfix**: Sửa lỗi phát sinh
- [ ] ♻️ **Refactor**: Tối ưu mã nguồn, không làm thay đổi logic nghiệp vụ
- [ ] ⚡ **Performance**: Tối ưu hiệu năng, giảm re-render, tăng tốc độ tải
- [ ] 🔒 **Security**: Vá lỗ hổng bảo mật, cập nhật dependencies
- [ ] ⚙️ **CI/CD / DevOps**: Cập nhật pipeline, Dockerfile, scripts
- [ ] 📝 **Docs**: Cập nhật tài liệu

## 📸 Hình ảnh / Minh chứng (Screenshots / Recordings)
<!-- Đính kèm ảnh chụp màn hình UI hoặc video nếu có thay đổi giao diện -->

## 🛡️ Checklist kiểm soát chất lượng (Quality Gate)
- [ ] Code tuân thủ kiến trúc phân tầng BFF và các quy ước đặt tên của dự án.
- [ ] Đã chạy kiểm tra kiểu TypeScript (`pnpm type-check` hoặc `pnpm build`) không có lỗi.
- [ ] Đã chạy linter (`pnpm lint`) không còn warning/error.
- [ ] Không commit file chứa credentials, secrets (`.env`, private keys).
- [ ] Đã tự review lại code (Self-review) trước khi gán người đánh giá.
- [ ] Đã kiểm tra tương thích giao diện trên các kích thước màn hình chính.

## ⚠️ Rủi ro & Kế hoạch Rollback (Risk & Rollback Plan)
- **Mức độ rủi ro:** [ ] Thấp | [ ] Trung bình | [ ] Cao
- **Kế hoạch Rollback:** (Ví dụ: `git revert <merge-commit-hash>` hoặc redeploy image trước đó).
