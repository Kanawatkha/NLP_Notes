# บทที่ 2: Word Segmentation, POS Tagging และ Sequence Labeling

# ส่วนที่ 1: Word Segmentation

## 1. Why we need Word Segmentation?

- ภาษาอังกฤษใช้ช่องว่างคั่นคำ (`"I go to school"`) แต่ภาษาไทย จีน ญี่ปุ่นเขียนติดกัน (`"ฉันไปโรงเรียน"`) จึงต้อง **อนุมานขอบเขตคำ**

| ปัญหา | ความหมาย |
|---|---|
| ไม่มีตัวคั่นคำ | ไทย จีน ญี่ปุ่นเขียนติดกัน ไม่มี whitespace ระหว่างคำ |
| คำกำกวม (Ambiguity) | สายอักขระเดียวกันตัดได้หลายแบบ ความหมายต่างกัน เช่น "ตากลม" |
| ไม่มีนิยาม "คำ" ที่ตายตัว | (สไลด์ไม่มีคำอธิบายเพิ่มในข้อนี้) |

## 2. Segmentation Approaches

| แนวทาง | หลักการ |
|---|---|
| Dictionary-based Matching | จับคำที่ยาวที่สุด/สั้นที่สุดกับพจนานุกรม (lexicon) เช่น maximum matching |
| Rule-based Heuristics | ใช้กฎทางภาษาศาสตร์ที่มนุษย์เขียน แก้ขอบเขตที่กำกวม |
| Statistical / ML-based | ตัวจำแนกระดับตัวอักษรหรือโมเดลลำดับทำนายขอบเขต เช่น HMM, CRF, Deep Learning (LSTM/Transformer) |

## 3. Maximum Matching

**แนวคิด:** เริ่มจากตำแหน่งแรก พยายามจับสายอักขระที่ **ยาวที่สุด** ที่มีในพจนานุกรมก่อน ถ้าไม่พบให้ลดความยาวลงทีละ 1 ตัวอักษร

- **FMM (Forward Maximum Matching):** สแกนซ้ายไปขวา
- **BMM (Backward Maximum Matching):** แนวคิดเดียวกัน แต่เริ่มจากขวาสุดแล้วไล่มาซ้าย

### ตัวอย่างที่ 1: FMM ตัดคำ "นักเรียนไปโรงเรียน"

พจนานุกรมย่อ: { นัก, นักเรียน, เรียน, ไป, โรง, โรงเรียน, ... }

| ขั้น | การลอง | ตัด |
|---|---|---|
| 1 | ลอง "นักเรียนไป" ไม่พบ → ลดทีละตัว ... → ลอง "นักเรียน" พบ | นักเรียน |
| 2 | ลอง "ไปโรงเรี" ไม่พบ → ลดทีละตัว ... → ลอง "ไป" พบ | ไป |
| 3 | ลอง "โรงเรียน" พบ | โรงเรียน |

**ผลลัพธ์:** นักเรียน | ไป | โรงเรียน

> หมายเหตุ: สไลด์ใส่ตัวเลขความยาวในวงเล็บของแต่ละการลอง แต่ตัวเลขไม่สอดคล้องกันเอง จึงไม่นำมาใส่ในตาราง

### ตัวอย่างที่ 2: "ตากลม" (FMM เทียบ BMM)

ตา + กลม = round eyes (ตากลม) เทียบกับ ตาก + ลม = to air out (ตากลม)

| | FMM (ซ้าย → ขวา) | BMM (ขวา → ซ้าย) |
|---|---|---|
| ขั้น 1 | i=0: ลอง "ตากลม" (5) ไม่พบ, "ตากล" (4) ไม่พบ, "ตาก" (3) พบ → ตัด "ตาก" | j=5: ลอง "ตากลม" (5) ไม่พบ, "ากลม" (4) ไม่พบ, "กลม" (3) พบ → ตัด "กลม" |
| ขั้น 2 | i=3: ลอง "ลม" (2) พบ → ตัด "ลม" | j=2: ลอง "ตา" (2) พบ → ตัด "ตา" |
| **ผลลัพธ์** | **ตาก \| ลม** | **ตา \| กลม** |

สองวิธีให้ผลต่างกันกับข้อความเดียวกัน แสดงว่าเป็นวิธี greedy ที่แก้ความกำกวมไม่ได้ดี

## 4. Statistic Segmentation

**แนวคิด**

- แทนที่จะเลือกคำ "ยาวที่สุด" แบบโลภ ให้เลือก **ลำดับการตัดคำที่มีความน่าจะเป็นสูงสุด**
- ใช้ความถี่แบบ unigram/bigram จาก corpus ขนาดใหญ่ ประมาณค่าความน่าจะเป็นของแต่ละคำ
- เหมือนแนวคิดของ N-gram Language Model

**สูตร (unigram)** สำหรับทุกวิธีตัดคำที่เป็นไปได้:

$$\hat{W} = \arg\max_{W} \prod_i P(w_i)$$

**ขั้นตอน (ตัวอย่าง "ตากลม")**

1. นับความถี่ของแต่ละคำใน corpus (unigram frequency)
2. คำนวณ $P(\text{ตา}) \times P(\text{กลม})$ เทียบกับ $P(\text{ตาก}) \times P(\text{ลม})$
3. เลือกลำดับที่ผลคูณความน่าจะเป็นสูงกว่า

## 5. Prob 101

