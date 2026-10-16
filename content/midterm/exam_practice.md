# แนวข้อสอบกลางภาค การประมวลผลภาษาธรรมชาติ (Midterm Practice Exam)

## ข้อ 1 Intro to NLP (1 คะแนน)

**Natural Language Processing (NLP)** คือการทำให้คอมพิวเตอร์ เข้าใจ ตีความ และสร้าง ภาษามนุษย์ได้

### 1.1  NLP คืออะไร

**NLP (Natural Language Processing)** คือศาสตร์ที่ผสาน Linguistics, Computer Science และ AI เพื่อให้คอมพิวเตอร์ **เข้าใจ ตีความ และสร้าง** ภาษามนุษย์ เป้าหมายคือแปลงระหว่างภาษามนุษย์ (ความหมาย) กับภาษาคอมพิวเตอร์

**Turing Test** ใช้ทดสอบว่าเครื่องคิดได้เหมือนคนหรือไม่ โดย A = เครื่อง, B = คน, C = ผู้ตัดสิน ถ้า C แยกไม่ออกว่าใครเป็นเครื่อง ถือว่าเครื่องผ่าน

---

### 1.2  Levels of Languages

ภาษามี 6 ระดับ เรียงจากในสุดไปนอกสุด

| ระดับ | ศึกษา |
|:---|:---|
| Phonetics | เสียงพูด |
| Phonology | หน่วยเสียง (phonemes) |
| Morphology | คำ |
| Syntax | วลีและประโยค |
| Semantics | ความหมายตรงตัวของวลี/ประโยค |
| Pragmatics | ความหมายตามบริบท |

---

### 1.3  The 5 Steps in NLP

การประมวลผลภาษามี 5 ขั้น เรียงตามลำดับ

| ขั้น | ชื่อ | ทำอะไร |
|:---|:---|:---|
| 1 | Lexical analysis | แยก Text เป็นย่อหน้า ประโยค คำ |
| 2 | Syntactic analysis | ไวยากรณ์และความสัมพันธ์ระหว่างคำ |
| 3 | Semantic analysis | ความหมายที่แน่นอนของประโยคเดียว |
| 4 | Discourse integration | ความหมายของประโยคโดยอิงประโยคก่อนหน้า (เช่น สรรพนาม) |
| 5 | Pragmatic analysis | ความหมายจริงตามบริบทและความรู้โลกจริง |

---

### 1.4  Components และ Tasks

**Main Components** ทำงานต่อกันเป็นลำดับ NLU, KAI, NLG หรือจำง่ายๆ คือ ฟังเข้าใจ, คิดหาคำตอบ, พูดตอบ

| ส่วน | ชื่อเต็ม | หน้าที่ |
|:---|:---|:---|
| NLU | Natural Language Understanding | ตีความความหมาย เจตนา และโครงสร้างของอินพุต |
| KAI | Knowledge Acquisition and Inferencing | ใช้ความรู้และการอนุมานเพื่อประมวลผลเจตนา |
| NLG | Natural Language Generation | สร้างข้อความหรือเสียงเป็นเอาต์พุต |

**Upstream และ Downstream** แบ่งงานตามว่าเป็นการเตรียมข้อมูลหรือเป็นงานประยุกต์

| | Upstream | Downstream |
|:---|:---|:---|
| คืออะไร | เตรียมข้อมูลทางภาษา และ pre-training | งานประยุกต์ที่ต่อยอดจาก upstream (fine-tuning) |
| ตัวอย่าง | tokenization, tagging, parsing | classification, translation, Q&A |

Pipeline: Text → Tokenize + Normalize → POS Tagger → Syntactic Parsing → NER → Application

---

### 1.5  ความยากของ NLP

ความท้าทายหลัก 5 ข้อ จำง่ายๆ ว่า **A-C-E-N-S**

| ความท้าทาย | ความหมาย | ตัวอย่างจากสไลด์ |
|:---|:---|:---|
| Abstractness (ความเป็นนามธรรม) | ความหมายไม่ตรงตัว | สวยกี่โมง = ไม่สวย, ได้อยู่ = ไม่ได้ |
| Combinability (ผสมกันได้) | คำรวมกันได้ไม่จำกัด เกิดความหมายใหม่ | แม่ / แม่น้ำ / แม่ยก / แม่ไม้มวยไทย, กับข้าว, ไปสบาย |
| Evolutiveness (มีวิวัฒนาการ) | ภาษาเปลี่ยนตลอด มีคำใหม่ | ใช่ไหม → ใช่ปะ → ช้ะ, เลิศ → เริ่ด, จะรั่ว |
| Nonstandardness (ไม่มีหลักการแน่นอน) | พิมพ์ผิด สำเนียงถิ่น ไวยากรณ์ไม่เป็นทางการ | กำลัง จะ ไป กินข้าว อยู่ แล้ว เขียนได้หลายแบบ |
| Subjectivity (ขึ้นกับบุคคล/บริบท) | น้ำเสียง อารมณ์ เจตนาต่างกันตามผู้พูดและบริบท | แกงส้ม–แกงเหลือง, "ไปส่ง"กินข้าว, เขา/เข่า/เข้า |

**ความยากของภาษาไทย** ปัญหาหลักคือ **Segmentation** (การตัดคำ) เพราะภาษาไทยเขียนติดกัน ไม่มีช่องว่างคั่นคำ มี 2 ระดับ คือ Word segmentation (ตัดคำ) และ Sentence segmentation (ตัดประโยค) ข้อความเดียวกันตัดได้หลายแบบ ความหมายจึงต่างกัน

---

### 1.6  การประยุกต์ใช้ NLP

งานเชิงเทคนิค

| งาน | คืออะไร |
|:---|:---|
| Text Classification | จัดข้อความเข้าหมวดที่กำหนด เช่น spam / ไม่ spam หรือหมวดหัวข้อข่าว |
| Sentiment Analysis | ตรวจว่าข้อความแสดงอารมณ์บวก ลบ หรือกลาง |
| Machine Translation | แปลข้อความจากภาษาหนึ่งเป็นอีกภาษา |
| Named Entity Recognition (NER) | หาและระบุชื่อเฉพาะในข้อความ เช่น คน สถานที่ วันที่ |
| Text Summarization | ย่อข้อความให้สั้นลงแต่ยังคงใจความสำคัญ |
| Question Answering | อ่านข้อความแล้วตอบคำถามให้ตรงจุด |

งานในโลกจริง

| งาน | คืออะไร |
|:---|:---|
| Voice Assistants | ผู้ช่วยสั่งงานด้วยเสียง เช่น Alexa, Google Assistant, Siri |
| Customer Chatbots | บอทตอบแชตลูกค้าอัตโนมัติแทนเจ้าหน้าที่ |
| Spam Filtering | คัดแยกอีเมลขยะและช่วยเรื่องความปลอดภัย |
| Predictive Typing | แก้คำผิดอัตโนมัติและแนะนำคำถัดไปตอนพิมพ์ |
| Translation Tools | เครื่องมือแปลภาษาเพื่อสื่อสารข้ามภาษา |
| Sentiment Tracking | ติดตามความรู้สึกของคนต่อเรื่องหนึ่งบนโซเชียลมีเดีย |
| Document Search | ค้นหาเอกสารและระบบแนะนำเนื้อหา |

---

## ข้อ 2 Tokenization (2 คะแนน)

Tokenization คือการแบ่งข้อความออกเป็นหน่วยย่อยที่เรียกว่า token (อาจเป็นคำ สัญลักษณ์ หรือส่วนของคำ) เพื่อให้คอมพิวเตอร์นำไปประมวลผลต่อได้ จำนวน token จึงขึ้นกับวิธีตัด

### 2.1  Token และ Type

กำหนดข้อความ `new renew new renew set reset`

$\mathbf{Sol}^{n}$

วิธีทำ Token คือคำทุกตัวที่ปรากฏ (นับซ้ำ) ส่วน Type คือคำที่ต่างกัน (ไม่นับซ้ำ)

$$
\begin{aligned}
\text{Token} &: \text{new, renew, new, renew, set, reset} &&\Rightarrow 6 \\
\text{Type} &: \text{new, renew, set, reset} &&\Rightarrow 4 \quad(\text{new และ renew ซ้ำ นับเป็น type ละ 1})
\end{aligned}
$$

$\mathbf{Ans}\quad$ Token $=\mathbf{6}$ และ Type $=\mathbf{4}$

---

### 2.2  Normalization

กำหนดข้อความ `The Cats are Running at HOME!` และ stop word คือ $\{\text{the},\ \text{is},\ \text{at},\ \text{are}\}$

$\mathbf{Sol}^{n}$

วิธีทำ ทำตาม Normalization Pipeline ของสไลด์ทีละขั้น (lowercase, ตัดเครื่องหมายวรรคตอน, ตัด stop word, stemming/lemmatization)

$$
\begin{aligned}
\text{ข้อความเดิม} &: \text{The Cats are Running at HOME!} \\
\text{1. Lowercasing} &: \text{the cats are running at home!} \\
\text{2. ตัดเครื่องหมายวรรคตอน} &: \text{the cats are running at home} \\
\text{3. ตัด stop word} &: [\text{cats},\ \text{running},\ \text{home}] &&\text{ตัด the, are, at} \\
\text{4. Stemming/Lemmatization} &: [\text{cat},\ \text{run},\ \text{home}] &&\text{cats}\to\text{cat},\ \text{running}\to\text{run}
\end{aligned}
$$

ขั้นที่ 5 Unicode Normalization (NFC) รวมตัวอักษรที่มีเครื่องหมายกำกับให้เป็นรูปเดียว

$$
\text{e}+\text{U+0301}\ (2\ \text{code points}) \xrightarrow{\text{NFC}} \text{é}\ (\text{U+00E9},\ 1\ \text{code point})
$$

$\mathbf{Ans}\quad [\text{cat},\ \text{run},\ \text{home}]$ และ NFC รวม e กับเครื่องหมายกำกับเป็น é ตัวเดียว

---

### 2.3  Word-based Tokenization

กำหนดข้อความ `new renew new renew set reset`

$\mathbf{Sol}^{n}$

วิธีทำ ตัดข้อความตามช่องว่าง (และเครื่องหมายวรรคตอน) ได้คำละ 1 token แล้วนับจำนวน token

$$
\begin{aligned}
\text{ข้อความ} &: \text{new renew new renew set reset} \\
\text{ตัดตามช่องว่าง} &: [\text{new},\ \text{renew},\ \text{new},\ \text{renew},\ \text{set},\ \text{reset}] \\
\text{จำนวน token} &= 6
\end{aligned}
$$

$\mathbf{Ans}\quad$ word-based $=\mathbf{6}$ tokens

---

### 2.4  Character-based Tokenization

กำหนดข้อความ `new renew new renew set reset`

$\mathbf{Sol}^{n}$

