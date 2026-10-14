# 🏛️ QUY TRÌNH QUẢN LÝ GIT & CI/CD ENTERPRISE (FLOWSYNC)

Tài liệu này chuẩn hóa toàn bộ luồng làm việc **Git Branching, Commit, Pull Request, Review, Merge và Tự động hóa CI/CD** theo tiêu chuẩn của các hệ thống doanh nghiệp lớn.

---

## 1. 🌿 Chiến Lược Nhánh (Branching Strategy - Git Flow & Trunk-Based)

Hệ thống sử dụng mô hình kết hợp chặt chẽ với các quy tắc bảo vệ nhánh (Branch Protection Rules):

```text
  main (Production) ───────────────────────────● [Release Tag v1.0.0]
         ▲                                     │ (Hotfix merge back)
         │ (PR + Tag Release)                  ▼
  staging (Pre-prod / UAT) ─────────────●──────●
         ▲                              ▲
         │ (PR sau khi test)            │
  develop (Integration) ────────●───────┴──────●
         ▲                      ▲
         │ (PR + CI pass)       │
  feature/FLOW-101-kpi-cards ───┘
```

### 1.1. Các nhánh cố định (Protected Branches)
| Nhánh | Mục đích | Quyền hạn | Cơ chế Deploy |
|---|---|---|---|
| **`main`** | Chạy môi trường **Production**. Chỉ chứa mã nguồn ổn định nhất. | **Khóa push trực tiếp**. Bắt buộc qua PR có tối thiểu 2 approvals. | Tự động build Docker tag `prod-<sha>` và deploy lên Production Cluster. |
| **`staging`** | Chạy môi trường **UAT / Staging**. Dành cho QA & ban lãnh đạo kiểm thử. | Khóa push trực tiếp. Merge từ `develop` qua PR. | Tự động build tag `staging-<sha>` và deploy lên VPS Staging. |
| **`develop`** | Nhánh tích hợp code hàng ngày của toàn bộ đội ngũ kỹ thuật. | Khóa push trực tiếp. Merge từ các nhánh `feature/*`. | Tự động chạy CI kiểm tra tính toàn vẹn (Quality Gate). |

### 1.2. Các nhánh làm việc tạm thời (Working Branches)
- **Tính năng mới**: `feature/FLOW-<id>-<mo-ta-ngan>` (ví dụ: `feature/FLOW-102-bank-sync-api`)
- **Sửa lỗi thường**: `bugfix/FLOW-<id>-<mo-ta-ngan>` (ví dụ: `bugfix/FLOW-105-fix-chart-overlap`)
- **Sửa lỗi khẩn cấp (Hotfix)**: Nhánh rẽ trực tiếp từ `main`: `hotfix/FLOW-<id>-<mo-ta-ngan>` -> Sau khi sửa xong, merge ngược lại cả `main` và `develop`.

---

## 2. 📝 Quy Chuẩn Đặt Tên Commit (Conventional Commits)

Dự án cài sẵn **Husky + Commitlint**. Nếu tên commit không đúng định dạng sau, Git sẽ **từ chối lệnh commit ngay trên máy của bạn**:

### 2.1. Cấu trúc chuẩn
```text
<type>(<scope>): <mô tả ngắn bằng tiếng Việt hoặc tiếng Anh>
```

### 2.2. Danh sách `<type>` hợp lệ:
- `feat`: Tính năng mới (ví dụ: `feat(cashflow): thêm biểu đồ lưu chuyển tiền tệ`)
- `fix`: Sửa lỗi (ví dụ: `fix(auth): sửa lỗi không lưu cookie token`)
- `refactor`: Tối ưu code mà không đổi logic (ví dụ: `refactor(ajax): tái cấu trúc server service keepalive`)
- `perf`: Tối ưu hiệu năng tải trang / giảm re-render
- `docs`: Cập nhật tài liệu kỹ thuật
- `style`: Thay đổi định dạng giao diện, khoảng cách CSS
- `ci`: Thay đổi pipeline GitHub Actions, Jenkins, Dockerfile
- `chore`: Cập nhật dependencies, cấu hình lặt vặt

### 2.3. Danh sách `<scope>` thông dụng:
`auth`, `cashflow`, `transactions`, `integrations`, `routes`, `ui`, `store`, `deps`, `docker`.

---

## 3. 🛡️ Cơ Chế Bảo Vệ Local (Pre-commit & Commit-msg Hooks)

Ngay khi bạn gõ `git commit`:
1. **`pre-commit` hook**: Tự động kích hoạt `lint-staged`. Chỉ quét và sửa tự động các file bạn vừa sửa (`.ts`, `.tsx`), đảm bảo không có code rác lọt lên git.
2. **`commit-msg` hook**: Kích hoạt `commitlint` để kiểm tra tiêu đề commit.

---

## 4. 🚀 Quy Trình Từ Viết Code Đến Deploy (PR & CI/CD Lifecycle)

### Bước 1: Tạo nhánh và viết code
```bash
git checkout develop
git pull origin develop
git checkout -b feature/FLOW-101-kpi-card
# ... viết code ...
git add .
git commit -m "feat(dashboard): thêm hiệu ứng rgb glowing cho thẻ kpi"
git push origin feature/FLOW-101-kpi-card
```

### Bước 2: Tạo Pull Request (PR)
1. Mở GitHub/GitLab, chọn tạo PR từ `feature/FLOW-101-kpi-card` vào `develop`.
2. Điền đầy đủ thông tin theo mẫu tự động [`.github/pull_request_template.md`](file:///.github/pull_request_template.md).

### Bước 3: Tự Động Chạy Quality Gate (GitHub Actions CI)
Pipeline CI [`.github/workflows/ci.yml`](file:///.github/workflows/ci.yml) sẽ tự động chạy:
- 🔍 **ESLint Check**: Kiểm tra quy chuẩn code sạch.
- 📦 **TypeScript Strict Check**: `tsc --noEmit` quét lỗi kiểu dữ liệu.
- 🏗️ **Next.js Standalone Build**: Thử nghiệm build thật để đảm bảo không gãy build trên production.

> [!IMPORTANT]
> Nếu 1 trong 3 bước trên bị ĐỎ (Fail), GitHub sẽ **tự động khóa nút Merge**. Developer bắt buộc phải sửa lỗi và push lại.

### Bước 4: Review Code (Peer Review & Codeowner)
- Cần tối thiểu **1 đến 2 senior/tech-lead** approve.
- Sử dụng hình thức **Squash and Merge** để giữ lịch sử commit của nhánh chính luôn tinh gọn.

### Bước 5: Tự Động Triển Khai (CD Pipeline)
Khi PR được merge:
- Vào `staging` ➔ Kích hoạt build Docker image `staging-latest`, deploy lên server kiểm thử.
- Vào `main` ➔ Kích hoạt đóng gói bản Production, gắn tag SemVer, triển khai **Zero-Downtime Rolling Update** qua Docker Compose trên máy chủ.