| # | หัวข้อ | สูตร |
|---|---|---|
| 1 | Classical Probability | $P(E) = \dfrac{N(E)}{N(S)}$ เมื่อ $N(E)$ = จำนวนกรณีที่เหตุการณ์ E เกิดขึ้น, $N(S)$ = จำนวนกรณีทั้งหมดใน sample space |
| 2 | Conditional Probability | $P(A \mid B) = \dfrac{P(A \cap B)}{P(B)}$ ความน่าจะเป็นของ A เมื่อรู้ว่า B เกิดขึ้นแล้ว |
| 3 | Chain Rule | $P(A_1, A_2, \ldots, A_n) = P(A_1) \cdot P(A_2 \mid A_1) \cdot P(A_3 \mid A_1, A_2) \cdots$ |
| 4 | Independence | $P(A \cap B) = P(A) \cdot P(B)$ ถ้า A, B เป็นอิสระต่อกัน |
| 5 | Bayes' Theorem | $P(A \mid B) = \dfrac{P(B \mid A) \cdot P(A)}{P(B)}$ |
| 6 | Law of Total Probability | $P(A) = \sum_i P(A \mid B_i) \cdot P(B_i)$ |

## 6. Statistical Segmentation Worked Example

toy corpus: จำนวนคำทั้งหมด = 500 + 80 + 60 + 200 = **840**

| คำ | ตา | กลม | ตาก | ลม |
|---|---|---|---|---|
| ความถี่ (count) | 500 | 80 | 60 | 200 |
| $P(w) = \text{count}/840$ | 0.595 | 0.095 | 0.071 | 0.238 |

| วิธีตัด | การคำนวณ | ผล |
|---|---|---|
| ตา + กลม | $P(\text{ตา}) \times P(\text{กลม}) = 0.595 \times 0.095$ | **0.0567** |
| ตาก + ลม | $P(\text{ตาก}) \times P(\text{ลม}) = 0.071 \times 0.238$ | **0.0170** |

0.0567 > 0.0170 → Statistical Segmentation เลือก **"ตา + กลม"**

## 7. สรุปเปรียบเทียบวิธีตัดคำภาษาไทย

| วิธี | แนวคิดหลัก | ข้อจำกัด / จุดเด่น |
|---|---|---|
| Maximum Matching (Forward/Backward) | จับคำยาวที่สุดกับพจนานุกรมแบบโลภ (greedy) | เร็ว ไม่ต้อง train แต่แก้ความกำกวมไม่ได้ดี ขึ้นกับพจนานุกรม |
| Statistical Segmentation | เลือกลำดับการตัดคำที่ให้ค่าความน่าจะเป็น (n-gram) สูงสุด | แก้ความกำกวมได้ดีกว่า ต้องมี corpus สถิติที่น่าเชื่อถือ |
| HMM / CRF (สถิติเชิงลำดับ) | มองการตัดคำเป็น sequence labeling | แม่นยำขึ้น ใช้ training data ที่ label แล้ว |
| Deep Learning (BiLSTM / Transformer) | เรียนรู้ลักษณะคำจากข้อมูลจำนวนมากโดยตรง (เช่น deepcut, PyThaiNLP) | แม่นยำสูงสุดในปัจจุบัน แต่ต้องใช้ข้อมูล/ทรัพยากรมาก |

---

# ส่วนที่ 2: POS Tagging

## 1. Part-of-Speech Tagging

- **POS Tagging** = กระบวนการกำหนด Part of Speech (noun, verb, adjective, ...) ให้กับ **ทุกคำ** ในประโยค
- ต่างจาก tokenization/segmentation: ตัดคำแล้ว POS Tagging บอกว่าแต่ละคำ "ทำหน้าที่อะไร" ในประโยค
- เป็นพื้นฐานของงานขั้นสูง เช่น Parsing, Named Entity Recognition, Information Extraction, Machine Translation
- คำเดียวกันอาจมีหลายหมวดคำได้ขึ้นกับบริบท

**ตัวอย่างจากสไลด์**

| Janet | will | back | the | bill |
|---|---|---|---|---|
| NNP | MD | VB | DT | NN |
| ชื่อ | กริยาช่วย | กริยา | นำหน้านาม | นาม |

**ทำไมยาก?** "back" เป็นได้ทั้ง VB (สนับสนุน/ถอยกลับ), NN (แผ่นหลัง), JJ (ข้างหลัง) หรือ RB ต้องดูบริบทจึงรู้ว่าเป็นหมวดคำใด

## 2. POS Tagset

### Penn Treebank tagset (ละเอียด 45 tags)

เฉพาะ tag ที่เกี่ยวข้องกับตัวอย่างในสไลด์ (จากตาราง Fig. 3.3):

| Tag | ความหมาย | ตัวอย่าง |
|---|---|---|
| NN | noun, singular or mass | table, shop |
| NNS | noun plural | tables, shops |
| NNP | proper noun, singular | Samsung |
| NNPS | proper noun, plural | Vikings |
| VB | verb, base form | drink |
| VBD | verb, past tense | drank |
| VBG | verb, gerund | drinking |
| VBN | verb, past participle | drunk |
| VBZ | verb, 3rd person singular present | drinks |
| MD | modal | can, could, shall, will |
| DT | determiner | a, the |
| JJ | adjective | big, wide, green |
| RB | adverb | however, quickly, here |
| IN | preposition, subordinating conjunction | in, of, by, like |
| CC | coordinating conjunction | and, but, or |
| CD | cardinal number | 1, third |
| TO | infinitive "to" | to |