วิธีทำ ตัดทีละตัวอักษร โดยช่องว่างนับเป็น 1 token ด้วย (ในที่นี้เขียนช่องว่างเป็น $\_$) แล้วนับจำนวน token

$$
\begin{aligned}
\text{ตัดทีละตัวอักษร} &: [\text{n, e, w, }\_\text{, r, e, n, e, w, }\_\text{, n, e, w, }\_\text{, r, e, n, e, w, }\_\text{, s, e, t, }\_\text{, r, e, s, e, t}] \\
\text{ตัวอักษร} &= 3+5+3+5+3+5 = 24 &&\text{new, renew, new, renew, set, reset} \\
\text{ช่องว่าง} &= 5 &&\text{ระหว่าง 6 คำ} \\
\text{จำนวน token} &= 24+5 = 29
\end{aligned}
$$

$\mathbf{Ans}\quad$ character-based $=\mathbf{29}$ tokens

---

### 2.5  BPE Training

กำหนดข้อความ `new renew new renew set reset`

$\mathbf{Sol}^{n}$

วิธีทำ (ทำ BPE จำนวน 6 รอบ ถ้าคู่ที่พบเท่ากันให้เลือกคู่ที่ปรากฏก่อนเมื่ออ่าน corpus จากซ้ายไปขวา)

1. นับความถี่ของแต่ละคำใน corpus
2. แยกทุกคำเป็นตัวอักษร ได้ vocab เริ่มต้น
3. นับคู่ที่ติดกัน (ถ่วงด้วยความถี่ของคำ) แล้วเลือกคู่ที่พบบ่อยที่สุด
4. merge คู่นั้นเป็น token ใหม่ แล้วเพิ่มเข้า vocab
5. ทำซ้ำข้อ 3 ถึง 4 จนครบจำนวนรอบ

ขั้น 1 นับความถี่ของคำจากข้อความ ได้ corpus คือ new (x2), renew (x2), set (x1), reset (x1)

ขั้น 2 แยกเป็นตัวอักษร

$$
\begin{aligned}
\text{corpus} &: \text{n e w}\ (\times2),\ \ \text{r e n e w}\ (\times2),\ \ \text{s e t}\ (\times1),\ \ \text{r e s e t}\ (\times1) \\
V_0 &= \{e,\ n,\ r,\ s,\ t,\ w\}
\end{aligned}
$$

ขั้น 3 ถึง 5 ทำซ้ำ 6 รอบ

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

---

## ข้อ 3 Word Segmentation, POS Tagging และ Sequence Labeling (10 คะแนน)

### 3.1  Word Segmentation

**Word Segmentation** คือการหาขอบเขตของคำในข้อความที่เขียนติดกันโดยไม่มีช่องว่าง ข้อความเดียวกันอาจตัดได้หลายแบบและความหมายต่างกัน

#### 3.1.1  Forward Maximum Matching (FMM)

กำหนดพจนานุกรม $\{\text{นัก},\ \text{นักเรียน},\ \text{เรียน},\ \text{ไป},\ \text{โรง},\ \text{โรงเรียน}\}$ จงตัดคำข้อความ "นักเรียนไปโรงเรียน" ด้วย FMM

$\mathbf{Sol}^{n}$

วิธีทำ เริ่มจากตำแหน่งซ้ายสุด ลองจับสายที่ยาวที่สุดก่อน ถ้าไม่พบในพจนานุกรมให้ลดความยาวลงทีละ 1 ตัวอักษร พบแล้วตัดคำนั้น แล้วเริ่มใหม่จากตำแหน่งถัดไป

| ขั้น | ข้อความที่เหลือ | ลองจับ (ลดความยาวทีละ 1 ตัวอักษร) | ผล |
|:---:|:---|:---|:---:|
| 1 | นักเรียนไปโรงเรียน | นักเรียนไปโรงเรียน, ... , นักเรียนไป ไม่พบ ลดต่อจนถึง นักเรียน พบ | ตัด "นักเรียน" |
| 2 | ไปโรงเรียน | ไปโรงเรียน, ... , ไปโรง ไม่พบ ลดต่อจนถึง ไป พบ | ตัด "ไป" |
| 3 | โรงเรียน | โรงเรียน พบทันที | ตัด "โรงเรียน" |

$\mathbf{Ans}\quad$ FMM $=\textbf{นักเรียน | ไป | โรงเรียน}$

---

#### 3.1.2  FMM และ BMM ที่ให้ผลต่างกัน

กำหนดพจนานุกรม $\{\text{ตา},\ \text{ตาก},\ \text{กลม},\ \text{ลม}\}$ จงตัดคำข้อความ "ตากลม" ด้วย Forward Maximum Matching (FMM) และ Backward Maximum Matching (BMM)

$\mathbf{Sol}^{n}$

FMM เริ่มจากซ้ายสุด ลองสายยาวสุดก่อนแล้วลดทีละ 1 ตัวอักษร พบในพจนานุกรมก็ตัดแล้วเริ่มใหม่จากตำแหน่งถัดไป ส่วน BMM ทำเหมือนกันแต่เริ่มจากขวาสุด

| วิธี | ตำแหน่ง | ข้อความที่ลอง (ความยาว) | อยู่ในพจนานุกรม | ผล |
|:---:|:---:|:---|:---:|:---:|
| FMM | $i=0$ | ตากลม (5) | ไม่พบ | |
| | | ตากล (4) | ไม่พบ | |
| | | ตาก (3) | พบ | ตัด "ตาก" |
| | $i=3$ | ลม (2) | พบ | ตัด "ลม" |
| BMM | $j=5$ | ตากลม (5) | ไม่พบ | |
| | | ากลม (4) | ไม่พบ | |
| | | กลม (3) | พบ | ตัด "กลม" |
| | $j=2$ | ตา (2) | พบ | ตัด "ตา" |

$\mathbf{Ans}\quad$ FMM $= \textbf{ตาก | ลม}$ และ BMM $= \textbf{ตา | กลม}$ (ได้ผลต่างกัน แสดงว่าเป็นวิธี greedy ที่แก้ความกำกวมไม่ได้)

---

#### 3.1.3  Statistical Segmentation

จาก corpus ที่นับความถี่ได้ ตา 500, กลม 80, ตาก 60, ลม 200 จงหาว่า Statistical Segmentation (unigram) เลือกตัดคำ "ตากลม" แบบใด

$\mathbf{Sol}^{n}$

วิธีทำ ใช้ unigram model คือเลือกวิธีตัดที่ทำให้ความน่าจะเป็นรวมของทั้งข้อความสูงสุด โดยถือว่าแต่ละคำเกิดอิสระต่อกัน

สูตรที่ใช้ มี 3 ตัว

$$
\hat{W} = \arg\max_{W} P(W), \qquad P(W) = \prod_{i} P(w_i), \qquad P(w) = \frac{\text{count}(w)}{N}
$$

ค่าที่ต้องแทน คือ $\text{count}(w)$ ของแต่ละคำจาก corpus และ $N$ = ผลรวมความถี่ของทุกคำ ส่วนวิธีตัดที่เป็นไปได้ (ทุกคำอยู่ใน corpus) มี 2 แบบ คือ ตา + กลม และ ตาก + ลม

$$
\begin{aligned}
\text{1. หา } N &: N = 500+80+60+200 = 840 \\
\text{2. หา } P(w) &: P(\text{ตา}) = \tfrac{500}{840} = 0.595,\quad P(\text{กลม}) = \tfrac{80}{840} = 0.095 \\
&\phantom{:}\ P(\text{ตาก}) = \tfrac{60}{840} = 0.071,\quad P(\text{ลม}) = \tfrac{200}{840} = 0.238 \\
\text{3. คูณแต่ละแบบ} &: P(\text{ตา}+\text{กลม}) = 0.595\times 0.095 = 0.0567 \\
&\phantom{:}\ P(\text{ตาก}+\text{ลม}) = 0.071\times 0.238 = 0.0170 \\
\text{4. เลือกค่าสูงสุด} &: 0.0567 > 0.0170
\end{aligned}
$$

$\mathbf{Ans}\quad 0.0567 > 0.0170$ ดังนั้นเลือก $\textbf{ตา + กลม}$

---

### 3.2  POS Tagging

**POS Tagging** คือการกำหนดหมวดคำ (Part of Speech) ให้กับทุกคำในประโยค คำเดียวกันอาจมีหมวดคำต่างกันตามบริบท

**Universal tags (UD)** ชุดหมวดคำมาตรฐานที่ใช้ได้หลายภาษา (ตัวอย่างเฉพาะหมวดหลัก)

| Tag | ความหมาย | ตัวอย่าง |
|:---:|:---|:---|
| NOUN | คำนาม | algorithm, cat, mango |
| VERB | คำกริยา | draw, provide, go |
| ADJ | คำคุณศัพท์ | red, young, awesome |
| ADV | คำวิเศษณ์ | very, slowly, yesterday |
| PROPN | คำนามเฉพาะ | Regina, IBM, Colorado |
| DET | คำนำหน้านาม | a, an, the, this |
| ADP | คำบุพบท | in, on, by, under |
| PRON | คำสรรพนาม | she, who, I |

ยังมี Penn Treebank tagset ที่ละเอียดกว่า (ประมาณ 45 tag เช่น NNP, MD, VB, DT, NN, JJ, RB) และภาษาไทยมี ORCHID tagset (NECTEC ประมาณ 47 tag เช่น NCMN = คำนามทั่วไป, VACT = กริยาแสดงการกระทำ)

#### 3.2.1  Rule-based Tagging

กำหนดข้อความ "a book" และกฎ "ถ้าคำก่อนหน้าเป็น DET คำถัดไปต้องเป็น NOUN" จงหา POS tag ของแต่ละคำ

$\mathbf{Sol}^{n}$

วิธีทำ มี 2 ขั้น คือ (1) ค้นพจนานุกรมเพื่อหา tag ที่เป็นไปได้ทั้งหมดของแต่ละคำ (2) ใช้กฎไวยากรณ์พิจารณาคำข้างเคียงเพื่อเลือก tag ที่ถูกต้องในกรณีที่กำกวม

| คำ | tag ที่เป็นไปได้ (ขั้น 1) | ผลการพิจารณา (ขั้น 2) |
|:---:|:---:|:---|
| a | DET | ชัดเจน จึงได้ DET |
| book | NOUN หรือ VERB | กำกวม ใช้กฎ: คำก่อนหน้า (a) เป็น DET จึงเลือก NOUN |

$\mathbf{Ans}\quad \text{a/DET}\ \ \text{book/NOUN}$

---

#### 3.2.2  Viterbi Algorithm

กำหนดตาราง $A$ และ $B$ ของ HMM ดังนี้ จงใช้ Viterbi หา POS tag ของประโยค "Janet will back the bill"

$A$ คือ $P(t_i\mid t_{i-1})$ (แถว = tag ก่อนหน้า คอลัมน์ = tag ถัดไป)

