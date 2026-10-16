# บทที่ 1: Intro to NLP และ Tokenization

# ส่วนที่ 1: Intro to NLP (สไลด์ 1.1)

## 1. What is NLP

**NLP (Natural Language Processing)** คือศาสตร์ที่ผสาน Linguistics + Computer Science + AI เพื่อให้คอมพิวเตอร์ **เข้าใจ ตีความ และสร้าง** ภาษามนุษย์

- เป้าหมาย: แปลงระหว่างภาษามนุษย์ (ความหมาย) กับภาษาคอมพิวเตอร์

## 2. A Brief History of NLP (อ่านผ่านๆ)

ภาพรวม: ปรัชญา → กฎ (rule-based) → สถิติ → learned representations → Transformer ที่ pretrain ขนาดใหญ่

| ยุค | จุดสำคัญ |
|---|---|
| ก่อน 1960 | Turing Test (1950), Chomsky Hierarchy (1957), Machine Translation แบบ rule-based |
| 1960s–70s | BASEBALL (1961), Minsky's Inference Engine (1968), ATN (1970) |
| 1970s–80s | Grammatical Logic, SRI's CLE, DRT |
| 1980s–2000s | Hopfield Network, corpus-based ML, IBM DeepQA (2006) |
| 2010s–2017 | Big Data, RNN/LSTM, Word2Vec (2013), Seq2Seq/Attention (2014), Google NMT (2016) |
| 2017–2026 | Transformer (2017), BERT/GPT (2018–2020), ChatGPT (พ.ย. 2022), LLM ยุคใหม่ |

- Turing Test: A = เครื่อง, B = คน, C = ผู้ตัดสิน ถ้า C แยกไม่ออกว่าใครเป็นเครื่อง ถือว่าเครื่องผ่าน

## 3. Levels of Languages

เรียงจากในสุดไปนอกสุด:

| ระดับ | ศึกษา |
|---|---|
| Phonetics | เสียงพูด |
| Phonology | หน่วยเสียง (phonemes) |
| Morphology | คำ |
| Syntax | วลีและประโยค |
| Semantics | ความหมายตรงตัวของวลี/ประโยค |
| Pragmatics | ความหมายตามบริบท |

## 4. The 5 Steps in NLP

| ขั้น | ชื่อ | ทำอะไร |
|---|---|---|
| 1 | Lexical analysis | แยก Text เป็นย่อหน้า ประโยค คำ |
| 2 | Syntactic analysis | ไวยากรณ์และความสัมพันธ์ระหว่างคำ |
| 3 | Semantic analysis | ความหมายที่แน่นอนของประโยคเดียว |
| 4 | Discourse integration | ความหมายของประโยคโดยอิงประโยคก่อนหน้า (เช่น สรรพนาม) |
| 5 | Pragmatic analysis | ความหมายจริงตามบริบทและความรู้โลกจริง |

## 5. Upstream & Downstream Tasks

| | Upstream | Downstream |
|---|---|---|
| คืออะไร | เตรียมข้อมูลทางภาษา และ pre-training | งานประยุกต์ที่ต่อยอดจาก upstream (fine-tuning) |
| ตัวอย่าง | tokenization, tagging, parsing | classification, translation, Q&A |

Pipeline: Text → Tokenize + Normalize → POS Tagger → Syntactic Parsing → NER → Application

## 6. Main Components of NLP

ทำงานต่อกันเป็นลำดับ: **NLU → KAI → NLG**

| ส่วน | ชื่อเต็ม | หน้าที่ |
|---|---|---|
| NLU | Natural Language Understanding | ตีความความหมาย เจตนา และโครงสร้างของอินพุต |
| KAI | Knowledge Acquisition and Inferencing | ใช้ความรู้และการอนุมานเพื่อประมวลผลเจตนา |
| NLG | Natural Language Generation | สร้างข้อความหรือเสียงเป็นเอาต์พุต |

- จำง่ายๆ: ฟังเข้าใจ → คิดหาคำตอบ → พูดตอบ

## 7. Why NLP is Hard: Core Challenges