### Universal tags (UD)

| Tag | ความหมาย | ตัวอย่าง |
|---|---|---|
| NOUN | คำนาม | algorithm, cat, mango |
| VERB | คำกริยา | draw, provide, go |
| ADJ | คำคุณศัพท์ | red, young, awesome |
| ADV | คำวิเศษณ์ | very, slowly, yesterday |
| PROPN | คำนามเฉพาะ | Regina, IBM, Colorado |
| DET | คำนำหน้านาม | a, an, the, this |
| ADP | คำบุพบท | in, on, by, under |
| PRON | คำสรรพนาม | she, who, I |

### ภาษาไทย

**ORCHID tagset** (NECTEC, ประมาณ 47 tags) เช่น NCMN = คำนามทั่วไป, VACT = กริยาแสดงการกระทำ

## 3. แนวทางการทำ POS Tagging

| แนวทาง | หลักการ |
|---|---|
| Rule-based | ใช้พจนานุกรมและกฎไวยากรณ์ที่มนุษย์เขียน เพื่อกำจัดความกำกวมของหมวดคำ |
| Stochastic / Statistical | ใช้ความถี่/ความน่าจะเป็นจาก corpus ที่ label ไว้แล้ว (เช่น HMM) ตัดสินหมวดคำที่เป็นไปได้มากที่สุด |
| Hybrid (TBL / Brill Tagger) | ผสาน stochastic (เดาเริ่มต้น) เข้ากับ rule-based (ปรับแก้ด้วยกฎ) เพื่อความแม่นยำสูงขึ้น |

**General Pipeline:** รับประโยคที่ตัดคำแล้ว (tokens/words) → ค้นหาหมวดคำที่เป็นไปได้ทั้งหมดของแต่ละคำจากพจนานุกรม → ใช้กฎหรือแบบจำลองทางสถิติเลือกหมวดคำที่ถูกต้องที่สุดตามบริบท → ได้ลำดับหมวดคำ (tag sequence) เป็นผลลัพธ์

## 4. Rule-based Tagging

**ขั้นตอน**

1. **Dictionary lookup:** ค้นพจนานุกรมหา "หมวดคำที่เป็นไปได้ทั้งหมด" ของแต่ละคำ (คำหนึ่งอาจมีหลายหมวดคำ)
2. **Disambiguation using rules:** ใช้กฎไวยากรณ์ (hand-written rules) พิจารณาบริบทของคำข้างเคียง เพื่อเลือกหมวดคำที่ถูกต้อง

**แหล่งความรู้เพิ่มเติม:** กฎของรูปคำ (-ed → past tense, -ing → verb ต่อเนื่อง, -ly → adverb) และตัวพิมพ์ใหญ่ (capitalization → proper noun)

**ตัวอย่างกฎจากสไลด์**

```text
a book
  a    -> DET (ชัดเจน)
  book -> NOUN หรือ VERB? (กำกวม)

Rule: ถ้าคำก่อนหน้าเป็น DET
      -> คำถัดไปต้องเป็น NOUN
  ดังนั้น "book" -> NOUN
```

- ข้อดี: อธิบายได้ (explainable), แม่นยำสูงถ้ากฎครอบคลุม
- ข้อเสีย: เขียนกฎเองใช้แรงงานมาก และปรับ scale ยาก

## 5. Stochastic / Statistical Tagging

- ใช้ **ความถี่** ของหมวดคำและลำดับหมวดคำจาก corpus ที่ label ไว้แล้ว (tagged corpus)
  - เลือกหมวดคำที่พบบ่อยที่สุดของคำนั้น โดยไม่ดูบริบท → **Unigram / Most-Frequent-Tag Baseline**
  - พิจารณาลำดับหมวดคำ (tag sequence) ทั้งประโยคพร้อมกัน → **Hidden Markov Model (HMM)**
- ข้อดี: เรียนรู้จากข้อมูลอัตโนมัติ ไม่ต้องเขียนกฎเอง
- ข้อเสีย: ต้องมี tagged corpus ขนาดใหญ่

## 6. Markov chain

Markov chain คือแบบจำลองที่มี **states** และ **transitions** พร้อมความน่าจะเป็นของการย้ายระหว่าง state ต้องมี **start distribution $\pi$**

**ตัวอย่างจากสไลด์ (Fig. 17.8)**

- (a) Markov chain ของสภาพอากาศ 3 states: HOT(1), COLD(2), WARM(3)
- (b) Markov chain ของคำ: are, uniformly, charming
- ตั้ง $\pi = [0.1, 0.7, 0.2]$ ใน (a) หมายถึง มีความน่าจะเป็น 0.7 ที่จะเริ่มใน state 2 (cold), 0.1 ใน state 1 (hot) และ 0.2 ใน state 3 (warm)

## 7. HMM (Hidden Markov Model)

### องค์ประกอบ

| สัญลักษณ์ | ชื่อ | ความหมายใน POS Tagging |
|---|---|---|
| $Q$ | set of N states | หมวดคำ (POS tags) ทั้งหมด |
| $A$ | transition probability matrix | $P(\text{tag}_i \mid \text{tag}_{i-1})$ ความน่าจะเป็นที่ย้ายจาก tag $i-1$ ไป tag $i$ |
| $B$ | observation likelihoods | $P(\text{word}_i \mid \text{tag}_i)$ ความน่าจะเป็นที่ tag จะปรากฏเป็นคำนั้น |
| $\pi$ | initial distribution | $\pi_i$ = ความน่าจะเป็นเริ่มต้นใน tag $i$ (tag แรกของประโยค) |