| | NNP | MD | VB | JJ | NN | RB | DT |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| $\langle s\rangle$ | 0.2767 | 0.0006 | 0.0031 | 0.0453 | 0.0449 | 0.0510 | 0.2026 |
| NNP | 0.3777 | 0.0110 | 0.0009 | 0.0084 | 0.0584 | 0.0090 | 0.0025 |
| MD | 0.0008 | 0.0002 | 0.7968 | 0.0005 | 0.0008 | 0.1698 | 0.0041 |
| VB | 0.0322 | 0.0005 | 0.0050 | 0.0837 | 0.0615 | 0.0514 | 0.2231 |
| JJ | 0.0366 | 0.0004 | 0.0001 | 0.0733 | 0.4509 | 0.0036 | 0.0036 |
| NN | 0.0096 | 0.0176 | 0.0014 | 0.0086 | 0.1216 | 0.0177 | 0.0068 |
| RB | 0.0068 | 0.0102 | 0.1011 | 0.1012 | 0.0120 | 0.0728 | 0.0479 |
| DT | 0.1147 | 0.0021 | 0.0002 | 0.2157 | 0.4744 | 0.0102 | 0.0017 |

$B$ คือ $P(\text{word}\mid\text{tag})$

| | Janet | will | back | the | bill |
|:---:|:---:|:---:|:---:|:---:|:---:|
| NNP | 0.000032 | 0 | 0 | 0.000048 | 0 |
| MD | 0 | 0.308431 | 0 | 0 | 0 |
| VB | 0 | 0.000028 | 0.000672 | 0 | 0.000028 |
| JJ | 0 | 0 | 0.000340 | 0 | 0 |
| NN | 0 | 0.000200 | 0.000223 | 0 | 0.002337 |
| RB | 0 | 0 | 0.010446 | 0 | 0 |
| DT | 0 | 0 | 0 | 0.506099 | 0 |

$\mathbf{Sol}^{n}$

คอลัมน์ 1 ใช้ $v_1(j)=\pi_j\,b_j(o_1)$ โดย $\pi_j$ คือแถว $\langle s\rangle$ ของ $A$ ส่วนคอลัมน์อื่นใช้ $v_t(j)=\max_i\, v_{t-1}(i)\,a_{ij}\,b_j(o_t)$ และจด backpointer ของ $i$ ที่ชนะ ทางลัดคือถ้า $b_j(\text{คำ})=0$ ข้าม tag นั้นได้เลย (ได้ $0$)

**คอลัมน์ 1 (Janet)** มีแต่ NNP ที่ $b\neq 0$

$$
v_1(\text{NNP}) = 0.2767\times 0.000032 = 8.854\times 10^{-6}
$$

**คอลัมน์ 2 (will)** tag ที่ $b\neq 0$ คือ MD, VB, NN และก่อนหน้ามีแค่ NNP ที่ไม่เป็น $0$

| $j$ | $v_1(\text{NNP})\,a_{\text{NNP},j}$ | $\times\, b_j(\text{will})$ | $v_2(j)$ | bp |
|:---:|:---:|:---:|:---:|:---:|
| MD | $8.854\times10^{-6}\times 0.0110 = 9.74\times10^{-8}$ | $\times\, 0.308431$ | $\mathbf{3.004\times10^{-8}}$ | NNP |
| VB | $8.854\times10^{-6}\times 0.0009 = 7.97\times10^{-9}$ | $\times\, 0.000028$ | $2.231\times10^{-13}$ | NNP |
| NN | $8.854\times10^{-6}\times 0.0584 = 5.17\times10^{-7}$ | $\times\, 0.000200$ | $1.034\times10^{-10}$ | NNP |

**คอลัมน์ 3 (back)** tag ที่ $b\neq 0$ คือ VB, JJ, NN, RB ช่อง "มาจาก $X$" คือ $v_2(X)\,a_{X,j}$

| $j$ | มาจาก MD | มาจาก VB | มาจาก NN | $\times\, b_j$ | $v_3(j)$ | bp |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| VB | $2.394\times10^{-8}$ | $1.116\times10^{-15}$ | $1.448\times10^{-13}$ | $0.000672$ | $\mathbf{1.609\times10^{-11}}$ | MD |
| JJ | $1.502\times10^{-11}$ | $1.868\times10^{-14}$ | $8.894\times10^{-13}$ | $0.000340$ | $5.107\times10^{-15}$ | MD |
| NN | $2.403\times10^{-11}$ | $1.372\times10^{-14}$ | $1.258\times10^{-11}$ | $0.000223$ | $5.359\times10^{-15}$ | MD |
| RB | $5.101\times10^{-9}$ | $1.147\times10^{-14}$ | $1.831\times10^{-12}$ | $0.010446$ | $5.328\times10^{-11}$ | MD |

**คอลัมน์ 4 (the)** tag ที่ $b\neq 0$ คือ NNP และ DT

| $j$ | ตัวชนะ | $\times\, b_j$ | $v_4(j)$ | bp |
|:---:|:---:|:---:|:---:|:---:|
| DT | จาก VB: $1.609\times10^{-11}\times 0.2231 = 3.589\times10^{-12}$ | $\times\, 0.506099$ | $\mathbf{1.816\times10^{-12}}$ | VB |
| NNP | จาก VB: $1.609\times10^{-11}\times 0.0322 = 5.18\times10^{-13}$ | $\times\, 0.000048$ | $2.486\times10^{-17}$ | VB |

**คอลัมน์ 5 (bill)** tag ที่ $b\neq 0$ คือ VB และ NN

| $j$ | ตัวชนะ | $\times\, b_j$ | $v_5(j)$ | bp |
|:---:|:---:|:---:|:---:|:---:|
| NN | จาก DT: $1.816\times10^{-12}\times 0.4744 = 8.616\times10^{-13}$ | $\times\, 0.002337$ | $\mathbf{2.014\times10^{-15}}$ | DT |
| VB | จาก DT: $1.816\times10^{-12}\times 0.0002 = 3.63\times10^{-16}$ | $\times\, 0.000028$ | $1.017\times10^{-20}$ | DT |

Backtrace จาก $v_5$ สูงสุดคือ NN มี bp เป็น DT จากนั้น VB, MD และ NNP ตามลำดับ

$\mathbf{Ans}\quad \text{Janet/NNP}\ \to\ \text{will/MD}\ \to\ \text{back/VB}\ \to\ \text{the/DT}\ \to\ \text{bill/NN}$

หมายเหตุ ที่คอลัมน์ 3 ค่า RB ($5.328\times10^{-11}$) มากกว่า VB ($1.609\times10^{-11}$) แต่เส้นทางที่ดีที่สุดทั้งประโยคผ่าน VB เพราะ VB ส่งต่อไป DT ได้ดีกว่า

---

#### 3.2.3  ความซับซ้อนของ Viterbi

กำหนดประโยค "Janet will back the bill" ($N=5$ คำ) และหมวดคำ $7$ หมวด ($T=7$) จงเปรียบเทียบจำนวนการคำนวณของ Brute-force ($T^N$) กับ Viterbi ($N\times T^2$)

$\mathbf{Sol}^{n}$

วิธีทำ Brute-force ลองทุก tag sequence ที่เป็นไปได้ ส่วน Viterbi เติมตาราง $N\times T$ ทีละเซลล์ โดยแต่ละเซลล์เทียบ $T$ ทางเลือกก่อนหน้า

$$
\begin{aligned}
\text{Brute-force} &= T^N = 7^5 = 16{,}807\ \text{ลำดับ} \\
\text{Viterbi} &= N\times T^2 = 5\times 7^2 = 245\ \text{การคำนวณ} \\
\text{อัตราส่วน} &= \frac{16{,}807}{245} = 68.6
\end{aligned}
$$

$\mathbf{Ans}\quad$ Brute-force $=\mathbf{16{,}807}$, Viterbi $=\mathbf{245}$ ดังนั้น Viterbi เร็วกว่าประมาณ $\mathbf{68.6}$ เท่า

---

#### 3.2.4  Word Shape (CRF)

กำหนดกฎ word shape: ตัวพิมพ์ใหญ่ $\to \text{X}$, ตัวพิมพ์เล็ก $\to \text{x}$, ตัวเลข $\to \text{d}$, ตัวอักษรอื่นคงเดิม จงหา word shape ของ "I.M.F." และ "DC10-30"

$\mathbf{Sol}^{n}$

วิธีทำ แปลงทีละตัวอักษรตามกฎ แล้วต่อกัน (ใช้เป็น feature ช่วยทาย tag ของคำที่ไม่เคยเห็น)

| คำ | แปลงทีละตัว | word shape |
|:---:|:---|:---:|
| I.M.F. | I→X, .→., M→X, .→., F→X, .→. | X.X.X. |
| DC10-30 | D→X, C→X, 1→d, 0→d, -→-, 3→d, 0→d | XXdd-dd |

$\mathbf{Ans}\quad$ "I.M.F." $\to\ \mathbf{X.X.X.}$ และ "DC10-30" $\to\ \mathbf{XXdd\text{-}dd}$

---

### 3.3  Sequence Labeling

**Sequence Labeling** คือการกำหนด label ให้ทุก input ในลำดับ ผลลัพธ์ยาวเท่า input และ label แต่ละตัวขึ้นกับคำข้างเคียงด้วย

tag ที่ใช้บอกขอบเขตของ entity (ชื่อเฉพาะที่อาจมีหลาย token)

| Tag | ความหมาย |
|:---:|:---|
| B | จุดเริ่ม entity |
| I | อยู่ภายใน entity |
| O | ไม่ใช่ entity |
| E | จุดสิ้นสุด entity |
| S | Single entity มีแค่ 1 token |

BIO มี tag ทั้งหมด $2n+1$ ตัว เมื่อ $n$ คือจำนวนประเภท entity

#### 3.3.1  BIO / IO / BIOES Tagging

จงติด tag แบบ IO, BIO และ BIOES ให้ประโยค "Jane Villanueva of United Airlines Holding discussed the Chicago route" เมื่อ Jane Villanueva เป็น PER, United Airlines Holding เป็น ORG และ Chicago เป็น LOC

$\mathbf{Sol}^{n}$

ระบุขอบเขตและประเภทของแต่ละ entity ก่อน แล้วติด tag ทีละ token ตามกฎ โดย $x$ คือประเภทของ entity

| | token แรก | token กลาง | token สุดท้าย | entity มี 1 token |
|:---:|:---:|:---:|:---:|:---:|
| IO | I-$x$ | I-$x$ | I-$x$ | I-$x$ |
| BIO | B-$x$ | I-$x$ | I-$x$ | B-$x$ |
| BIOES | B-$x$ | I-$x$ | E-$x$ | S-$x$ |

