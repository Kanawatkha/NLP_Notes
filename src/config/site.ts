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
  points: 'คะแนน',
  statQuestions: 'ข้อใหญ่',
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

/** The numbers and the title shown in the hero. Set by hand until the exam has all its questions. */
export const HERO = {
  title: 'Midterm Practice Exam',
  questions: 5,
  points: 20,
  /** The five questions of the exam and their points (from exam_guidelines.md); they add up to `points`. */
  parts: [
    { no: 1, name: 'Intro to NLP', points: 1 },
    { no: 2, name: 'Tokenization', points: 2 },
    { no: 3, name: 'Word Segmentation, POS Tagging และ Sequence Labeling', points: 10 },
    { no: 4, name: 'Syntax and Parsing', points: 4 },
    { no: 5, name: 'Word Embedding', points: 3 },
  ],
} as const;