- **Observation** = ลำดับคำ, **Hidden State** = POS
- อินพุตของ HMM คือ $O = o_1 o_2 \ldots o_T$ ลำดับของ $T$ observations ที่มาจาก vocabulary $V$

### สมมติฐาน 2 ข้อ

| สมมติฐาน | สูตร |
|---|---|
| Markov Assumption | $P(q_i \mid q_1, \ldots, q_{i-1}) = P(q_i \mid q_{i-1})$ |
| Output Independence | $P(o_i \mid q_1, \ldots, q_i, \ldots, q_T, o_1, \ldots, o_i, \ldots, o_T) = P(o_i \mid q_i)$ |

**Fig. 17.9:** แผนภาพ HMM 3 states (MD, VB, NN) แสดง $A$ (ลูกศรระหว่าง state, $a_{ij}$) และ $B$ (ตาราง $P(\text{word} \mid \text{state})$ ของแต่ละ state เช่น $B_1$ = $P(\text{"will"} \mid \text{VB})$)

## 8. HMM tagging as Decoding

เป้าหมาย: หา tag sequence ที่น่าจะเป็นที่สุด

| ขั้น | สูตร | อธิบาย |
|---|---|---|
| (1) | $\hat{t} = \arg\max P(t_1 \ldots t_n \mid w_1 \ldots w_n)$ | เป้าหมาย: หา tag sequence ที่น่าจะเป็นที่สุด |
| (2) | $\hat{t} = \arg\max P(w_1 \ldots w_n \mid t_1 \ldots t_n)\, P(t_1 \ldots t_n)$ | ใช้ Bayes' Rule ($P(w)$ คงที่ จึงตัดทิ้งได้) |
| (3) | $P(w_1 \ldots w_n \mid t_1 \ldots t_n) \approx \prod P(w_i \mid t_i)$ | สมมติฐาน Output Independence |
| (4) | $P(t_1 \ldots t_n) \approx \prod P(t_i \mid t_{i-1})$ | สมมติฐาน Markov Assumption |

**สูตรสุดท้าย (17.17)**

$$\hat{t}_{1:n} = \arg\max_{t_1 \ldots t_n} P(t_1 \ldots t_n \mid w_1 \ldots w_n) \approx \arg\max_{t_1 \ldots t_n} \prod_{i=1}^{n} \underbrace{P(w_i \mid t_i)}_{\text{emission}} \; \underbrace{P(t_i \mid t_{i-1})}_{\text{transition}}$$

## 9. HMM Tables: "Janet will back the bill"

ค่าจากตำรา (WSJ Corpus, Fig. 17.12 และ 17.13) ไม่มี smoothing **A** (แถว = tag ก่อนหน้า, คอลัมน์ = tag ถัดไป) $P(t_i \mid t_{i-1})$ เช่น $P(\text{VB} \mid \text{MD}) = 0.7968$ และ `<s>` คือ start token

| | NNP | MD | VB | JJ | NN | RB | DT |
|---|---|---|---|---|---|---|---|
| `<s>` | 0.2767 | 0.0006 | 0.0031 | 0.0453 | 0.0449 | 0.0510 | 0.2026 |
| NNP | 0.3777 | 0.0110 | 0.0009 | 0.0084 | 0.0584 | 0.0090 | 0.0025 |
| MD | 0.0008 | 0.0002 | 0.7968 | 0.0005 | 0.0008 | 0.1698 | 0.0041 |
| VB | 0.0322 | 0.0005 | 0.0050 | 0.0837 | 0.0615 | 0.0514 | 0.2231 |
| JJ | 0.0366 | 0.0004 | 0.0001 | 0.0733 | 0.4509 | 0.0036 | 0.0036 |
| NN | 0.0096 | 0.0176 | 0.0014 | 0.0086 | 0.1216 | 0.0177 | 0.0068 |
| RB | 0.0068 | 0.0102 | 0.1011 | 0.1012 | 0.0120 | 0.0728 | 0.0479 |
| DT | 0.1147 | 0.0021 | 0.0002 | 0.2157 | 0.4744 | 0.0102 | 0.0017 |

**B** observation likelihoods $P(\text{word} \mid \text{tag})$ ("Janet" เป็นได้แค่ NNP เท่านั้น)

| | Janet | will | back | the | bill |
|---|---|---|---|---|---|
| NNP | 0.000032 | 0 | 0 | 0.000048 | 0 |
| MD | 0 | 0.308431 | 0 | 0 | 0 |
| VB | 0 | 0.000028 | 0.000672 | 0 | 0.000028 |
| JJ | 0 | 0 | 0.000340 | 0 | 0 |
| NN | 0 | 0.000200 | 0.000223 | 0 | 0.002337 |
| RB | 0 | 0 | 0.010446 | 0 | 0 |
| DT | 0 | 0 | 0 | 0.506099 | 0 |

> หมายเหตุ: สไลด์มีตารางฉบับย่อ (ปัดเศษ และ B ไม่มีแถว JJ, RB) ก่อนแสดงฉบับเต็ม ที่นี่ใช้ฉบับเต็มทั้งหมด

## 10. Viterbi Algorithm

**แนวคิดหลัก**