| Word | IO | BIO | BIOES |
|:---:|:---:|:---:|:---:|
| Jane | I-PER | B-PER | B-PER |
| Villanueva | I-PER | I-PER | E-PER |
| of | O | O | O |
| United | I-ORG | B-ORG | B-ORG |
| Airlines | I-ORG | I-ORG | I-ORG |
| Holding | I-ORG | I-ORG | E-ORG |
| discussed | O | O | O |
| the | O | O | O |
| Chicago | I-LOC | B-LOC | S-LOC |
| route | O | O | O |

$\mathbf{Ans}\quad$ ผลเป็นไปตามตารางด้านบน เช่น BIO $=\mathbf{B\text{-}PER\ I\text{-}PER\ O\ B\text{-}ORG\ I\text{-}ORG\ I\text{-}ORG\ O\ O\ B\text{-}LOC\ O}$

---

## ข้อ 4 Syntax and Parsing (4 คะแนน)

**Syntax** คือโครงสร้างไวยากรณ์ของประโยค และ **Parsing** คือการสร้าง syntax tree (parse tree) ซึ่งเป็นการแสดงโครงสร้างนั้นในรูปต้นไม้ โดยแบ่งประโยคเป็นคำและวลี แล้วแสดงความสัมพันธ์เชิงลำดับชั้นตามกฎไวยากรณ์

Syntax tree มี 2 ชนิดหลัก คือ **Constituency tree** (วลีซ้อนกัน ประกอบจากคำขึ้นไปจนเป็นประโยค) และ **Dependency tree** (ความสัมพันธ์แบบมีทิศทางระหว่างคำกับคำ) โครงสร้างช่วยแก้ความกำกวมของประโยคได้ เช่น "I shot an elephant in my pajamas" ที่ตีความได้ 2 แบบ

### 4.1  CFG และ Constituency Tree

**Context-Free Grammar (CFG)** คือชุดกฎที่บอกว่าคำประกอบกันเป็นวลีและประโยคได้อย่างไร ผลการ parse แสดงเป็น parse tree และประโยคเดียวอาจมีได้หลายต้น

#### 4.1.1  Derivation และ Parse Tree

กำหนดไวยากรณ์ต่อไปนี้ จงเขียน derivation และวาด parse tree ของประโยค "แมว ดำ กิน ปลา"

$$
\begin{aligned}
S &\to NP\ VP & N &\to \text{แมว}\ |\ \text{ปลา} \\
NP &\to N\ ADJ & ADJ &\to \text{ดำ} \\
NP &\to N & V &\to \text{กิน} \\
VP &\to V\ NP
\end{aligned}
$$

$\mathbf{Sol}^{n}$

เริ่มจาก $S$ แล้วแทนที่ non-terminal ทางซ้ายสุดทีละกฎ จนเหลือแต่คำ

$$
\begin{aligned}
S &\Rightarrow NP\ VP &&S\to NP\ VP \\
&\Rightarrow N\ ADJ\ VP &&NP\to N\ ADJ \\
&\Rightarrow \text{แมว}\ ADJ\ VP &&N\to\text{แมว} \\
&\Rightarrow \text{แมว ดำ}\ VP &&ADJ\to\text{ดำ} \\
&\Rightarrow \text{แมว ดำ}\ V\ NP &&VP\to V\ NP \\
&\Rightarrow \text{แมว ดำ กิน}\ NP &&V\to\text{กิน} \\
&\Rightarrow \text{แมว ดำ กิน}\ N &&NP\to N \\
&\Rightarrow \text{แมว ดำ กิน ปลา} &&N\to\text{ปลา}
\end{aligned}
$$

$\mathbf{Ans}\quad \left[_S\ \left[_{NP}\ [_N\ \text{แมว}]\ [_{ADJ}\ \text{ดำ}]\right]\ \left[_{VP}\ [_V\ \text{กิน}]\ \left[_{NP}\ [_N\ \text{ปลา}]\right]\right]\right]$

<div align="center">
<svg xmlns="http://www.w3.org/2000/svg" width="342" height="261" viewBox="0 0 380 290" font-family="Times New Roman, serif" font-size="18" fill="currentColor">
<g stroke="currentColor" stroke-width="1.6" fill="none">
<line x1="190" y1="38" x2="100" y2="76"/>
<line x1="190" y1="38" x2="280" y2="76"/>
<line x1="100" y1="100" x2="60" y2="136"/>
<line x1="100" y1="100" x2="140" y2="136"/>
<line x1="280" y1="100" x2="240" y2="136"/>
<line x1="280" y1="100" x2="320" y2="136"/>
<line x1="320" y1="160" x2="320" y2="188"/>
<line x1="60" y1="160" x2="60" y2="238"/>
<line x1="140" y1="160" x2="140" y2="238"/>
<line x1="240" y1="160" x2="240" y2="238"/>
<line x1="320" y1="212" x2="320" y2="238"/>
</g>
<text x="190" y="34" text-anchor="middle">S</text>
<text x="100" y="96" text-anchor="middle">NP</text>
<text x="280" y="96" text-anchor="middle">VP</text>
<text x="60" y="156" text-anchor="middle">N</text>
<text x="140" y="156" text-anchor="middle">ADJ</text>
<text x="240" y="156" text-anchor="middle">V</text>
<text x="320" y="156" text-anchor="middle">NP</text>
<text x="320" y="208" text-anchor="middle">N</text>
<text x="60" y="258" text-anchor="middle">แมว</text>
<text x="140" y="258" text-anchor="middle">ดำ</text>
<text x="240" y="258" text-anchor="middle">กิน</text>
<text x="320" y="258" text-anchor="middle">ปลา</text>
</svg>
</div>

---

#### 4.1.2  Structural Ambiguity

ประโยค "I saw the man with the telescope" มี parse tree 2 แบบ จงเขียนโครงสร้างของแต่ละแบบและบอกความหมาย

$\mathbf{Sol}^{n}$

วิธีทำ ดูว่า PP "with the telescope" ต่อกับ constituent ใด (VP หรือ NP) แล้วเขียนโครงสร้างตามนั้น

| | PP ต่อกับ | ความหมาย |
|:---:|:---:|:---|
| Method 1 | VP | I saw (the man) with the telescope คือ ฉันใช้กล้องมองผู้ชาย |
| Method 2 | NP | I saw (the man with the telescope) คือ ผู้ชายคนนั้นถือกล้อง |

$$
\begin{aligned}
\text{Method 1 (PP + VP)} &: \left[_S\ [_{NP}\ \text{I}]\ \left[_{VP}\ \left[_{VP}\ [_V\ \text{saw}]\ [_{NP}\ \text{the man}]\right]\ [_{PP}\ \text{with the telescope}]\right]\right] \\
\text{Method 2 (PP + NP)} &: \left[_S\ [_{NP}\ \text{I}]\ \left[_{VP}\ [_V\ \text{saw}]\ \left[_{NP}\ [_{NP}\ \text{the man}]\ [_{PP}\ \text{with the telescope}]\right]\right]\right]
\end{aligned}
$$

$\mathbf{Ans}\quad$ ประโยคกำกวมเชิงโครงสร้าง มี parse tree 2 แบบ คือ PP ต่อกับ VP (ฉันใช้กล้อง) และ PP ต่อกับ NP (ผู้ชายถือกล้อง)

---

#### 4.1.3  Chomsky Normal Form: กฎ 3 ชนิด

จงแปลงกฎต่อไปนี้เป็น CNF: $INF\text{-}VP\to\text{to}\ VP$, $NP\to N$ (เมื่อ $N\to\text{แมว}\mid\text{ปลา}$) และ $VP\to V\ NP\ PP$

$\mathbf{Sol}^{n}$

วิธีทำ CNF มีรูปกฎเพียง $A\to B\,C$ และ $A\to w$ ตรวจแต่ละกฎว่าผิดรูปแบบใด แล้วแก้ตามชนิด

| กฎ | ปัญหา | วิธีแก้ | ผล |
|:---:|:---|:---|:---|
| $INF\text{-}VP\to\text{to}\ VP$ | ปน terminal กับ non-terminal | สร้าง non-terminal ใหม่คลุมคำนั้น | $INF\text{-}VP\to TO\ VP$ และ $TO\to\text{to}$ |
| $NP\to N$ | unit production (ด้านขวามี non-terminal ตัวเดียว) | แทนด้วยด้านขวาของกฎที่ $N$ แตกต่อได้ | $NP\to\text{แมว}\mid\text{ปลา}$ |
| $VP\to V\ NP\ PP$ | ด้านขวายาวเกิน 2 ตัว | แตกเป็นกฎย่อยด้วย dummy symbol | $VP\to X_1\ PP$ และ $X_1\to V\ NP$ |

$\mathbf{Ans}$

$$
\begin{aligned}
&INF\text{-}VP\to TO\ VP,\quad TO\to\text{to} \\
&NP\to\text{แมว}\mid\text{ปลา} \\
&VP\to X_1\ PP,\quad X_1\to V\ NP
\end{aligned}
$$

---

#### 4.1.4  แปลงไวยากรณ์เป็น CNF

จากไวยากรณ์ในข้อ 4.1.1 จงแปลงเป็น Chomsky Normal Form (CNF)

$\mathbf{Sol}^{n}$

CNF มีรูปกฎ 2 แบบเท่านั้นคือ $A\to B\,C$ และ $A\to w$ ตรวจทีละกฎ ถ้าไม่ใช่ให้แก้ตามชนิด เช่น unit production ให้แทนด้วยด้านขวาของกฎที่ non-terminal นั้นแตกต่อ

| กฎ | ตรวจ | วิธีแก้ |
|:---|:---:|:---|
| $S\to NP\ VP$ | เป็น CNF | คงเดิม |
| $NP\to N\ ADJ$ | เป็น CNF | คงเดิม |
| $NP\to N$ | unit production | แทนด้วยด้านขวาของ $N$: $NP\to\text{แมว}\mid\text{ปลา}$ |
| $VP\to V\ NP$ | เป็น CNF | คงเดิม |
| $N,\ ADJ,\ V\to$ คำ | เป็น CNF | คงเดิม |

ต้องเก็บ $N\to\text{แมว}\ |\ \text{ปลา}$ ไว้ เพราะกฎ $NP\to N\ ADJ$ ยังใช้ $N$ อยู่

$\mathbf{Ans}$

$$
\begin{aligned}
S &\to NP\ VP & NP &\to \text{แมว}\ |\ \text{ปลา} \\
NP &\to N\ ADJ & N &\to \text{แมว}\ |\ \text{ปลา} \\
VP &\to V\ NP & ADJ &\to \text{ดำ},\quad V\to\text{กิน}
\end{aligned}
$$

---

### 4.2  PCFG

**PCFG** คือ CFG ที่แต่ละกฎมีความน่าจะเป็น ความน่าจะเป็นของ parse tree คือผลคูณของกฎที่ใช้ และเลือก parse ที่ได้ค่าสูงสุด

#### 4.2.1  PCFG: ความน่าจะเป็นของ Parse

