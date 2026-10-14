import { FileSpreadsheet, PieChart, BarChart3, Download } from "lucide-react";

export const metadata = {
  title: "Báo cáo & Phân tích | FlowSync Treasury Ops",
  description: "Báo cáo phân tích chuyên sâu dòng tiền và dự báo lưu chuyển tiền tệ",
};

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider mb-1 font-bold">
            <span className="text-indigo-600">Phân tích Tài chính</span>
            <span className="text-slate-300">•</span>
            <span>Forecast & Runway Model</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Báo cáo & Dự báo Lưu chuyển Tiền tệ
          </h1>
        </div>

        <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
          <Download className="w-4 h-4 text-slate-500" />
          <span>Tải Báo cáo PDF Ban Giám Đốc</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rgb-card-light p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Phân bổ Chi phí Vận hành</h3>
              <p className="text-xs text-slate-400">Theo phòng ban & danh mục</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-4 leading-relaxed">
            Hạ tầng Cloud & Nhân sự chiếm 62% tổng chi phí tháng. Biên an toàn duy trì ở mức 3.8 tháng chi phí cố định.
          </p>
        </div>

        <div className="rgb-card-light p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-pink-50 text-pink-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Dự báo Dòng tiền 90 Ngày</h3>
              <p className="text-xs text-slate-400">Mô hình AI Monte Carlo</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-4 leading-relaxed">
            Dự kiến thu thêm 42 tỷ VNĐ từ hợp đồng gia hạn Q4. Không có rủi ro thiếu hụt thanh khoản trong 180 ngày tới.
          </p>
        </div>

        <div className="rgb-card-light p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Hiệu quả Thu hồi Công nợ</h3>
              <p className="text-xs text-slate-400">DSO (Days Sales Outstanding)</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-4 leading-relaxed">
            DSO trung bình giảm từ 28 ngày xuống 19 ngày nhờ luồng đối soát tự động theo thời gian thực.
          </p>
        </div>
      </div>
    </div>
  );
}