- **Dynamic Programming (DP)** เพื่อหา Hidden State (tag sequence ที่ดีที่สุด)
- ค่าของแต่ละเซลล์ $v_t(j)$ หาแบบ **recursive** โดยเอาเส้นทางที่น่าจะเป็นที่สุดที่นำมาสู่เซลล์นี้
- ใช้ตาราง **lattice / trellis**: N แถว (tags) x T คอลัมน์ (คำในประโยค)
- เก็บ **backpointer** ทุกเซลล์ เพื่อย้อนรอย (backtrace) หาลำดับ tag ที่ดีที่สุดทั้งประโยคเมื่อคำนวณจบ

**นิยามและสูตร**

$$v_t(j) = \max_{q_1, \ldots, q_{t-1}} P(q_1 \ldots q_{t-1}, o_1, o_2 \ldots o_t, q_t = j \mid \lambda) \qquad (17.18)$$

$$v_t(j) = \max_{i=1}^{N} v_{t-1}(i)\, a_{ij}\, b_j(o_t) \qquad (17.19)$$

| สัญลักษณ์ | ความหมาย |
|---|---|
| $v_{t-1}(i)$ | previous Viterbi path probability จาก time step ก่อนหน้า |
| $a_{ij}$ | transition probability จาก state $q_i$ ไป state $q_j$ ปัจจุบัน |
| $b_j(o_t)$ | state observation likelihood ของ $o_t$ เมื่ออยู่ใน state $j$ |

**เริ่มต้น (คอลัมน์ 1):** $v_1(j) = \pi_j \times b_j(o_1)$

## 11. Viterbi worked example: "Janet will back the bill"

### คอลัมน์ที่ 1: "Janet"

$v_1(j) = \pi_j \times b_j(\text{Janet})$ โดย $\pi_j$ = แถว `<s>` ของตาราง A

$$v_1(\text{NNP}) = 0.2767 \times 0.000032 = 8.854 \times 10^{-6}$$

$v_1(\text{MD}) = v_1(\text{VB}) = v_1(\text{JJ}) = v_1(\text{NN}) = v_1(\text{RB}) = v_1(\text{DT}) = 0$ เพราะ $b(\text{Janet} \mid \text{tag เหล่านี้}) = 0$

> หมายเหตุ: สไลด์เขียน $\pi(\text{NNP}) = 0.28$ (ปัดเศษ) แต่ผลคูณ $8.854 \times 10^{-6}$ ใช้ค่า 0.2767

### คอลัมน์ที่ 2: "will"

ใช้ $v_2(j) = v_1(\text{NNP}) \times a_{\text{NNP},j} \times b_j(\text{will})$

| Tag $j$ | $v_1(\text{NNP}) \times a_{\text{NNP},j}$ | $\times\, b_j(\text{will})$ | $= v_2(j)$ | backpointer |
|---|---|---|---|---|
| MD | $8.854 \times 10^{-6} \times 0.0110 = 9.74 \times 10^{-8}$ | $\times\, 0.308431$ | **$3.004 \times 10^{-8}$** | NNP |
| VB | $8.854 \times 10^{-6} \times 0.0009 = 7.97 \times 10^{-9}$ | $\times\, 0.000028$ | $2.231 \times 10^{-13}$ | NNP |
| NN | $8.854 \times 10^{-6} \times 0.0584 = 5.17 \times 10^{-7}$ | $\times\, 0.000200$ | $1.034 \times 10^{-10}$ | NNP |
| อื่นๆ (NNP, JJ, RB, DT) | - | $\times\, 0$ | 0 | NNP |

สูงสุดในคอลัมน์ 2 คือ $v_2(\text{MD}) = 3.004 \times 10^{-8}$ → ตอบ **will เป็น MD (กริยาช่วย)**

> หมายเหตุ: สไลด์แสดงค่า $a_{\text{NNP,NN}}$ เป็น 0.058 (ปัดเศษ) และ $5.14 \times 10^{-7}$ แต่ผลลัพธ์ $1.034 \times 10^{-10}$ ใช้ค่า 0.0584 ซึ่งให้ $5.17 \times 10^{-7}$

### คอลัมน์ที่ 3-5 และ Backtrace

ทำซ้ำ recurrence เดิมสำหรับ back, the, bill จนครบ 5 คำ (สไลด์แสดงเฉพาะผลลัพธ์ ที่คำนวณเต็มด้วย Python)

| คำ | Janet | will | back | the | bill |
|---|---|---|---|---|---|
| best tag | NNP | MD | VB | DT | NN |
| best $v$ | $8.854 \times 10^{-6}$ | $3.004 \times 10^{-8}$ | $1.609 \times 10^{-11}$ | $1.816 \times 10^{-12}$ | $2.014 \times 10^{-15}$ |
| backpointer | (start) | NNP | MD | VB | DT |

**Backtrace** จากคอลัมน์สุดท้าย (bill → NN สูงสุด) ตามลูกศร backpointer ย้อนกลับ:

```text
Janet/NNP  →  will/MD  →  back/VB  →  the/DT  →  bill/NN
```

> หมายเหตุ: ค่าในแถว "best $v$" ของคอลัมน์ back (VB) เป็นค่าบนเส้นทางที่ดีที่สุดของทั้งประโยค ไม่ใช่ค่าสูงสุดของคอลัมน์นั้น (ในคอลัมน์ back ค่า RB มากกว่า VB แต่เส้นทางผ่าน RB ให้ผลรวมทั้งประโยคต่ำกว่า)

## 12. Computational Complexity ของ Viterbi

ในหัวข้อนี้สไลด์ใช้ $N$ = ความยาวประโยค (จำนวนคำ), $T$ = จำนวนหมวดคำ