กำหนดกฎ PCFG ดังนี้ ประโยค "I shot an elephant in my pajamas" มี 2 parse คือ A (PP ต่อกับ NP: ช้างใส่ชุดนอน) และ B (PP ต่อกับ VP: ฉันใส่ชุดนอน) จงหา $P(T)$ ของแต่ละ parse และบอกว่า PCFG เลือก parse ใด

$$
\begin{aligned}
S &\to NP\ VP\quad[1.0] & NP &\to N\quad[0.5] \\
VP &\to V\ NP\quad[0.6] & NP &\to N\ ADJ\quad[0.3] \\
VP &\to VP\ PP\quad[0.4] & NP &\to NP\ PP\quad[0.2] \\
PP &\to P\ NP\quad[1.0]
\end{aligned}
$$

$\mathbf{Sol}^{n}$

$P(T)=\prod p(r(n))$ คือคูณความน่าจะเป็นของทุกกฎที่ใช้ในต้นไม้

**Parse A (PP + NP)**

$$
\begin{aligned}
P(T_A) &= \underbrace{1.0}_{S\to NP\,VP}\times\underbrace{0.5}_{NP\to N\,(I)}\times\underbrace{0.6}_{VP\to V\,NP}\times\underbrace{0.2}_{NP\to NP\,PP}\times\underbrace{0.5}_{NP\to N\,(\text{elephant})}\times\underbrace{1.0}_{PP\to P\,NP}\times\underbrace{0.5}_{NP\to N\,(\text{pajamas})} \\
&= 0.015
\end{aligned}
$$

**Parse B (PP + VP)**

$$
\begin{aligned}
P(T_B) &= \underbrace{1.0}_{S\to NP\,VP}\times\underbrace{0.5}_{NP\to N\,(I)}\times\underbrace{0.4}_{VP\to VP\,PP}\times\underbrace{0.6}_{VP\to V\,NP}\times\underbrace{0.5}_{NP\to N\,(\text{elephant})}\times\underbrace{1.0}_{PP\to P\,NP}\times\underbrace{0.5}_{NP\to N\,(\text{pajamas})} \\
&= 0.030
\end{aligned}
$$

สองต้นใช้กฎเหมือนกัน ต่างกันเพียง $NP\to NP\ PP\,[0.2]$ กับ $VP\to VP\ PP\,[0.4]$ อัตราส่วน $0.4:0.2=2:1$ ตรงกับ $0.030:0.015$

$\mathbf{Ans}\quad P(T_A)=0.015,\ P(T_B)=0.030$ และ $0.030>0.015$ ดังนั้น PCFG เลือก $\mathbf{Parse\ B}$ (ฉันใส่ชุดนอน)

หมายเหตุ สไลด์ติดป้ายผลลัพธ์สลับกัน (ใต้ Parse A เขียน $P(T_B)$ และใต้ Parse B เขียน $P(T_A)$) ในข้อนี้จัดตามชื่อ parse ให้ตรงกันแล้ว

---

### 4.3  CYK

**CYK** คืออัลกอริทึม parsing ที่เติมตารางทีละช่วงคำ (ใช้กับไวยากรณ์รูป CNF) ถ้ามี $S$ ในช่องที่คลุมทั้งประโยค แสดงว่าประโยคถูกไวยากรณ์

#### 4.3.1  CYK: เติมตาราง

จากไวยากรณ์ CNF ในข้อ 4.1.4 จงใช้ CYK ตรวจว่าประโยค "แมว ดำ กิน ปลา" ถูกไวยากรณ์หรือไม่ และดึง parse tree

$\mathbf{Sol}^{n}$

เติมแถวทแยงมุม $[i,i]$ จากกฎ lexical ก่อน แล้วเติมช่วง 2 คำ 3 คำ และ 4 คำ ในแต่ละช่อง $[i,j]$ ลองทุกจุดแบ่ง $k$ ถ้า $B\in[i,k]$ และ $C\in[k+1,j]$ และมีกฎ $A\to B\,C$ ให้ใส่ $A$ ถ้า $S$ อยู่ใน $[1,4]$ ประโยคถูกไวยากรณ์

**ช่วง 1 คำ**

| ช่อง | คำ | ผล |
|:---:|:---:|:---:|
| $[1,1]$ | แมว | $N,\ NP$ |
| $[2,2]$ | ดำ | $ADJ$ |
| $[3,3]$ | กิน | $V$ |
| $[4,4]$ | ปลา | $NP,\ N$ |

**ช่วง 2 คำ**

| ช่อง | จุดแบ่ง | การตรวจ | ผล |
|:---:|:---:|:---|:---:|
| $[1,2]$ | $k=1$ | $N\in[1,1]$, $ADJ\in[2,2]$ จึงใช้ $NP\to N\ ADJ$ | $NP$ |
| $[2,3]$ | $k=2$ | $ADJ,\ V$ ไม่มีกฎรองรับ | ว่าง |
| $[3,4]$ | $k=3$ | $V\in[3,3]$, $NP\in[4,4]$ จึงใช้ $VP\to V\ NP$ | $VP$ |

**ช่วง 3 คำ**

| ช่อง | จุดแบ่ง | การตรวจ | ผล |
|:---:|:---:|:---|:---:|
| $[1,3]$ | $k=1$ | $[2,3]$ ว่าง | ไม่มี |
| | $k=2$ | $NP,\ V$ ไม่มีกฎรองรับ | ไม่มี |
| $[2,4]$ | $k=2$ | $ADJ,\ VP$ ไม่มีกฎรองรับ | ไม่มี |
| | $k=3$ | $[2,3]$ ว่าง | ไม่มี |

**ช่วง 4 คำ**

| ช่อง | จุดแบ่ง | การตรวจ | ผล |
|:---:|:---:|:---|:---:|
| $[1,4]$ | $k=1$ | $[2,4]$ ว่าง | ไม่มี |
| | $k=2$ | $NP\in[1,2]$, $VP\in[3,4]$ จึงใช้ $S\to NP\ VP$ | $\mathbf{S}$ |
| | $k=3$ | $[1,3]$ ว่าง | ไม่มี |

ตารางสุดท้าย

| | 1. แมว | 2. ดำ | 3. กิน | 4. ปลา |
|:---:|:---:|:---:|:---:|:---:|
| **1** | $N,\ NP$ | $NP$ | - | $\mathbf{S}$ |
| **2** | | $ADJ$ | - | - |
| **3** | | | $V$ | $VP$ |
| **4** | | | | $NP,\ N$ |

backpointer ของ $S$ ที่ $[1,4]$ ชี้ไป $NP[1,2]+VP[3,4]$, ของ $NP$ ที่ $[1,2]$ ชี้ไป $N[1,1]+ADJ[2,2]$ และของ $VP$ ที่ $[3,4]$ ชี้ไป $V[3,3]+NP[4,4]$

$\mathbf{Ans}\quad S\in[1,4]$ ดังนั้นประโยค**ถูกไวยากรณ์** และ parse tree คือ $\left[_S\ \left[_{NP}\ [_N\ \text{แมว}]\ [_{ADJ}\ \text{ดำ}]\right]\ \left[_{VP}\ [_V\ \text{กิน}]\ [_{NP}\ \text{ปลา}]\right]\right]$ (เหมือนข้อ 4.1.1)

---

#### 4.3.2  ความซับซ้อนของ CYK

จงหาจำนวนช่องในตาราง CYK และจำนวนการลองจุดแบ่งโดยประมาณ เมื่อประโยคยาว $n=4$, $10$ และ $20$ คำ

$\mathbf{Sol}^{n}$

วิธีทำ ตารางสามเหลี่ยมมีช่อง $\dfrac{n(n+1)}{2}\approx O(n^2)$ ช่อง แต่ละช่องลองจุดแบ่ง $k$ ได้มากถึง $n$ จุด $\to O(n)$ รวมเป็น $O(n^3)$ (และคูณด้วยขนาดไวยากรณ์ $\lvert G\rvert$)

$$
\begin{aligned}
n=4 &: \tfrac{4\times5}{2} = 10\ \text{ช่อง}, \quad n^3 = 4^3 = 64 \\
n=10 &: \tfrac{10\times11}{2} = 55\ \text{ช่อง}, \quad n^3 = 10^3 = 1{,}000 \\
n=20 &: \tfrac{20\times21}{2} = 210\ \text{ช่อง}, \quad n^3 = 20^3 = 8{,}000
\end{aligned}
$$

$\mathbf{Ans}$

| ความยาวประโยค $n$ | จำนวนช่องในตาราง | จำนวนการลองจุดแบ่ง $\sim n^3$ |
|:---:|:---:|:---:|
| 4 คำ | 10 | 64 |
| 10 คำ | 55 | 1,000 |
| 20 คำ | 210 | 8,000 |

ความซับซ้อนรวม $O(n^3\cdot\lvert G\rvert)$

---

### 4.4  Dependency Parsing (Transition-based)

**Dependency Parsing** คือการหาว่าคำไหนเป็นหัว (head) ของคำไหน ส่วน **Transition-based parsing** สร้างความสัมพันธ์นี้ทีละก้าวด้วย SHIFT, LEFTARC และ RIGHTARC

#### 4.4.1  Transition-based Parsing: "เด็ก กิน ข้าว"

จงแสดงขั้นตอน arc-standard transition-based dependency parsing ของประโยค "เด็ก กิน ข้าว" ทีละ step (stack, buffer, action, relation ที่เพิ่ม) เมื่อต้นไม้เฉลยคือ $\text{กิน}\to\text{เด็ก}$ (nsubj), $\text{กิน}\to\text{ข้าว}$ (obj) และ $\text{ROOT}\to\text{กิน}$ (root)

$\mathbf{Sol}^{n}$

ที่แต่ละ step ดู $S_1$ (คำบนสุดของ stack) และ $S_2$ (คำถัดลงไป) แล้วเลือก LEFTARC ถ้า $(S_1\ r\ S_2)$ อยู่ในเฉลย เลือก RIGHTARC ถ้า $(S_2\ r\ S_1)$ อยู่ในเฉลยและ dependent ของ $S_1$ เชื่อมครบแล้ว นอกนั้น SHIFT

| Step | Stack | Buffer | Action | เหตุผล | Relation ที่เพิ่ม |
|:---:|:---|:---|:---|:---|:---|
| 0 | [ROOT] | [เด็ก, กิน, ข้าว] | SHIFT | stack มีแค่ ROOT | - |
| 1 | [ROOT, เด็ก] | [กิน, ข้าว] | SHIFT | ไม่เข้าเงื่อนไข arc ใด | - |
| 2 | [ROOT, เด็ก, กิน] | [ข้าว] | LEFTARC(nsubj) | $S_1$=กิน, $S_2$=เด็ก และ (กิน nsubj เด็ก) อยู่ในเฉลย | กิน → เด็ก |
| 3 | [ROOT, กิน] | [ข้าว] | SHIFT | (ROOT root กิน) มีในเฉลย แต่ dependent ของกิน (ข้าว) ยังไม่เชื่อม จึงยังทำ RIGHTARC ไม่ได้ | - |
| 4 | [ROOT, กิน, ข้าว] | [ ] | RIGHTARC(obj) | $S_2$=กิน, $S_1$=ข้าว และ (กิน obj ข้าว) อยู่ในเฉลย ข้าวไม่มี dependent | กิน → ข้าว |
| 5 | [ROOT, กิน] | [ ] | RIGHTARC(root) | $S_2$=ROOT, $S_1$=กิน และ dependent ของกินเชื่อมครบแล้ว | ROOT → กิน |
| 6 | [ROOT] | [ ] | Done | stack เหลือแค่ ROOT และ buffer ว่าง | - |