| ความท้าทาย | ความหมาย | ตัวอย่างจากสไลด์ |
|---|---|---|
| Abstractness (ความเป็นนามธรรม) | ความหมายไม่ตรงตัว | สวยกี่โมง = ไม่สวย, ได้อยู่ = ไม่ได้ |
| Combinability (ผสมกันได้) | คำรวมกันได้ไม่จำกัด เกิดความหมายใหม่ | แม่ / แม่น้ำ / แม่ยก / แม่ไม้มวยไทย, กับข้าว, ไปสบาย |
| Evolutiveness (มีวิวัฒนาการ) | ภาษาเปลี่ยนตลอด มีคำใหม่ | ใช่ไหม → ใช่ปะ → ช้ะ, เลิศ → เริ่ด, จะรั่ว |
| Nonstandardness (ไม่มีหลักการแน่นอน) | พิมพ์ผิด สำเนียงถิ่น ไวยากรณ์ไม่เป็นทางการ | กำลัง จะ ไป กินข้าว อยู่ แล้ว เขียนได้หลายแบบ |
| Subjectivity (ขึ้นกับบุคคล/บริบท) | น้ำเสียง อารมณ์ เจตนาต่างกันตามผู้พูดและบริบท | แกงส้ม–แกงเหลือง, "ไปส่ง"กินข้าว, เขา/เข่า/เข้า |

- ตัวช่วยจำ: **A-C-E-N-S**
- ตัวอย่างบางข้อในสไลด์เป็นภาพ ไม่มีเฉลย ถ้าอาจารย์อธิบายต่างจากนี้ให้ยึดอาจารย์

## 8. Why NLP is Hard: THAI NLP Challenges

- ปัญหาหลักคือ **Segmentation (การตัดคำ)** เพราะภาษาไทยเขียนติดกัน ไม่มีช่องว่างคั่นคำ
- มี 2 ระดับ: **Word segmentation** (ตัดคำ) และ **Sentence segmentation** (ตัดประโยค)
- ข้อความเดียวกันตัดได้หลายแบบ ความหมายจึงต่างกัน

## 9. NLP Applications

### เชิงเทคนิค

| งาน | คืออะไร |
|---|---|
| Text Classification | จัดข้อความเข้าหมวดที่กำหนด เช่น spam / ไม่ spam หรือหมวดหัวข้อข่าว |
| Sentiment Analysis | ตรวจว่าข้อความแสดงอารมณ์บวก ลบ หรือกลาง |
| Machine Translation | แปลข้อความจากภาษาหนึ่งเป็นอีกภาษา |
| Named Entity Recognition (NER) | หาและระบุชื่อเฉพาะในข้อความ เช่น คน สถานที่ วันที่ |
| Text Summarization | ย่อข้อความให้สั้นลงแต่ยังคงใจความสำคัญ |
| Question Answering | อ่านข้อความแล้วตอบคำถามให้ตรงจุด |

### โลกจริง

| งาน | คืออะไร |
|---|---|
| Voice Assistants | ผู้ช่วยสั่งงานด้วยเสียง เช่น Alexa, Google Assistant, Siri |
| Customer Chatbots | บอทตอบแชตลูกค้าอัตโนมัติแทนเจ้าหน้าที่ |
| Spam Filtering | คัดแยกอีเมลขยะและช่วยเรื่องความปลอดภัย |
| Predictive Typing | แก้คำผิดอัตโนมัติและแนะนำคำถัดไปตอนพิมพ์ |
| Translation Tools | เครื่องมือแปลภาษาเพื่อสื่อสารข้ามภาษา |
| Sentiment Tracking | ติดตามความรู้สึกของคนต่อเรื่องหนึ่งบนโซเชียลมีเดีย |
| Document Search | ค้นหาเอกสารและระบบแนะนำเนื้อหา |

## 10. Popular NLP Libraries

| ไลบรารี | จุดเด่น |
|---|---|
| NLTK | Python library คลาสสิก เหมาะกับสอนและวิจัย มี algorithm และ corpora เยอะ |
| spaCy | ระดับอุตสาหกรรม เร็ว พร้อมใช้งานจริง (tokenization, tagging, parsing, NER) |
| PyThaiNLP | toolkit โอเพนซอร์สสำหรับภาษาไทยโดยเฉพาะ |