| | Brute-force (ลองทุกความเป็นไปได้) | Viterbi (Dynamic Programming) |
|---|---|---|
| ความซับซ้อน | $O(T^N)$ | $O(N \times T^2)$ |
| เหตุผล | จำนวน tag sequence ที่เป็นไปได้ = $T^N$ | เติมตาราง $N \times T$ ทีละเซลล์ แต่ละเซลล์เทียบ $T$ ทางเลือกก่อนหน้า |

**ตัวอย่าง:** "Janet will back the bill" ($N = 5$ คำ) และ 7 หมวดคำ ($T = 7$)

```text
Brute-force :  T^N   = 7^5     = 16,807 ลำดับ
Viterbi     :  N x T^2 = 5 x 7^2 = 245 การคำนวณ
เร็วขึ้นประมาณ 16,807 / 245 = 68.6 เท่า
```

> หมายเหตุ: ในหัวข้อ Viterbi Algorithm (ข้อ 10) สไลด์ใช้ N = จำนวน tags และ T = จำนวนคำ ซึ่งตรงข้ามกับหน้านี้

## 13. Conditional Random Fields (CRF)

**ทำไมต้องมี CRF ถ้ามี HMM แล้ว?**

- HMM เป็น **Generative Model:** จาก $P(W \mid T)\,P(T)$ แล้วใช้ Bayes เพื่อหา $P(T \mid W)$
- HMM มองคำได้ทีละคำเดียว (เช่น look → looking)
- HMM มองแค่คำก่อนหน้า ทำให้จับความสัมพันธ์นอกจากนั้นไม่ได้
- CRF เป็น **Discriminative Model:** คำนวณ $P(T \mid W)$ **โดยตรง** จึงใส่ arbitrary features ได้อย่างอิสระ
- เป็น **linear-chain CRF:** log-linear model เหมือน logistic regression แต่ขยายไปทั้งลำดับ (sequence)

**สูตร**

$$\hat{Y} = \arg\max_{Y \in \mathcal{Y}} P(Y \mid X) \qquad (17.22)$$

$$P(Y \mid X) = \frac{1}{Z(X)} \exp\left( \sum_{k=1}^{K} w_k F_k(X, Y) \right) \qquad (17.24)$$

$$Z(X) = \sum_{Y' \in \mathcal{Y}} \exp\left( \sum_{k=1}^{K} w_k F_k(X, Y') \right) \qquad (17.25)$$

| สัญลักษณ์ | ความหมาย |
|---|---|
| $w_k$ | weight ของแต่ละ feature |
| $Z(X)$ | normalization term |
| $F_k(X, Y)$ | functions ของ global features |

## 14. CRF Features

Feature function $f_k$ ที่ตำแหน่ง $i$ สามารถขึ้นกับ $(y_{i-1}, y_i, X, i)$ ได้อย่างอิสระ

**ตัวอย่างจากสไลด์:** "Janet/NNP will/MD **back/VB** the/DT bill/NN" เมื่อ $x_i$ = "back"

| Feature | เงื่อนไข | ค่า |
|---|---|---|
| $f_{3743}$ | $y_i$ = VB และ $x_i$ = "back" | active (=1) |
| $f_{156}$ | $y_i$ = VB และ $y_{i-1}$ = MD | active (=1) |
| $f_{99732}$ | $y_i$ = VB และ $x_{i-1}$ = "will" และ $x_{i+2}$ = "bill" | active (=1) |

**Feature ที่ช่วยกับคำที่ไม่เคยเห็น (Unknown Words)**

- **Word shape:** ตัวพิมพ์เล็ก → x, ตัวพิมพ์ใหญ่ → X, ตัวเลข → d เช่น "I.M.F." → X.X.X., "DC10-30" → XXdd-dd
- **Prefix / Suffix features:** ความยาว ≤ 2-3 ตัวอักษร (เช่น ลงท้าย "-ing", "-ly", ขึ้นต้น "un-")
- ข้อดี: CRF ให้ความแม่นยำสูงกว่า HMM มากในทางปฏิบัติ เพราะรวม feature เหล่านี้ได้อย่างเป็นระบบ

## 15. สรุปเปรียบเทียบ Rule-based vs HMM vs CRF

| แนวทาง | ประเภทโมเดล | จุดเด่น | ข้อจำกัด |
|---|---|---|---|
| Rule-based (+ Brill TBL) | Knowledge-based / Hybrid | อธิบายได้ชัดเจน ไม่ต้องมีข้อมูลจำนวนมาก | เขียนกฎเองใช้แรงงานมาก ปรับ scale ยาก |
| HMM | Generative (สร้าง $P(W,T)$) | เรียนรู้จากข้อมูล เร็ว decode ได้ด้วย Viterbi | เพิ่ม feature พิเศษยาก, สมมติฐาน independence เข้มงวด |
| CRF | Discriminative (สร้าง $P(T \mid W)$ ตรง) | ใส่ feature ได้อิสระ แม่นยำกว่า HMM มาก | train ช้ากว่า ต้องมี labeled data มากพอ |

---

# ส่วนที่ 3: Sequence Labeling และ Named Entity Recognition

## 1. Sequence Labeling

**นิยาม:** งานที่กำหนด label $y_i$ ให้กับทุกๆ input $x_i$ ในลำดับ $X = x_1 \ldots x_n$ โดยผลลัพธ์ $Y = y_1 \ldots y_n$ มีความยาวเท่ากับ input เสมอ