ใช้ทั้งหมด $6$ transitions $=2n$ เมื่อ $n=3$ คำ ($O(n)$)

$\mathbf{Ans}$

$$
\begin{aligned}
\text{ROOT} &\xrightarrow{\text{root}} \text{กิน} \\
\text{กิน} &\xrightarrow{\text{nsubj}} \text{เด็ก} \\
\text{กิน} &\xrightarrow{\text{obj}} \text{ข้าว}
\end{aligned}
$$

---

#### 4.4.2  Transition-based Parsing: "book me the morning flight"

กำหนดประโยค "book me the morning flight" และต้นไม้เฉลย $\text{book}\to\text{me}$, $\text{flight}\to\text{morning}$, $\text{flight}\to\text{the}$, $\text{book}\to\text{flight}$ และ $\text{root}\to\text{book}$ จงแสดงขั้นตอน arc-standard ทีละ step (stack, buffer, action, relation ที่เพิ่ม)

$\mathbf{Sol}^{n}$

ที่แต่ละ step ดู $S_1$ (คำบนสุดของ stack) และ $S_2$ (คำถัดลงไป) แล้วเลือก LEFTARC ถ้า $S_1$ เป็น head ของ $S_2$ ในเฉลย เลือก RIGHTARC ถ้า $S_2$ เป็น head ของ $S_1$ ในเฉลยและ dependent ของ $S_1$ เชื่อมครบแล้ว นอกนั้น SHIFT

| Step | Stack | Buffer | Action | เหตุผล | Relation ที่เพิ่ม |
|:---:|:---|:---|:---|:---|:---|
| 0 | [root] | [book, me, the, morning, flight] | SHIFT | stack มีแค่ root | - |
| 1 | [root, book] | [me, the, morning, flight] | SHIFT | book ยังมี dependent รออยู่ใน buffer | - |
| 2 | [root, book, me] | [the, morning, flight] | RIGHTARC | $S_2$=book เป็น head ของ $S_1$=me และ me ไม่มี dependent | book → me |
| 3 | [root, book] | [the, morning, flight] | SHIFT | book ยังมี dependent (flight) ที่ยังไม่เชื่อม | - |
| 4 | [root, book, the] | [morning, flight] | SHIFT | book กับ the ไม่มีความสัมพันธ์ในเฉลย | - |
| 5 | [root, book, the, morning] | [flight] | SHIFT | the กับ morning ไม่มีความสัมพันธ์ในเฉลย | - |
| 6 | [root, book, the, morning, flight] | [ ] | LEFTARC | $S_1$=flight เป็น head ของ $S_2$=morning | morning ← flight |
| 7 | [root, book, the, flight] | [ ] | LEFTARC | $S_1$=flight เป็น head ของ $S_2$=the | the ← flight |
| 8 | [root, book, flight] | [ ] | RIGHTARC | $S_2$=book เป็น head ของ $S_1$=flight และ dependent ของ flight เชื่อมครบแล้ว | book → flight |
| 9 | [root, book] | [ ] | RIGHTARC | $S_2$=root เป็น head ของ $S_1$=book และ dependent ของ book เชื่อมครบแล้ว | root → book |
| 10 | [root] | [ ] | Done | stack เหลือแค่ root และ buffer ว่าง | - |

ใช้ทั้งหมด $10$ transitions $=2n$ เมื่อ $n=5$ คำ

$\mathbf{Ans}$

$$
\text{root}\to\text{book},\quad \text{book}\to\text{me},\quad \text{book}\to\text{flight},\quad \text{flight}\to\text{the},\quad \text{flight}\to\text{morning}
$$

---

### 4.5  Parsing Evaluation

**การประเมินผล parser:** constituency ใช้ PARSEVAL (Precision, Recall, $F_1$ ของ constituent) ส่วน dependency ใช้ UAS (head ถูก) และ LAS (head และ label ถูก)

#### 4.5.1  PARSEVAL

ระบบ parse ประโยค "แมว ดำ กิน ปลา" ตอบ constituent $S(1\text{-}4),\ NP(1\text{-}2),\ VP(3\text{-}4),\ NP(3\text{-}4)$ ส่วนเฉลยคือ $S(1\text{-}4),\ NP(1\text{-}2),\ VP(3\text{-}4),\ NP(4\text{-}4)$ จงหา Labeled Precision, Recall และ $F_1$ (PARSEVAL)

$\mathbf{Sol}^{n}$

constituent ถูกก็ต่อเมื่อ label และช่วงตรงกับเฉลยทั้งคู่ นับจำนวนที่ถูก จำนวนที่ระบบตอบ และจำนวนที่มีในเฉลย

| Constituent | ในเฉลย | ในระบบ | ผล |
|:---:|:---:|:---:|:---:|
| $S(1\text{-}4)$ | มี | มี | ถูก |
| $NP(1\text{-}2)$ | มี | มี | ถูก |
| $VP(3\text{-}4)$ | มี | มี | ถูก |
| $NP(4\text{-}4)$ | มี | ไม่มี | พลาด |
| $NP(3\text{-}4)$ | ไม่มี | มี | เกินมา |

$$
\begin{aligned}
P &= \frac{3}{4} = 0.75 &&\text{ถูก 3 จากที่ระบบตอบ 4} \\
R &= \frac{3}{4} = 0.75 &&\text{ถูก 3 จากที่มีในเฉลย 4} \\
F_1 &= \frac{2PR}{P+R} = \frac{2(0.75)(0.75)}{0.75+0.75} = 0.75
\end{aligned}
$$

$\mathbf{Ans}\quad P=\mathbf{0.75},\ R=\mathbf{0.75},\ F_1=\mathbf{0.75}$

---

#### 4.5.2  UAS และ LAS

ประโยค "เด็ก เห็น ผู้ชาย ด้วย กล้อง" มีเฉลยและผลของระบบดังตาราง จงหา UAS และ LAS

| คำ | เฉลย: head / label | ระบบ: head / label |
|:---:|:---:|:---:|
| เด็ก | เห็น / nsubj | เห็น / nsubj |
| เห็น | ROOT / root | ROOT / root |
| ผู้ชาย | เห็น / obj | เห็น / iobj |
| ด้วย | กล้อง / case | กล้อง / case |
| กล้อง | เห็น / obl | ผู้ชาย / nmod |

$\mathbf{Sol}^{n}$

UAS นับคำที่ head ถูก ส่วน LAS นับคำที่ head และ label ถูกทั้งคู่ แล้วหารด้วยจำนวนคำทั้งหมด

| คำ | head ถูก | label ถูก | นับใน UAS | นับใน LAS |
|:---:|:---:|:---:|:---:|:---:|
| เด็ก | ใช่ | ใช่ | 1 | 1 |
| เห็น | ใช่ | ใช่ | 1 | 1 |
| ผู้ชาย | ใช่ | ไม่ใช่ ($obj\neq iobj$) | 1 | 0 |
| ด้วย | ใช่ | ใช่ | 1 | 1 |
| กล้อง | ไม่ใช่ | ไม่ใช่ | 0 | 0 |
| รวม | | | 4 | 3 |

$\mathbf{Ans}\quad \text{UAS}=\dfrac{4}{5}=\mathbf{0.80}\quad\text{และ}\quad \text{LAS}=\dfrac{3}{5}=\mathbf{0.60}$

---

## ข้อ 5 Word Embedding (3 คะแนน)

**Word Embedding** คือการแทนคำด้วยเวกเตอร์ตัวเลขแบบสั้นและหนาแน่น (dense, ประมาณ 100 ถึง 300 มิติ) ที่จับความหมายของคำ โดยคำที่ความหมายคล้ายกันจะมีเวกเตอร์อยู่ใกล้กัน

แนวคิดพื้นฐานคือ **Distributional Hypothesis** ว่า คำที่ปรากฏในบริบทคล้ายกัน มักมีความหมายคล้ายกัน มี 2 แนวทางหลัก คือ **count-based** (นับการปรากฏร่วมกัน แล้วถ่วงน้ำหนักด้วย PMI หรือ TF-IDF) และ **prediction-based** (เช่น word2vec ที่ฝึก classifier ให้ทำนายคำบริบท แล้วใช้น้ำหนักที่ได้เป็น embedding)

### 5.1  One-hot และ Dense Vector

**One-hot encoding** แทนคำด้วยเวกเตอร์ที่มี $1$ เพียงตำแหน่งเดียว จึงวัดความคล้ายของคำไม่ได้ ส่วน **Dense embedding** แทนด้วยเวกเตอร์สั้นค่าจริง และคำที่ความหมายใกล้กันมีเวกเตอร์ใกล้กัน

#### 5.1.1  One-Hot Encoding

กำหนดคลังคำ $V=\{\text{แมว},\ \text{หมา},\ \text{คน},\ \text{กิน}\}$ จงเขียน one-hot vector ของแต่ละคำ และหา $\text{แมว}\cdot\text{หมา}$

$\mathbf{Sol}^{n}$

วิธีทำ เวกเตอร์มีขนาด $\lvert V\rvert=4$ ใส่ $1$ ที่ตำแหน่งของคำนั้น ตำแหน่งอื่นเป็น $0$ แล้วหา dot product

$$
\begin{aligned}
\text{แมว} &= [1,\ 0,\ 0,\ 0] \\
\text{หมา} &= [0,\ 1,\ 0,\ 0] \\
\text{คน} &= [0,\ 0,\ 1,\ 0] \\
\text{กิน} &= [0,\ 0,\ 0,\ 1] \\
\text{แมว}\cdot\text{หมา} &= 1(0)+0(1)+0(0)+0(0) = 0
\end{aligned}
$$

$\mathbf{Ans}\quad$ ขนาดเวกเตอร์ $=\lvert V\rvert=\mathbf{4}$ และ $\text{แมว}\cdot\text{หมา}=\mathbf{0}$ (คู่คำต่างกันได้ $0$ เสมอ จึงวัดความคล้ายของความหมายไม่ได้)

---

### 5.2  Count-based Representations

**Count-based representation** คือการแทนคำด้วยเวกเตอร์ที่ได้จากการนับว่าคำนั้นปรากฏร่วมกับคำอื่นบ่อยแค่ไหน แล้ววัดความคล้ายด้วย cosine similarity

#### 5.2.1  Cosine Similarity