---

# ส่วนที่ 2: Tokenization (สไลด์ 1.2)

## 1. Text as Data

หน่วยของข้อความมี 4 ระดับ:

| หน่วย | ความหมาย | ตัวอย่างจากสไลด์ |
|---|---|---|
| Words | หน่วยที่มีความหมายและยืนเดี่ยวได้เล็กที่สุดในประโยค | `"playing"` |
| Morphemes | หน่วยความหมายที่เล็กที่สุดภายในคำ (root, affix, suffix) | `"play"` + `"-ing"` |
| Unicode | อักขระแต่ละตัวถูก map เป็น code point สากล เป็นรากฐานของข้อความดิจิทัล | `U+0041 = "A"` |
| Subword (BPE) | แตกคำหายากเป็นชิ้นย่อยที่พบบ่อย เรียนรู้จาก corpus | `"un"` + `"play"` + `"able"` |

### หน่วยพื้นฐานของข้อความ

| ศัพท์ | ความหมาย |
|---|---|
| Corpus | ชุดข้อความ/คลังข้อมูลที่ใช้ฝึกโมเดล เช่น Brown Corpus, Wall Street Journal |
| Token | หน่วยย่อยของข้อความ ได้แก่ คำ สัญลักษณ์ เครื่องหมายวรรคตอน |
| Type | คำที่แตกต่างกัน (distinct) ในคลังข้อมูล |
| Word Form | รูปคำที่ปรากฏจริงในคลังข้อมูล (ผันรูป) |
| Stem / Lemma | Stem = รากศัพท์ (compute) / Lemma = รูปพจนานุกรมของคำที่ผันรูป (computers, computation) |

ตัวอย่าง Token กับ Type (ผมแต่งเพิ่มเพื่อให้เห็นความต่าง):

```text
ประโยค: "the cat saw the dog"
Token = 5 (the, cat, saw, the, dog)
Type  = 4 (the, cat, saw, dog)   เพราะ "the" ซ้ำ นับเป็น type เดียว
```

## 2. Normalization

**ปัญหาของ Raw text:** ตัวพิมพ์ใหญ่-เล็ก, เครื่องหมายวรรคตอน, คำย่อ, อีโมจิ

**Text Normalization Process:** ทำให้ข้อความประมวลผลง่ายขึ้น

- ตัวอย่างในสไลด์: **Penn Treebank tokenization** เป็นวิธี preprocessing แบบ rule-based (เช่น แยก `don't` เป็น `do` + `n't`)

### Normalization Pipeline (5 ขั้น)

| ขั้น | ชื่อ | ทำอะไร | ตัวอย่าง |
|---|---|---|---|
| 1 | Lowercasing | แปลงเป็นตัวพิมพ์เล็กทั้งหมด | `"Hello"` → `"hello"` |
| 2 | Punctuation Removal | ตัดหรือแยกเครื่องหมายวรรคตอนออกจากคำ | `"Hello,"` → `"Hello"` |
| 3 | Stop Word Removal | ตัดคำทั่วไปที่ไม่ค่อยมีความหมาย | ตัด `"the"`, `"is"`, `"at"` |
| 4 | Stemming / Lemmatization | ลดรูปคำผัน | `"running"` → `"run"` |
| 5 | Unicode Normalization | NFC/NFD รวมตัวอักษรที่มีเครื่องหมายกำกับให้เป็นรูปเดียว | `"é"` มีทั้งแบบตัวเดียวและแบบ `e` + เครื่องหมาย ให้เหลือรูปเดียว |

- Stemming ตัดท้ายคำตามกฎ (เช่น Porter: `running` → `run`, แต่ `computers` → `comput` ซึ่งอาจไม่ใช่คำจริง)
- Lemmatization คืนรูปพจนานุกรมที่เป็นคำจริง (เช่น `running` → `run`)

## 3. Regular Expressions (Regex)

Regex คือรูปแบบ (pattern) ที่ใช้ค้นหา จับคู่ หรือตัดข้อความ ทดลองออนไลน์ได้ที่ regex101.com

### ตัวอย่างจากสไลด์