```text
input:  x1, x2, ..., xn   →   labels:  y1, y2, ..., yn
```

- ป้ายของแต่ละตัวขึ้นกับ token ข้างเคียงด้วย ไม่ใช่เฉพาะตัวมันเอง
- POS tagging, chunking และ NER เป็น sequence labeling ที่ใช้เครื่องมือชุดเดียวกัน (HMM / CRF / Viterbi)

| งาน | $x_i$ | $y_i$ |
|---|---|---|
| POS Tagging | คำ | หมวดคำ (NNP, VB, ...) |
| Named Entity Recognition | คำ | ประเภท entity (B-PER, O, ...) |
| Word Segmentation | ตัวอักษร | ขอบเขตคำ (B/I) |
| Chunking / Shallow Parsing | คำ | ส่วนของวลี (NP, VP, ...) |

เครื่องมือที่ใช้ได้: HMM, CRF หรือ Neural Sequence Model (RNN/Transformer)

## 2. Named Entity Recognition (NER)

- งานค้นหาและระบุประเภทของ "กลุ่มคำ" (span) ที่อ้างถึงชื่อเฉพาะในข้อความ
- NER มีปัญหาเรื่อง "การแบ่งขอบเขต" (segmentation) ด้วย เพราะ entity อาจยาวหลายคำ
- **Application:** Question Answering, Sentiment Analysis, Information Extraction, การเชื่อมโยงกับฐานความรู้ (Wikipedia / Knowledge Graph)

| ประเภท | คำอธิบาย | ตัวอย่าง |
|---|---|---|
| PER (Person) | ชื่อบุคคล | สมชาย, Marie Curie |
| ORG (Organization) | ชื่อองค์กร/บริษัท | Google, จุฬาลงกรณ์มหาวิทยาลัย |
| LOC (Location) | สถานที่ทางภูมิศาสตร์ | ภูเขา, แม่น้ำ, Sunshine Canyon |
| GPE | ประเทศ/รัฐ/เมือง | กรุงเทพ, Palo Alto |

**Type Ambiguity:** "Washington" อาจเป็น PER (George Washington), ORG (ทีมกีฬา) หรือ LOC/GPE (เมือง) ต้องดูบริบท

## 3. BIO / IO / BIOES Tagging Scheme

บาง entity มีหลาย token เช่น Steve Jobs BIO tagging แปลง NER ให้เป็น sequence labeling ทีละคำได้

| Tag | ความหมาย |
|---|---|
| B | จุดเริ่ม entity |
| I | อยู่ภายใน entity |
| O | ไม่ใช่ entity |
| E | จุดสิ้นสุด entity |
| S | Single entity มีแค่ 1 token |

จำนวน tag = $2n + 1$ เมื่อ $n$ = จำนวนประเภท entity (สไลด์ระบุไว้ใต้หัวข้อรวม แต่ใช้ได้กับ BIO เท่านั้น)

**ตัวอย่างจากสไลด์:** "Jane Villanueva of United Airlines Holding discussed the Chicago route"

| Word | IO | BIO | BIOES |
|---|---|---|---|
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

## 4. BIO Tagging บนประโยคภาษาไทย

**ประโยค:** "นายสมชายทำงานที่บริษัทกูเกิลในกรุงเทพ" (Mr. Somchai works at Google in Bangkok)

ต้องทำ **Word Segmentation ก่อนเสมอ** (เพราะภาษาไทยไม่มีช่องว่าง) แล้วจึงทำ BIO Tagging บน token ที่ตัดคำแล้ว

| นาย | สมชาย | เรียน | ที่ | ซอฟแวร์ | ปาร์ค | ใน | กรุงเทพ |
|---|---|---|---|---|---|---|---|
| O | B-PER | O | O | B-ORG | I-ORG | O | B-LOC |

- สมชาย → B-PER (จุดเริ่มต้นของชื่อบุคคล)
- ซอฟแวร์ → B-ORG (จุดเริ่มต้นชื่อองค์กร), ปาร์ค → I-ORG (ส่วนต่อของชื่อองค์กร)
- กรุงเทพ → B-LOC (จุดเริ่มต้นสถานที่)
- "นาย" เป็นคำนำหน้าชื่อ (title) ไม่ใช่ส่วนหนึ่งของชื่อเฉพาะ ในตัวอย่างนี้จึงกำกับเป็น O

> หมายเหตุ: token ในสไลด์ (เรียน, ซอฟแวร์ ปาร์ค) ไม่ตรงกับประโยคที่เขียนไว้ (ทำงาน, กูเกิล) และข้อความอธิบายของสไลด์ระบุ "ปาร์ค → B-ORG (จุดสิ้นสุด)" ซึ่งไม่ตรงกับ tag I-ORG ในการ์ด ที่นี่ยึด token และ tag ตามการ์ดในสไลด์

## 5. Evaluation NER: Precision, Recall, F1

ประเมินที่ **ระดับ entity**

| ค่า | สูตร | ความหมาย |
|---|---|---|
| Precision | $P = \dfrac{TP}{TP + FP}$ | ในบรรดา entity ที่ระบบทายทั้งหมด ถูกต้องกี่เปอร์เซ็นต์ |
| Recall | $R = \dfrac{TP}{TP + FN}$ | ในบรรดา entity ที่ถูกต้องจริงทั้งหมด ระบบจับได้กี่เปอร์เซ็นต์ |
| F1 | $F_1 = \dfrac{2PR}{P + R}$ | ค่าเฉลี่ยฮาร์โมนิกของ Precision และ Recall |