กำหนดเมทริกซ์ Term-Term ต่อไปนี้ จงหา cosine similarity ของ (แมว, หมา) และ (แมว, คน) จากความถี่ดิบ แล้วบอกว่าคู่ใดคล้ายกันมากกว่า

| | กิน | อาหาร | อ่าน | หนังสือ | รวมแถว |
|:---:|:---:|:---:|:---:|:---:|:---:|
| แมว | 50 | 30 | 1 | 0 | 81 |
| หมา | 45 | 35 | 0 | 1 | 81 |
| คน | 40 | 25 | 35 | 50 | 150 |
| รวมคอลัมน์ | 135 | 90 | 36 | 51 | 312 |

$\mathbf{Sol}^{n}$

ใช้ $\cos(\mathbf{a},\mathbf{b})=\dfrac{\mathbf{a}\cdot\mathbf{b}}{|\mathbf{a}|\,|\mathbf{b}|}$ โดยหา dot product และขนาดของแต่ละเวกเตอร์ก่อน

$$
\begin{aligned}
|\text{แมว}| &= \sqrt{50^2+30^2+1^2+0^2} = \sqrt{3401} = 58.318 \\
|\text{หมา}| &= \sqrt{45^2+35^2+0^2+1^2} = \sqrt{3251} = 57.018 \\
|\text{คน}| &= \sqrt{40^2+25^2+35^2+50^2} = \sqrt{5950} = 77.136 \\
\text{แมว}\cdot\text{หมา} &= 50(45)+30(35)+1(0)+0(1) = 3300 \\
\text{แมว}\cdot\text{คน} &= 50(40)+30(25)+1(35)+0(50) = 2785 \\
\cos(\text{แมว},\text{หมา}) &= \frac{3300}{58.318\times57.018} = 0.9924 \\
\cos(\text{แมว},\text{คน}) &= \frac{2785}{58.318\times77.136} = 0.6191
\end{aligned}
$$

$\mathbf{Ans}\quad \cos(\text{แมว},\text{หมา})=\mathbf{0.9924}$ และ $\cos(\text{แมว},\text{คน})=\mathbf{0.6191}$ ดังนั้นแมวกับหมาคล้ายกันมากกว่า

---

#### 5.2.2  PMI และ PPMI

จากเมทริกซ์ในข้อ 5.2.1 ($N=312$) จงหา PMI ของทุกช่อง แล้วตัดค่าลบเป็น PPMI

$\mathbf{Sol}^{n}$

ใช้ $\text{PMI}(w,c)=\log_2\dfrac{P(w,c)}{P(w)P(c)}=\log_2\dfrac{N\cdot f(w,c)}{f(w)\,f(c)}$ และ $\text{PPMI}=\max(\text{PMI},0)$ ถ้า $f(w,c)=0$ ถือว่า PMI เป็น $-\infty$ และ PPMI เป็น $0$

ตัวอย่างการคำนวณ

$$
\begin{aligned}
\text{PMI}(\text{แมว},\text{กิน}) &= \log_2\frac{0.1603}{0.2596\times0.4327} = \log_2 1.4266 = 0.513 &&P=\tfrac{50}{312},\ \tfrac{81}{312},\ \tfrac{135}{312} \\
\text{PMI}(\text{คน},\text{หนังสือ}) &= \log_2\frac{312\times50}{150\times51} = \log_2 2.0392 = 1.028
\end{aligned}
$$

ทำซ้ำทุกช่องด้วยสูตรเดียวกัน

| PMI | กิน | อาหาร | อ่าน | หนังสือ |
|:---:|:---:|:---:|:---:|:---:|
| แมว | 0.513 | 0.361 | $-3.224$ | $-\infty$ |
| หมา | 0.361 | 0.583 | $-\infty$ | $-3.727$ |
| คน | $-0.698$ | $-0.791$ | 1.016 | 1.028 |

ตัดค่าลบเป็น $0$

$\mathbf{Ans}$

| PPMI | กิน | อาหาร | อ่าน | หนังสือ |
|:---:|:---:|:---:|:---:|:---:|
| แมว | 0.513 | 0.361 | 0 | 0 |
| หมา | 0.361 | 0.583 | 0 | 0 |
| คน | 0 | 0 | 1.016 | 1.028 |

---

#### 5.2.3  Cosine จากเวกเตอร์ PPMI

จากเวกเตอร์ PPMI ในข้อ 5.2.2 จงหา $\cos(\text{แมว},\text{หมา})$ และ $\cos(\text{แมว},\text{คน})$ แล้วเปรียบเทียบกับข้อ 5.2.1

$\mathbf{Sol}^{n}$

เวกเตอร์ PPMI คือ แมว $=[0.513,\,0.361,\,0,\,0]$, หมา $=[0.361,\,0.583,\,0,\,0]$ และ คน $=[0,\,0,\,1.016,\,1.028]$

$$
\begin{aligned}
\text{แมว}\cdot\text{หมา} &= 0.513(0.361)+0.361(0.583) = 0.1852+0.2105 = 0.3957 \\
|\text{แมว}| &= \sqrt{0.513^2+0.361^2} = 0.6273 \\
|\text{หมา}| &= \sqrt{0.361^2+0.583^2} = 0.6857 \\
\cos(\text{แมว},\text{หมา}) &= \frac{0.3957}{0.6273\times0.6857} = 0.92 \\
\text{แมว}\cdot\text{คน} &= 0 &&\text{ไม่มีมิติที่ไม่เป็นศูนย์ร่วมกัน} \\
\cos(\text{แมว},\text{คน}) &= 0
\end{aligned}
$$

| คู่ | cosine จากความถี่ดิบ (ข้อ 5.2.1) | cosine จาก PPMI |
|:---:|:---:|:---:|
| (แมว, หมา) | 0.9924 | 0.92 |
| (แมว, คน) | 0.6191 | 0.00 |

$\mathbf{Ans}\quad \cos(\text{แมว},\text{หมา})=\mathbf{0.92}$ และ $\cos(\text{แมว},\text{คน})=\mathbf{0}$ PPMI แยกกลุ่มความหมายได้ชัดเจนกว่าความถี่ดิบมาก

---

#### 5.2.4  Weighted PMI

กำหนดเมทริกซ์ Term-Term ที่เพิ่มคอลัมน์ "เหมียว" ต่อไปนี้ จงหา PMI ของ (แมว, กิน), (แมว, อาหาร), (แมว, อ่าน) และ (แมว, เหมียว) แล้วบอกว่าคู่ใดได้ค่าสูงสุดทั้งที่พบน้อย

| | กิน | อาหาร | อ่าน | เหมียว | รวมแถว |
|:---:|:---:|:---:|:---:|:---:|:---:|
| แมว | 50 | 30 | 1 | 1 | 82 |
| หมา | 45 | 35 | 0 | 0 | 80 |
| คน | 40 | 25 | 35 | 0 | 100 |
| รวมคอลัมน์ | 135 | 90 | 36 | 1 | 262 |

$\mathbf{Sol}^{n}$

วิธีทำ ใช้ $\text{PMI}(w,c)=\log_2\dfrac{N\cdot f(w,c)}{f(w)\,f(c)}$ โดย $N=262$

$$
\begin{aligned}
\text{PMI}(\text{แมว},\text{กิน}) &= \log_2\frac{262\times50}{82\times135} = \log_2\frac{13100}{11070} = \log_2 1.1834 = 0.243 \\
\text{PMI}(\text{แมว},\text{อาหาร}) &= \log_2\frac{262\times30}{82\times90} = \log_2\frac{7860}{7380} = \log_2 1.0650 = 0.091 \\
\text{PMI}(\text{แมว},\text{อ่าน}) &= \log_2\frac{262\times1}{82\times36} = \log_2\frac{262}{2952} = \log_2 0.0888 = -3.494 \\
\text{PMI}(\text{แมว},\text{เหมียว}) &= \log_2\frac{262\times1}{82\times1} = \log_2 3.1951 = 1.676
\end{aligned}
$$

$\mathbf{Ans}\quad$ PMI $=0.243,\ 0.091,\ -3.494$ และ $1.676$ ตามลำดับ คู่ (แมว, เหมียว) ได้ค่าสูงสุดทั้งที่ปรากฏเพียง 1 ครั้ง แสดงว่า PMI เอนเอียงกับเหตุการณ์ที่เกิดน้อย แก้ด้วย K-smoothing (เพิ่มค่า $k=2$ ในทุกช่อง) หรือ context distribution smoothing $P_\alpha(c)=\dfrac{\text{count}(c)^\alpha}{\sum_c \text{count}(c)^\alpha}$

หมายเหตุ สไลด์เขียนค่า (แมว, กิน) เป็น $0.244$ ผมคำนวณซ้ำได้ $0.243$

---

#### 5.2.5  TF-IDF

กำหนดเอกสาร 3 ฉบับ ($N=3$) ดังตาราง จงหา $\text{tf-idf}(\text{เป็ด},d_1)$, $\text{tf-idf}(\text{ที่},d_1)$ และ $\text{tf-idf}(\text{รถ},d_3)$ ด้วยสูตร $\text{tf}=1+\log_{10}\text{count}$ และ $\text{idf}=\log_{10}\dfrac{N}{\text{df}}$ แล้วอธิบายว่าทำไม "ที่" จึงได้ค่าเป็นศูนย์

| word | $d_1$ | $d_2$ | $d_3$ |
|:---:|:---:|:---:|:---:|
| เป็ด | 3 | 2 | 0 |
| ที่ | 10 | 8 | 9 |
| รถ | 0 | 0 | 5 |

$\mathbf{Sol}^{n}$

หา df ของแต่ละคำ (จำนวนเอกสารที่มีคำนั้น) แล้วคำนวณ idf, tf ในเอกสารที่ถาม และคูณกัน

$$
\begin{aligned}
\text{เป็ด: } \text{df}=2 &\Rightarrow \text{idf}=\log_{10}\tfrac{3}{2}=0.1761 \\
\text{ที่: } \text{df}=3 &\Rightarrow \text{idf}=\log_{10}\tfrac{3}{3}=0 \\
\text{รถ: } \text{df}=1 &\Rightarrow \text{idf}=\log_{10}3=0.4771 \\[4pt]
\text{tf-idf}(\text{เป็ด},d_1) &= (1+\log_{10}3)\times0.1761 = 1.4771\times0.1761 = 0.260 \\
\text{tf-idf}(\text{ที่},d_1) &= (1+\log_{10}10)\times0 = 2\times0 = 0 \\
\text{tf-idf}(\text{รถ},d_3) &= (1+\log_{10}5)\times0.4771 = 1.699\times0.4771 = 0.811
\end{aligned}
$$

"ที่" ปรากฏในทุกเอกสาร ($\text{df}=N$) จึงได้ $\text{idf}=\log_{10}1=0$ ไม่ว่าจะพบกี่ครั้ง TF-IDF ก็เป็น $0$ ส่วน "รถ" พบเฉพาะ $d_3$ ($\text{df}=1$) จึงได้ idf สูงสุด