| Pattern | หน้าที่ |
|---|---|
| `\w+` | จับ word token |
| `\d{4}-\d{2}-\d{2}` | จับวันที่ (YYYY-MM-DD) |
| `[A-Z][a-z]+` | จับคำขึ้นต้นด้วยตัวใหญ่ (ใบ้ให้ NER) |
| `\s+` | ตัดตาม whitespace |

### Anatomy of an Expression

| สัญลักษณ์ | ชื่อ | ความหมาย / ตัวอย่าง |
|---|---|---|
| `[ ]` | Character class | `[aeiou]` จับสระตัวใดก็ได้ |
| `*` `+` `?` | Quantifiers | `a+` = a หนึ่งตัวขึ้นไป |
| `^` `$` | Anchors | `^Hello` จับ Hello ที่ต้นสตริง |
| `( )` | Groups | `(ab)+` จับกลุ่ม ab ที่ซ้ำ |
| `\|` | Alternation | `cat\|dog` จับคำใดคำหนึ่ง |
| `\w` `\d` `\s` | Shorthand classes | คำ, ตัวเลข, ช่องว่าง |

- `*` = 0 ตัวขึ้นไป, `+` = 1 ตัวขึ้นไป, `?` = 0 หรือ 1 ตัว

## 4. Tokenization

**Tokenization** = การแบ่งข้อความเป็นหน่วยย่อย (tokens) เช่น คำ สัญลักษณ์ หรือหน่วยย่อยของคำ เพื่อให้คอมพิวเตอร์นำไปประมวลผลต่อได้

| ประเด็นจากสไลด์ | ใจความ |
|---|---|
| "How long is this text?" | จำนวนหน่วยขึ้นกับวิธี tokenize และ **1 token ≠ 1 word** |
| "don't" = 1 token หรือ 2? | `do` + `n't` ส่งผลต่อโมเดลที่ตามมา |
| Fixed tokenization | อัลกอริทึมส่วนใหญ่ (เช่น perplexity) ต้องการการแบ่ง token ที่คงที่ |

## 5. Tokenization Technique

### Word-Based Tokenization

- ตัดตาม whitespace หรือเครื่องหมายวรรคตอน
- ง่าย แต่พังกับ contractions, คำประสม และ **OOV (Out of Vocabulary)** คือคำที่ไม่อยู่ใน vocab

```text
"I love NLP"  →  ["I", "love", "NLP"]
"don't"       →  ["don", "'", "t"]        (ตัดตามเครื่องหมายแล้วความหมายเพี้ยน)
```

### Character-Based Tokenization

- ตัดทีละตัวอักษร
- ไม่มี OOV แต่ความหมายหาย และข้อความยาวเกินไป

```text
"I love NLP"  →  ["I", " ", "l", "o", "v", "e", " ", "N", "L", "P"]
```

### Subword Tokenization Methods

| วิธี | หลักการ |
|---|---|
| **BPE** (Byte Pair Encoding) | รวมคู่อักขระที่พบบ่อยเป็น subword ซ้ำไปเรื่อยๆ |
| **WordPiece** | คล้าย BPE แต่เลือกให้ likelihood ของ language model สูงสุด ใช้ใน BERT |
| **Unigram** | โมเดลความน่าจะเป็น เริ่มจาก vocab ใหญ่แล้วตัดทอนลง |

ตัวอย่างจากสไลด์: `"unplayable"` → `"un"` + `"play"` + `"able"`

## 6. Word-based → Subword (BPE / WordPiece)

วิวัฒนาการของ tokenization:

| | Word-based | Character-based | Subword (BPE/WordPiece) |
|---|---|---|---|
| แบ่งตาม | คำเต็ม | ตัวอักษร | หน่วยย่อยที่เรียนรู้จากข้อมูล |
| ข้อดี | ความหมายชัด | ไม่มี OOV | สมดุลระหว่างขนาด vocab กับความยาวลำดับ |
| ข้อเสีย | OOV, vocab ใหญ่เกิน | ลำดับยาวมาก เสียความหมายเชิงคำ | - |
| หมายเหตุ | | | มาตรฐานของ LLM ปัจจุบัน |

## 7. BPE Training