**Confusion matrix (Fig. 4.7 จากตำรา)**

| | gold positive | gold negative |
|---|---|---|
| **system positive** | true positive (TP) | false positive (FP) |
| **system negative** | false negative (FN) | true negative (TN) |

- Precision = tp / (tp + fp)
- Recall = tp / (tp + fn)
- Accuracy = (tp + tn) / (tp + fp + tn + fn)

---

# ตัวอย่างโจทย์

ตัวอย่างโจทย์จากสไลด์ 2.1 ข้อ 1 ถึง 2 เป็นการตัดคำ ข้อ 3 คือ Viterbi ข้อ 4 และ 5 เป็น Sequence Labeling (ข้อ 5 ใช้ตัวอย่างจาก Lab 2 DIY 5 เพราะสไลด์มีแค่สูตร) ตัวเลขทุกตัวตรวจซ้ำด้วยโปรแกรมแล้ว

### ข้อ 1  กำหนดพจนานุกรม $\{\text{ตา},\ \text{ตาก},\ \text{กลม},\ \text{ลม}\}$ จงตัดคำข้อความ "ตากลม" ด้วย Forward Maximum Matching (FMM) และ Backward Maximum Matching (BMM)

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

### ข้อ 2  จาก corpus ที่นับความถี่ได้ ตา 500, กลม 80, ตาก 60, ลม 200 จงหาว่า Statistical Segmentation (unigram) เลือกตัดคำ "ตากลม" แบบใด

$\mathbf{Sol}^{n}$

หาความน่าจะเป็นของแต่ละคำ แล้วเปรียบเทียบ $\prod P(w_i)$ ของทั้งสองวิธีตัด

$$
\begin{aligned}
N &= 500+80+60+200 = 840 \\
P(\text{ตา}) &= \tfrac{500}{840} = 0.595 \quad P(\text{กลม}) = \tfrac{80}{840} = 0.095 \quad P(\text{ตาก}) = \tfrac{60}{840} = 0.071 \quad P(\text{ลม}) = \tfrac{200}{840} = 0.238 \\
P(\text{ตา}+\text{กลม}) &= 0.595\times 0.095 = 0.0567 \\
P(\text{ตาก}+\text{ลม}) &= 0.071\times 0.238 = 0.0170 \\
\end{aligned}
$$

เนื่องจากทั้งสองวิธีตัดเป็น 2 คำเท่ากัน หาร $840$ เหมือนกัน จึงเทียบ $500\times 80 = 40{,}000$ กับ $60\times 200 = 12{,}000$ ได้เลย

$\mathbf{Ans}\quad 0.0567 > 0.0170$ ดังนั้นเลือก $\textbf{ตา + กลม}$

---

### ข้อ 3  กำหนดตาราง $A$ และ $B$ ของ HMM ดังนี้ จงใช้ Viterbi หา POS tag ของประโยค "Janet will back the bill"

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

### ข้อ 4  จงติด tag แบบ IO, BIO และ BIOES ให้ประโยค "Jane Villanueva of United Airlines Holding discussed the Chicago route" เมื่อ Jane Villanueva เป็น PER, United Airlines Holding เป็น ORG และ Chicago เป็น LOC

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

### ข้อ 5  ระบบ NER ทำนาย entity ได้ดังนี้ เมื่อ entity ที่ถูกต้อง (gold) คือ สมชาย/PER, เชียงใหม่/LOC, ปตท./ORG, กรุงเทพ/LOC, 2026/DATE และ entity ที่ระบบทำนายคือ สมชาย/PER, เชียง/LOC, ปตท./ORG, กรุงเทพ/ORG จงหา TP, FP, FN, Precision, Recall และ $F_1$ (ตัวอย่างจาก Lab 2 DIY 5)

$\mathbf{Sol}^{n}$

entity ถูกต้องก็ต่อเมื่อขอบเขตและประเภทตรงกับ gold ทั้งคู่ ถ้าไม่ตรงถือเป็น FP (ทายผิด) และ entity ใน gold ตัวนั้นเป็น FN (ตกหล่น)

| entity | ใน gold | ใน predicted | ผล |
|:---:|:---:|:---:|:---:|
| สมชาย/PER | ใช่ | ใช่ | TP |
| ปตท./ORG | ใช่ | ใช่ | TP |
| เชียง/LOC | ไม่ใช่ (ขอบเขตผิด) | ใช่ | FP |
| กรุงเทพ/ORG | ไม่ใช่ (ประเภทผิด) | ใช่ | FP |
| เชียงใหม่/LOC | ใช่ | ไม่ใช่ | FN |
| กรุงเทพ/LOC | ใช่ | ไม่ใช่ | FN |
| 2026/DATE | ใช่ | ไม่ใช่ | FN |

$$
\begin{aligned}
TP &= 2,\quad FP = 2,\quad FN = 3 \\
P &= \frac{TP}{TP+FP} = \frac{2}{4} = 0.5 \\
R &= \frac{TP}{TP+FN} = \frac{2}{5} = 0.4 \\
F_1 &= \frac{2PR}{P+R} = \frac{2(0.5)(0.4)}{0.5+0.4} = 0.444
\end{aligned}
$$

$\mathbf{Ans}\quad P=\mathbf{0.5},\ R=\mathbf{0.4},\ F_1\approx\mathbf{0.444}$ (ระบบพลาดที่ recall มากกว่า คือตกหล่น 3 entity)