$\mathbf{Ans}\quad \text{tf-idf}(\text{เป็ด},d_1)=\mathbf{0.260},\ \ \text{tf-idf}(\text{ที่},d_1)=\mathbf{0},\ \ \text{tf-idf}(\text{รถ},d_3)=\mathbf{0.811}$

หมายเหตุ ตัวอย่างตัวเลขในสไลด์ใช้ $\text{tf}=\log_{10}(\text{count}+1)$ ได้ $0.106,\ 0,\ 0.371$ ซึ่งไม่ตรงกับสูตรที่สไลด์เขียนไว้ ถ้าข้อสอบกำหนดสูตรมาให้ ให้ใช้ตามที่กำหนด

---

### 5.3  word2vec และ Static Embedding

**word2vec** เรียนรู้เวกเตอร์ของคำจากการทำนายคำที่อยู่ใกล้กัน **FastText** แทนคำด้วยชิ้นส่วนตัวอักษร (character n-grams) เพื่อรองรับคำใหม่ และ **GloVe** ใช้สถิติการปรากฏร่วมของทั้งคลังข้อมูล

#### 5.3.1  Skip-gram: คู่ Positive และ Negative

ประโยค `... lemon, a tablespoon of apricot jam, a pinch ...` กำหนด target word คือ apricot หน้าต่าง $L=\pm2$ และ negative sampling $k=2$ จงระบุคู่ positive ทั้งหมดและบอกจำนวนคู่ negative

$\mathbf{Sol}^{n}$

วิธีทำ คำบริบทคือคำที่อยู่ในหน้าต่าง $\pm L$ ของ target แต่ละคำบริบทให้ positive 1 คู่ และแต่ละ positive ให้ negative $k$ คู่ (สุ่มคำอื่นจากคลังคำ)

คำบริบทของ apricot ในหน้าต่าง $\pm2$ คือ tablespoon, of, jam, a รวม 4 คำ

| positive | $w$ | $c_{pos}$ |
|:---:|:---:|:---:|
| 1 | apricot | tablespoon |
| 2 | apricot | of |
| 3 | apricot | jam |
| 4 | apricot | a |

$$
\text{จำนวน negative} = 4\times k = 4\times 2 = 8\ \text{คู่}\quad(\text{เช่น apricot กับ aardvark, my, where, coaxial, seven, forever, dear, if})
$$

$\mathbf{Ans}\quad$ positive $=\mathbf{4}$ คู่ และ negative $=\mathbf{8}$ คู่

---

#### 5.3.2  FastText: Character n-grams

กำหนดกฎ: เติม $<$ และ $>$ ครอบหัวท้ายคำ แตกเป็น character n-grams ขนาด $n=3$ และเพิ่มคำเต็ม (รวม $<$ $>$) เป็น token ด้วย จงแตกคำ "where" และ "ความสุข"

$\mathbf{Sol}^{n}$

วิธีทำ เติม $<$ $>$ ครอบคำ แล้วเลื่อนหน้าต่างขนาด 3 ตัวอักษรไปทีละ 1 ตำแหน่ง จากนั้นเพิ่มคำเต็ม

$$
\begin{aligned}
\text{where} &\to \text{<where>} \\
&\to \text{<wh},\ \text{whe},\ \text{her},\ \text{ere},\ \text{re>} \qquad (5\ \text{n-grams}) \\
&\ \ \ +\ \text{<where>} \\[4pt]
\text{ความสุข} &\to \text{<ความสุข>} \\
&\to \text{<คว},\ \text{ควา},\ \text{วาม},\ \text{ามส},\ \text{มสุ},\ \text{สุข},\ \text{ุข>} \qquad (7\ \text{n-grams}) \\
&\ \ \ +\ \text{<ความสุข>}
\end{aligned}
$$

$\mathbf{Ans}\quad$ "where" ได้ $5$ n-grams รวมคำเต็มเป็น $6$ token และ "ความสุข" ได้ $7$ n-grams รวมคำเต็มเป็น $8$ token (ตัวสระ "ุ" นับเป็น 1 ตัวอักษร) คำใหม่ที่ไม่เคยเห็นก็ประกอบเวกเตอร์ได้จาก n-gram ที่ใช้ร่วมกับคำที่เคยเห็น

---

#### 5.3.3  GloVe: อัตราส่วนความน่าจะเป็น

กำหนดความน่าจะเป็นของคำ $k$ ที่ปรากฏร่วมกับ ice และ steam ดังตาราง จงหา $\dfrac{P(k\mid\text{ice})}{P(k\mid\text{steam})}$ แล้วบอกว่าคำ $k$ แต่ละคำเกี่ยวข้องกับ ice, steam หรือไม่

| | $k$ = solid | $k$ = gas | $k$ = water | $k$ = fashion |
|:---:|:---:|:---:|:---:|:---:|
| $P(k\mid\text{ice})$ | $1.9\times10^{-4}$ | $6.6\times10^{-5}$ | $3.0\times10^{-3}$ | $1.7\times10^{-5}$ |
| $P(k\mid\text{steam})$ | $2.2\times10^{-5}$ | $7.8\times10^{-4}$ | $2.2\times10^{-3}$ | $1.8\times10^{-5}$ |

$\mathbf{Sol}^{n}$

วิธีทำ หารความน่าจะเป็นของ ice ด้วยของ steam ทีละคำ ถ้าอัตราส่วนมากกว่า 1 มาก แสดงว่าคำนั้นเกี่ยวกับ ice ถ้าน้อยกว่า 1 มาก เกี่ยวกับ steam และถ้าใกล้ 1 เกี่ยวกับทั้งสองหรือไม่เกี่ยวกับทั้งคู่

$$
\begin{aligned}
\text{solid} &: \frac{1.9\times10^{-4}}{2.2\times10^{-5}} = 8.64 \\
\text{gas} &: \frac{6.6\times10^{-5}}{7.8\times10^{-4}} = 0.0846 \\
\text{water} &: \frac{3.0\times10^{-3}}{2.2\times10^{-3}} = 1.36 \\
\text{fashion} &: \frac{1.7\times10^{-5}}{1.8\times10^{-5}} = 0.944
\end{aligned}
$$

$\mathbf{Ans}$

| $k$ | อัตราส่วน | ความหมาย |
|:---:|:---:|:---|
| solid | 8.64 | มากกว่า 1 มาก เกี่ยวกับ ice |
| gas | 0.0846 | น้อยกว่า 1 มาก เกี่ยวกับ steam |
| water | 1.36 | ใกล้ 1 เกี่ยวกับทั้งสอง |
| fashion | 0.944 | ใกล้ 1 ไม่เกี่ยวกับทั้งคู่ |

หมายเหตุ สไลด์เขียนอัตราส่วนของ solid เป็น $8.9$ และ fashion เป็น $0.96$ แต่คำนวณจากค่าที่แสดงในตารางได้ $8.64$ และ $0.944$ น่าจะมาจากการปัดเศษของความน่าจะเป็นในตาราง ส่วน gas ($8.5\times10^{-2}$) และ water ($1.36$) ตรงกัน

---

### 5.4  Evaluation ของ Word Embeddings

**Intrinsic evaluation** วัดคุณภาพเวกเตอร์โดยตรง ส่วน **Extrinsic evaluation** นำ embedding ไปใช้ในงานจริงแล้วดูผล

#### 5.4.1  Word Similarity: เทียบอันดับ

กำหนดคะแนนความคล้ายที่มนุษย์ให้ (0 ถึง 10) และ cosine ของโมเดล ดังตาราง จงจัดอันดับ (มากไปน้อย) ตามมนุษย์และตามโมเดล แล้วนับว่าอันดับตรงกันกี่คู่

| คู่คำ | คะแนนมนุษย์ | cosine ของโมเดล |
|:---:|:---:|:---:|
| แมว – หมา | 9.0 | 0.92 |
| กิน – ทาน | 8.5 | 0.65 |
| รถ – รถยนต์ | 7.0 | 0.81 |
| แมว – หนังสือ | 3.0 | 0.30 |
| ปลา – คอมพิวเตอร์ | 1.5 | 0.12 |

$\mathbf{Sol}^{n}$

วิธีทำ เรียงค่าจากมากไปน้อย ให้อันดับ 1 คือค่ามากที่สุด ทำแยกกันสำหรับคะแนนมนุษย์และ cosine แล้วเทียบอันดับของแต่ละคู่

| คู่คำ | อันดับมนุษย์ | อันดับโมเดล | ตรงกัน |
|:---:|:---:|:---:|:---:|
| แมว – หมา | 1 | 1 | ตรง |
| กิน – ทาน | 2 | 3 | ไม่ตรง |
| รถ – รถยนต์ | 3 | 2 | ไม่ตรง |
| แมว – หนังสือ | 4 | 4 | ตรง |
| ปลา – คอมพิวเตอร์ | 5 | 5 | ตรง |

$\mathbf{Ans}\quad$ อันดับตรงกัน $\mathbf{3}$ จาก $5$ คู่ (ต่างกันที่ กิน – ทาน และ รถ – รถยนต์ ซึ่งสลับอันดับกัน)

---

#### 5.4.2  Word Analogy (Parallelogram)

กำหนดวิธี parallelogram $\hat{b}^*=\arg\min_x\,\text{distance}(x,\ b-a+a^*)$ จงเขียนเวกเตอร์เป้าหมาย $b-a+a^*$ และตอบ $b^*$ ของโจทย์ (1) man : king :: woman : ? (2) ไทย : กรุงเทพ :: ญี่ปุ่น : ? และ (3) apple : tree :: grape : ?

$\mathbf{Sol}^{n}$

วิธีทำ ระบุ $a$, $b$, $a^*$ ของแต่ละโจทย์ แล้วคำนวณ $b-a+a^*$ คำที่มีเวกเตอร์ใกล้กับผลนี้ที่สุดคือ $b^*$

| โจทย์ | $a$ | $b$ | $a^*$ | เวกเตอร์เป้าหมาย $b-a+a^*$ | $b^*$ |
|:---:|:---:|:---:|:---:|:---:|:---:|
| (1) | man | king | woman | $\text{king}-\text{man}+\text{woman}$ | queen |
| (2) | ไทย | กรุงเทพ | ญี่ปุ่น | $\text{กรุงเทพ}-\text{ไทย}+\text{ญี่ปุ่น}$ | โตเกียว |
| (3) | apple | tree | grape | $\text{tree}-\text{apple}+\text{grape}$ | vine |

$\mathbf{Ans}\quad b^*=\mathbf{queen}$, $\textbf{โตเกียว}$ และ $\mathbf{vine}$ ตามลำดับ (ตัวอย่างจากสไลด์ ซึ่งสไลด์ไม่ได้ให้เวกเตอร์ตัวเลข จึงตอบด้วยสมการ)