**หลักการ:** เริ่มจากตัวอักษร แล้ววนซ้ำ: นับคู่ที่ติดกันบ่อยที่สุด → merge เป็น token ใหม่ → เพิ่มเข้า vocab

### ตัวอย่างจากสไลด์

Corpus: `new` (x2), `renew` (x2), `set` (x1), `reset` (x1)

| ขั้น | ทำอะไร | ผลหลัง merge | vocab |
|---|---|---|---|
| 0 | เริ่มต้น แยกเป็นตัวอักษร | `n e w` / `r e n e w` / `s e t` / `r e s e t` | e, n, r, s, t, w |
| 1 | คู่ (n, e) พบ 4 ครั้ง (ใน new x2 และ renew x2) → merge เป็น `ne` | `ne w` / `r e ne w` / `s e t` / `r e s e t` | + `ne` |
| 2 | นับซ้ำ: (ne, w) พบ 4 ครั้ง → merge เป็น `new` | `new` / `r e new` / `s e t` / `r e s e t` | + `new` |
| 3 | ทำซ้ำ: (r, e) พบ 3 ครั้ง → merge เป็น `re` แล้ว (re, new) → `renew` | `new` / `renew` / `s e t` / `re s e t` | + `re`, `renew` |
| 4 | ทำซ้ำกับ set/reset: (s, e) → `se` แล้ว (se, t) → `set` | `new` / `renew` / `set` / `re set` | + `se`, `set` |

**ลำดับกฎ merge ที่เรียนรู้ (ต้องเก็บไว้ใช้ตอน encode):**

```text
1. (n, e)    → ne
2. (ne, w)   → new
3. (r, e)    → re
4. (re, new) → renew
5. (s, e)    → se
6. (se, t)   → set
```

> หมายเหตุ: ในขั้น 1 คู่ (e, w) ก็พบ 4 ครั้งเท่ากับ (n, e) สไลด์เลือก (n, e) โดยไม่บอกเกณฑ์ตัดสินเมื่อคะแนนเท่ากัน

## 8. BPE Encoder และการใช้งานจริง

### การเข้ารหัส (Encoding)

1. แบ่งประโยคทดสอบเป็นตัวอักษรก่อน
2. ใช้กฎ merge ที่เรียนรู้จาก training ไล่ทีละกฎ **ตามลำดับที่เรียนรู้มา**
3. ความถี่ใน test data **ไม่มีผล** ใช้แค่ลำดับกฎจาก training
4. คำที่ไม่เคยเห็น (unseen) ยังถูกแทนด้วย subword ที่รู้จักได้เสมอ

ตัวอย่างการ encode ด้วยกฎ 6 ข้อด้านบน (ผมคำนวณประกอบ ไม่ใช่ตัวอย่างจากสไลด์):

| คำ | ตัวอักษรเริ่มต้น | ผล encode | อธิบาย |
|---|---|---|---|
| `renew` | r e n e w | `renew` | กฎ 1 → 2 → 3 → 4 รวมเป็นคำเดียว |
| `resets` | r e s e t s | `re` `set` `s` | กฎ 3 ได้ `re`, กฎ 5-6 ได้ `set`, ตัว `s` ท้ายไม่มีกฎ merge จึงค้างเป็นตัวอักษร |
| `newest` (unseen) | n e w e s t | `new` `e` `s` `t` | กฎ 1-2 ได้ `new`, ส่วน `est` ไม่มีกฎที่ตรง (ไม่มีคู่ (e, s) หรือ (e, t) ใน merge) จึงเป็นตัวอักษร |

### ในทางปฏิบัติ

- รันบน **UTF-8 bytes (byte-level BPE)** เพื่อรองรับทุกภาษา/อักขระ รวมถึงภาษาไทย
- จำนวน merge ทั่วไป: 50,000 / 100,000 / 200,000 tokens (เช่น GPT-4o ประมาณ 200K)
- **ไม่มี unknown token** เพราะมีค่า byte พื้นฐานแค่ 256 ค่า
- ระบบหลายภาษาอาจมี token ถูกครอบงำโดยภาษาอังกฤษเป็นหลัก ทำให้ภาษาที่ resource น้อยเสียเปรียบ

## 9. BPE vs. WordPiece vs. Unigram LM (ULM)

