/** Single place for site-wide constants. vite.config.ts reads REPO_NAME too. */
export const REPO_NAME = 'NLP_Notes';
export const SITE_NAME = 'NLP Notes';

/**
 * Every page of the site, declared once. The router, the navbar tabs and the content build all read
 * this list. `source` is the only Markdown file the build reads for the page: it never scans
 * folders, so the study notes next to it in content/midterm/ are ignored.
 */
export const PAGES = [
  { id: 'midterm', route: '/midterm', tab: 'Midterm', source: 'content/midterm/exam_practice.md' },
] as const;

export type PageId = (typeof PAGES)[number]['id'];

/** The route that `/` redirects to. */
export const DEFAULT_ROUTE = PAGES[0].route;

/** Thai labels shown to students, see UI-SPEC.md section 1. */
export const UI_TEXT = {
  loading: 'กำลังโหลด...',
  loadError: 'โหลดเนื้อหาไม่สำเร็จ ลองอีกครั้ง',
  retry: 'ลองอีกครั้ง',
  notFound: 'ไม่พบหน้านี้',
  backToMidterm: 'กลับไปหน้า Midterm',
  comingSoon: 'กำลังจัดทำ',
  skipToContent: 'ข้ามไปยังเนื้อหา',
  solutions: 'แสดงเฉลย',
  solutionsShort: 'เฉลย',
  showSolution: 'ดูเฉลย',
  hideSolution: 'ซ่อนเฉลย',
  startExam: 'เริ่มทำข้อสอบ',
  points: 'คะแนน',
  statQuestions: 'ข้อใหญ่',
  statItems: 'หัวข้อย่อย',
  statExamples: 'โจทย์',
  statPoints: 'คะแนนรวม',
  railOpen: 'เปิดสารบัญ',
  railClose: 'ปิดสารบัญ',
  railLabel: 'สารบัญ',
  backToTop: 'กลับขึ้นบน',
  readingProgress: 'ความคืบหน้าการอ่าน',
  updateReady: 'มีเวอร์ชันใหม่ พร้อมใช้งาน',
  updateAction: 'โหลดใหม่',
  offlineReady: 'ใช้งานออฟไลน์ได้แล้ว',
  dismiss: 'ปิด',
} as const;