| วิธี | หลักการเลือกคู่ที่จะ merge | ใช้งานใน |
|---|---|---|
| BPE | เลือกคู่ token ที่ปรากฏ "บ่อยที่สุด" | GPT-2/GPT-4o, RoBERTa |
| WordPiece | เลือกคู่ที่เพิ่ม likelihood ของ training data มากที่สุด | BERT |
| Unigram LM (ULM) | เริ่มจาก vocab ใหญ่แล้วตัดหน่วยที่มีผลต่อ likelihood น้อยออก | SentencePiece, T5, ALBERT |

**เป้าหมายร่วมของทั้งสามวิธี:** หาสมดุลระหว่างขนาด vocabulary กับความยาวของลำดับ token เพื่อให้โมเดล generalize ได้ดีและมีประสิทธิภาพเชิงคำนวณ

## 10. Thai Tokenization

**Core Challenge:** ภาษาไทยไม่มีช่องว่างระหว่างคำ เช่น "ฉันรักคุณ" ไม่เห็นขอบเขตคำ โมเดลต้องอนุมานจากบริบทและพจนานุกรม

### Dictionary-Based Word Segmentation

- ใช้ lexicon (พจนานุกรมคำไทย) ที่สร้างไว้ก่อน
- สแกนข้อความแล้วหาคำที่มีในพจนานุกรม
- ข้อดี: เร็วและอธิบายได้ / ข้อเสีย: จำกัดด้วยความครอบคลุมของคำ
- จุดอ่อนหลักคือ **OOV** เช่น ชื่อใหม่ คำสแลง

### Longest Matching Algorithm

- เป็น **greedy:** ทุกตำแหน่งจับคำที่ยาวที่สุดที่มีในพจนานุกรม
- **FMM (Forward Maximum Matching):** สแกนซ้ายไปขวา
- **BMM (Backward Maximum Matching):** สแกนขวาไปซ้าย
- **ปัญหา ambiguity:** อาจมีการตัดคำที่ถูกต้องได้หลายแบบ (ข้อความในสไลด์ส่วนนี้ถูกกล่องโค้ดบังบางส่วน)

ตัวอย่างจากสไลด์: PyThaiNLP ใช้ `word_tokenize("ฉันรักคุณ", engine="newmm")` ตัดคำ (newmm เป็น engine ตัวหนึ่ง) ผลที่คาดหวังคือ ฉัน / รัก / คุณ

ตัวอย่างความต่างของ FMM กับ BMM (ผมแต่งประกอบ ใช้พจนานุกรมเล็กๆ: ตา, ตาก, กลม, ลม):

| ข้อความ | FMM (ซ้าย → ขวา) | BMM (ขวา → ซ้าย) |
|---|---|---|
| ตากลม | ตาก / ลม (จับ "ตาก" ยาวสุดก่อน) | ตา / กลม (จับ "กลม" ยาวสุดจากท้ายก่อน) |

ทั้งสองวิธีได้ผลต่างกันกับข้อความเดียวกัน แสดงให้เห็นปัญหา ambiguity

## 11. ตัวอย่างโจทย์

ตัวอย่างโจทย์จากสไลด์ 1.2 (Tokenization) ที่ใช้ corpus เดียวกันตลอดทั้งสองข้อ ตัวเลขทุกตัวตรวจซ้ำด้วยโปรแกรมแล้ว

### ข้อ 1  จงตัดข้อความ `new renew new renew set reset` ด้วย word-based tokenization และ character-based tokenization แล้วนับจำนวน token ของแต่ละแบบ

$\mathbf{Sol}^{n}$

word-based ตัดตามช่องว่างได้คำละ 1 token ส่วน character-based ตัดทีละตัวอักษรและนับช่องว่างเป็น 1 token ด้วย

$$
\begin{aligned}
\text{word-based} &: [\text{new},\ \text{renew},\ \text{new},\ \text{renew},\ \text{set},\ \text{reset}] &&\Rightarrow 6\ \text{tokens} \\
\text{character-based} &: \text{n, e, w, (ช่องว่าง), r, e, n, e, w, (ช่องว่าง), n, e, w, (ช่องว่าง), } \ldots \\
\text{ตัวอักษร} &= 3+5+3+5+3+5 = 24 &&\text{new, renew, new, renew, set, reset} \\
\text{ช่องว่าง} &= 5 \\
\text{รวม} &= 24+5 = 29\ \text{tokens}
\end{aligned}
$$

$\mathbf{Ans}\quad$ word-based $= \mathbf{6}$ tokens, character-based $= \mathbf{29}$ tokens

---

### ข้อ 2  จาก corpus ของข้อ 1 คือ new (x2), renew (x2), set (x1), reset (x1) จง train BPE จำนวน 6 รอบ แสดงการนับคู่ในแต่ละรอบ ลำดับกฎ merge และ vocab สุดท้าย (ถ้าคู่ที่พบเท่ากัน ให้เลือกคู่ที่ปรากฏก่อนเมื่ออ่าน corpus จากซ้ายไปขวา)

$\mathbf{Sol}^{n}$

เริ่มจากแยกทุกคำเป็นตัวอักษร แล้ววนซ้ำ นับคู่ที่ติดกัน merge คู่ที่พบบ่อยที่สุดเป็น token ใหม่ และเพิ่มเข้า vocab

เริ่มต้น: `n e w` (x2), `r e n e w` (x2), `s e t` (x1), `r e s e t` (x1) และ $V_0=\{e,n,r,s,t,w\}$

| รอบ | นับคู่ที่ติดกัน (สูงสุดเป็นตัวหนา) | เลือก merge | corpus หลัง merge | vocab ที่เพิ่ม |
|:---:|:---|:---|:---|:---:|
| 1 | $\mathbf{(n,e)=4}$, $(e,w)=4$, $(r,e)=3$, $(e,n)=2$, $(s,e)=2$, $(e,t)=2$, $(e,s)=1$ | $(n,e)\to ne$ (เสมอกับ $(e,w)$ เลือกตัวที่ปรากฏก่อน) | `ne w` / `r e ne w` / `s e t` / `r e s e t` | $ne$ |
| 2 | $\mathbf{(ne,w)=4}$, $(r,e)=3$, $(e,ne)=2$, $(s,e)=2$, $(e,t)=2$, $(e,s)=1$ | $(ne,w)\to new$ | `new` / `r e new` / `s e t` / `r e s e t` | $new$ |
| 3 | $\mathbf{(r,e)=3}$, $(e,new)=2$, $(s,e)=2$, $(e,t)=2$, $(e,s)=1$ | $(r,e)\to re$ | `new` / `re new` / `s e t` / `re s e t` | $re$ |
| 4 | $\mathbf{(re,new)=2}$, $(s,e)=2$, $(e,t)=2$, $(re,s)=1$ | $(re,new)\to renew$ (เสมอกัน 3 คู่ เลือกตัวที่ปรากฏก่อน) | `new` / `renew` / `s e t` / `re s e t` | $renew$ |
| 5 | $\mathbf{(s,e)=2}$, $(e,t)=2$, $(re,s)=1$ | $(s,e)\to se$ (เสมอกัน เลือกตัวที่ปรากฏก่อน) | `new` / `renew` / `se t` / `re se t` | $se$ |
| 6 | $\mathbf{(se,t)=2}$, $(re,se)=1$ | $(se,t)\to set$ | `new` / `renew` / `set` / `re set` | $set$ |

ที่มาของตัวเลขบางตัว $(n,e)=4$ เพราะพบใน `new` x2 และ `renew` x2 ($2+2$), $(r,e)=3$ เพราะพบใน `renew` x2 และ `reset` x1 ($2+1$) และ $(s,e)=2$ เพราะพบใน `set` x1 และ `reset` x1 ($1+1$)

$\mathbf{Ans}$

$$
\begin{aligned}
&\text{กฎ merge:}\quad (n,e)\to ne,\ \ (ne,w)\to new,\ \ (r,e)\to re,\ \ (re,new)\to renew,\ \ (s,e)\to se,\ \ (se,t)\to set \\
&V_6=\{e,\ n,\ r,\ s,\ t,\ w,\ ne,\ new,\ re,\ renew,\ se,\ set\} \quad(6+6=12\ \text{ตัว})
\end{aligned}
$$
