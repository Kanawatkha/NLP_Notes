# บทที่ 3: Syntax and Parsing

# ส่วนที่ 1: Syntax Tree

## 1. What Is a Syntax Tree?

**Syntax tree (parse tree)** คือการแสดงโครงสร้างไวยากรณ์ของประโยคในรูปต้นไม้

- แบ่งประโยคเป็นคำและวลี
- แสดงความสัมพันธ์เชิงลำดับชั้นระหว่างกัน ตามกฎไวยากรณ์ (grammar rules)

ตัวอย่างจากสไลด์ (ประโยค "I prefer the morning flight through Denver"): constituency tree (S, NP, VP, ...) และ dependency tree (prefer เป็นราก) ดูในหัวข้อต่อไป

## 2. Why Syntax Matters

**ตัวอย่างจากสไลด์:** "I shot an elephant in my pajamas" (ประโยคกำกวม)

| Token | I | shot | an | elephant | in | my | pajamas |
|---|---|---|---|---|---|---|---|
| Label (chunk) | B-NP | B-VP | B-NP | I-NP | B-PP | B-NP | I-NP |
| POS | PRON | VERB | DET | NOUN | ADP | PRON | NOUN |

ประโยคนี้มี parse tree 2 แบบ (Fig 18.9)

| Parse | ความหมาย | PP "in my pajamas" ต่อกับ |
|---|---|---|
| ซ้าย | ช้างใส่ชุดนอน (ตลก) | NP (elephant) |
| ขวา | ฉันใส่ชุดนอนตอนยิง | VP (shot) |

**ประโยชน์ของ syntax**

| ด้าน | อธิบาย |
|---|---|
| Disambiguation | แก้ความกำกวม เช่น "I saw the man with the telescope." ใครถือกล้อง? |
| Information Extraction | QA ต้องเข้าใจว่าคำถามถามถึงส่วนใดของประโยค, Machine Translation ภาษาต่างกันเรียงลำดับคำต่างกัน ต้องรู้โครงสร้างจึงแปลถูก |
| Grammar checker | เช่น Grammarly ตรวจ subject-verb agreement errors |

## 3. Types of Syntax Trees

ขึ้นกับทฤษฎีภาษาศาสตร์หรือเครื่องมือ NLP ที่ใช้

| ชนิด | แนวคิด |
|---|---|
| Constituency Trees | วลีซ้อนกัน (nested phrases) ประกอบจากคำขึ้นไปจนเป็นประโยค |
| Dependency Trees | ความสัมพันธ์ทางไวยากรณ์แบบมีทิศทางระหว่างคำกับคำ (word-to-word) |

---

# ส่วนที่ 2: Constituency Trees

## 1. What is Constituent

**Constituent** = กลุ่มคำที่ทำงานร่วมกัน "เสมือนเป็นหน่วยเดียว" (behave as a single unit)

### Constituent test

| Test | วิธีทดสอบ | ตัวอย่างจากสไลด์ |
|---|---|---|
| Substitution | แทนที่ด้วยคำเดียวได้ | "เด็กผู้ชายคนนั้น" → "เขา" |
| Movement | ย้ายทั้งกลุ่มไปตำแหน่งอื่นได้ | - |
| Coordination | เชื่อมด้วย "และ/หรือ" กับกลุ่มชนิดเดียวกันได้ | - |
| Answer | ตอบคำถามได้ด้วยกลุ่มคำนั้นตามลำพัง | "ฉันเห็นใคร" → "ช้างใส่ชุดนอน" |

### ชนิดของ Constituent

| ชนิด | ชื่อเต็ม | ตัวอย่างจากสไลด์ |
|---|---|---|
| NP | Noun Phrase | แมวดำ, A cat with long tail |
| VP | Verb Phrase | วิ่งเร็ว, show me the cat |
| PP | Prepositional Phrase | ด้วยกล้อง, ที่โรงเรียน |
| ADJP | Adjective Phrase | สวยมาก |

## 2. Syntactic rules and patterns

- POS ในภาษาอังกฤษมักเรียงตามลำดับแบบแผนภายในประโยคและอนุประโยค (clause)
- กฎไวยากรณ์ช่วยให้ส่วนต่างๆ ของภาษาสื่อความหมายได้สอดคล้องกัน

**รูปแบบประโยคที่พบบ่อย 7 แบบ (จากตำรา)**

| # | รูปแบบ | ตัวอย่าง |
|---|---|---|
| 1 | Subject → Verb | The cat meowed. |
| 2 | Subject → Verb → Direct Object | The cat plays the ball. |
| 3 | Subject → Verb → Subject Complement | The cat is playful. |
| 4 | Subject → Verb → Adverbial Complement | The cat paced slowly. |
| 5 | Subject → Verb → Indirect Object → Direct Object | The cat gave me the ball. |
| 6 | Subject → Verb → Direct Object → Direct Complement | The cat made the ball dirty. |
| 7 | Subject → Verb → Direct Object → Adverbial Complement | The cat perked its ears up. |

## 3. Constituency-Based Parse Trees

- Constituency tree แบ่งประโยคเป็นวลีซ้อนกัน (constituents) ด้วย phrase-structure grammar: หน่วยเล็ก (คำ) รวมเป็นวลีใหญ่ แล้วรวมเป็นประโยค

| สัญลักษณ์ | ความหมาย | ตัวอย่าง |
|---|---|---|
| S (Sentence) | ราก (root) ของต้นไม้ | - |
| NP (Noun Phrase) | วลีที่จัดกลุ่มรอบคำนาม | "The smart professor" |
| VP (Verb Phrase) | การกระทำและกรรมของมัน | "taught data science" |
| DT/JJ/NN/VB | Parts of speech: terminal nodes ที่อยู่เหนือคำ | - |

**ตัวอย่างจากสไลด์ (Fig 19.1):** "I prefer the morning flight through Denver"

```text
S
├── NP ── Pro ── I
└── VP
    ├── Verb ── prefer
    └── NP
        ├── Det ── the
        └── Nom
            ├── Nom
            │   ├── Nom ── Noun ── morning
            │   └── Noun ── flight
            └── PP
                ├── P ── through
                └── NP ── Pro ── Denver
```

---

# ส่วนที่ 3: Dependency Trees

## 1. Dependency Trees

Dependency tree เน้น **ความสัมพันธ์แบบมีทิศทางระหว่างคำสองคำ** โดยตรง

| องค์ประกอบ | ความหมาย |
|---|---|
| The Root | โดยมากเป็นกริยาหลัก |
| Edges / Arrows | เชื่อม governor ("head") ไปยัง dependent พร้อมป้ายความสัมพันธ์ เช่น nsubj, dobj |
| Why NLP prefers it | เครื่องมืออย่าง spaCy ใช้ dependency tree: คำนวณมีประสิทธิภาพ และเหมาะกับลำดับคำที่ยืดหยุ่น |

**ตัวอย่างจากสไลด์ (Fig 19.1):** "I prefer the morning flight through Denver"

```text
prefer
├── I
└── flight
    ├── the
    ├── morning
    └── Denver
        └── through
```

## 2. Constituency vs. Dependency

| | Constituency Trees | Dependency Trees |
|---|---|---|
| Structure | วลีซ้อนกัน (NP, VP...) | เส้นเชื่อมระหว่างคำกับคำโดยตรง |
| Root | Sentence (S) | กริยาหลัก (main verb) |
| Node count | คำ + node วลี | หนึ่ง node ต่อหนึ่งคำพอดี |
| Captures | การจัดกลุ่มระดับวลี (Noun, Verb) | หน้าที่ทางไวยากรณ์ (subject, object...) |
| Common tools | Stanford PCFG Parser | spaCy, Universal Dependencies |

---

# ส่วนที่ 4: Algorithm Constituency

## 1. Context-Free Grammars (CFG)

**CFG (Phrase-Structure Grammar)** = ระบบกฎที่อธิบายว่าคำประกอบกันเป็นวลีและประโยคได้อย่างไร เป็นเครื่องมือมาตรฐานในการอธิบาย constituency

- ชุดกฎการเขียนใหม่ (rewrite rules) บอกว่าสัญลักษณ์ใดแทนที่ด้วยอะไรได้
- แต่ละกฎ **แตก non-terminal หนึ่งตัวเป็นลำดับสัญลักษณ์** โดยไม่ขึ้นกับบริบทรอบข้าง
- รูปแบบกฎ: $A \to \beta$ ($\beta$ = สัญลักษณ์หนึ่งตัวขึ้นไป)

### นิยามเชิงรูปนัย

| สัญลักษณ์ | ชื่อ | ความหมาย |
|---|---|---|
| $N$ | Non-terminals | สัญลักษณ์ที่ยังแตกต่อได้ เช่น S, NP, VP, PP (ชื่อของ constituent) |
| $\Sigma$ | Terminals | คำจริงในภาษา เช่น แมว, กิน, ปลา (ไม่แตกต่อแล้ว) |
| $R$ | Rules / Productions | กฎรูป $A \to \beta$ เมื่อ $A$ เป็น non-terminal และ $\beta$ เป็นลำดับของสัญลักษณ์ |
| $S$ | Start symbol | สัญลักษณ์เริ่มต้น (ปกติคือ S = Sentence) |

**ทำไมเรียก "Context-Free"?** เพราะกฎ $A \to \beta$ ใช้ได้เสมอไม่ว่า $A$ จะอยู่ในบริบทใด เราแทนที่ $A$ ด้วย $\beta$ ได้โดยไม่ต้องดูว่ารอบๆ $A$ มีอะไร

### ตัวอย่างไวยากรณ์ "The smart professor taught data science."

```text
S  → NP VP
NP → DT JJ NN | NN NN
VP → VB NP
DT → "the"
JJ → "smart"
NN → "professor" | "data" | "science"
VB → "taught"
```

### เปรียบเทียบไวยากรณ์อังกฤษกับไทย

**ไวยากรณ์อังกฤษ**

```text
S    -> NP VP
NP   -> Det Nom
NP   -> ProperNoun
Nom  -> Adj Nom        <- Adj มาก่อน N
Nom  -> Noun
VP   -> Verb NP
VP   -> VP PP
PP   -> Prep NP

Det  -> the | a
Noun -> cat | fish
Adj  -> black
Verb -> eats
```

**ไวยากรณ์ไทย**

```text
S    -> NP VP
NP   -> N ADJ          <- ADJ ตามหลัง N !
NP   -> N
VP   -> V NP
VP   -> VP PP
PP   -> P NP

N    -> แมว | ปลา
ADJ  -> ดำ
V    -> กิน
```

**ข้อสังเกต:** ภาษาไทยวางคำคุณศัพท์ไว้หลังคำนาม (แมวดำ) ต่างจากอังกฤษที่วางไว้หน้า (black cat) โครงสร้างของกฎจึงต่างกัน

## 2. Parse Trees vs. Derivations

| | Derivation | Parse Tree |
|---|---|---|
| คืออะไร | ลำดับการแทนที่ | โครงสร้างผลลัพธ์ |
| ลักษณะ | ไล่จาก S ทีละกฎ | แสดงโครงสร้างลำดับชั้น |

derivation หลายแบบ (ลำดับการแทนที่ต่างกัน) ให้ parse tree เดียวกันได้

**ตัวอย่างจากสไลด์ "แมว ดำ กิน ปลา"**

```text
S
  ⇒ NP VP           (S → NP VP)
  ⇒ N ADJ VP        (NP → N ADJ)
  ⇒ แมว ADJ VP
  ⇒ แมว ดำ VP
  ⇒ แมว ดำ V NP     (VP → V NP)
  ⇒ แมว ดำ กิน NP
  ⇒ แมว ดำ กิน ปลา
```

```text
S
├── NP
│   ├── N ── แมว
│   └── ADJ ── ดำ
└── VP
    ├── V ── กิน
    └── NP ── ปลา
```

> หมายเหตุ: สไลด์ย่อขั้น NP → N → ปลา ในส่วนท้าย (ข้าม N)

## 3. Structural Ambiguity

"I saw the man with the telescope." ใครเป็นคนถือกล้อง? ฉัน หรือ ผู้ชาย?

| | Method 1: PP + VP | Method 2: PP + NP |
|---|---|---|
| ความหมาย | I saw (the man) **with the telescope** (ฉันใช้กล้องมอง) | I saw **the man with the telescope** (ผู้ชายถือกล้อง) |
| PP ต่อกับ | VP | NP |

```text
Method 1                      Method 2
S                             S
├── NP I                      ├── NP I
└── VP                        └── VP
    ├── VP                        ├── V saw
    │   ├── V saw                 └── NP
    │   └── NP the man                ├── NP the man
    └── PP with telescope             └── PP with telescope
```

**จาก Lab 3:** กฎ `NP → NP PP` (PP ต่อกับนาม) และ `VP → VP PP` (PP ต่อกับกริยา) เป็นต้นเหตุของความกำกวมส่วนใหญ่

## 4. Conversion to Chomsky Normal Form (CNF)

CNF มีรูปกฎ 2 แบบเท่านั้น:

1. $A \to B\;C$ (non-terminal สองตัว): non-terminal ที่แตกต่อได้ทุกตัวที่ยาวเกินสองคำต้องถูกแบ่งเป็นสองส่วนเสมอ
2. $A \to w$ (terminal หนึ่งตัว)

CFG ทุกตัวแปลงเป็น CNF ที่ยอมรับภาษาชุดเดียวกันได้เสมอ (ไม่สูญเสียความสามารถในการอธิบาย)

### วิธีแปลง 3 แบบ

| # | กฎที่ต้องแก้ | ตัวอย่างจากสไลด์ | วิธีแก้ |
|---|---|---|---|
| 1 | ปนคำจริง (terminal) กับ non-terminal | `INF-VP → to VP` | สร้าง non-terminal ใหม่คลุมคำนั้น: `INF-VP → TO VP` และ `TO → to` |
| 2 | Unit production (RHS มี non-terminal ตัวเดียว) | `NP → N → แมว` | แทนที่ด้วย RHS ของกฎที่ N แตกต่อได้: `NP → แมว \| ปลา` |
| 3 | RHS ยาวเกิน 2 ตัว | `VP → V NP PP` | แตกเป็นกฎย่อยด้วย dummy symbol: `VP → X1 PP` และ `X1 → V NP` |

### ตัวอย่างจากตำรา (Fig 18.10: $\mathcal{L}_1$ grammar เทียบ CNF)

| กฎต้นฉบับ | หลังแปลงเป็น CNF |
|---|---|
| `S → Aux NP VP` | `S → X1 VP` และ `X1 → Aux NP` |
| `S → VP` | `S → book \| include \| prefer`, `S → Verb NP`, `S → X2 PP`, `S → Verb PP`, `S → VP PP` |
| `NP → Pronoun` | `NP → I \| she \| me` |
| `NP → Proper-Noun` | `NP → United \| Houston` |
| `Nominal → Noun` | `Nominal → book \| flight \| meal \| money` |
| `VP → Verb` | `VP → book \| include \| prefer` |
| `VP → Verb NP PP` | `VP → X2 PP` และ `X2 → Verb NP` |

## 5. PCFG: Probabilistic CFG

**แนวคิด**

- PCFG = CFG + ความน่าจะเป็น
- parse ชุดเดียวกับ CFG แต่ให้ค่าความน่าจะเป็นกับแต่ละ parse ด้วย
- เมื่อมีหลาย parse ให้เลือกอันที่มีความน่าจะเป็นสูงสุด
- PCFG ขยาย CFG เหมือนที่ Markov Model ขยาย regular grammar

**รูปแบบกฎ**

$$A \to \beta\; [p] \quad (4.5) \qquad\qquad P(A \to \beta \mid A) \quad (4.6)$$

**เงื่อนไข:** ผลรวม $p$ ของกฎที่มี LHS = $A$ เดียวกัน ต้องเท่ากับ 1

**สูตร**

$$P(T) = \prod_{n \in T} p(r(n)) \quad (4.7) \qquad\qquad \hat{T}(S) = \arg\max_{T \in \tau(S)} P(T) \quad (4.8)$$

- (4.7): คูณความน่าจะเป็นของทุกกฎที่ใช้ในต้นไม้
- $\tau(S)$ = เซตของ parse ทั้งหมดที่เป็นไปได้ของประโยค $S$

### ตัวอย่างกฎ PCFG จากตำรา (Fig 4.13: chatbot สั่งอาหาร)

| กฎ | ความน่าจะเป็น | กฎ | ความน่าจะเป็น |
|---|---|---|---|
| S → NP VP | 0.82 | Det → a / that / the / this | 0.12 / 0.03 / 0.75 / 0.10 |
| S → Aux NP VP | 0.12 | N → coffee / tea / food | 0.75 / 0.13 / 0.12 |
| S → VP | 0.06 | V → buy / pay / order | 0.41 / 0.27 / 0.32 |
| NP → Det Nom | 0.21 | Aux → do / does / can | 0.31 / 0.26 / 0.43 |
| NP → Proper-N | 0.37 | Proper-N → Starbucks / KFC | 0.63 / 0.37 |
| NP → Nom | 0.06 | Pronoun → I / you / he / she | 0.42 / 0.36 / 0.12 / 0.10 |
| NP → Pronoun | 0.36 | | |
| Nom → Noun | 0.72 | | |
| Nom → N Nom | 0.23 | | |
| Nom → Proper-N Nom | 0.05 | | |
| VP → V | 0.58 | | |
| VP → V NP | 0.36 | | |
| VP → V NP NP | 0.06 | | |

### PCFG Assumptions

| สมมติฐาน | ความหมาย |
|---|---|
| Place Invariance | ความน่าจะเป็นของกฎไม่ขึ้นกับ "ตำแหน่ง" ที่ subtree ปรากฏในประโยค เช่น NP → N ADJ มีค่าเท่ากันไม่ว่าจะอยู่ต้นหรือท้ายประโยค |
| Context-Free (Ancestor-Free) | ความน่าจะเป็นของการแตกกฎขึ้นกับ non-terminal ตัวนั้นเพียงตัวเดียว ไม่ขึ้นกับ node แม่หรือ node พี่น้องรอบข้าง |
| Independence of Rule Choices | การเลือกกฎที่ node หนึ่งเป็นอิสระจากการเลือกกฎที่ node อื่น จึงคูณความน่าจะเป็นเข้าด้วยกันได้ |

### PCFG Worked Example: "I shot an elephant in my pajamas"

กฎ PCFG ของสไลด์ (ผลรวมแต่ละ LHS = 1.0):

```text
S  → NP VP     [1.0]

VP → V NP      [0.6]
VP → VP PP     [0.4]

NP → N         [0.5]
NP → N ADJ     [0.3]
NP → NP PP     [0.2]

PP → P NP      [1.0]
```

| Parse | ความหมาย | กฎที่ใช้และความน่าจะเป็น | $P(T)$ |
|---|---|---|---|
| A (PP + NP) | ช้างใส่ชุดนอน | S → NP VP 1.0, NP → N 0.5 (I), VP → V NP 0.6, NP → NP PP 0.2, NP → N 0.5 (elephant), PP → P NP 1.0, NP → N 0.5 (pajamas) | $1.0 \times 0.5 \times 0.6 \times 0.2 \times 0.5 \times 1.0 \times 0.5 = \mathbf{0.015}$ |
| B (PP + VP) | ฉันใส่ชุดนอน | S → NP VP 1.0, NP → N 0.5 (I), VP → VP PP 0.4, VP → V NP 0.6, NP → N 0.5 (elephant), PP → P NP 1.0, NP → N 0.5 (pajamas) | $1.0 \times 0.5 \times 0.4 \times 0.6 \times 0.5 \times 1.0 \times 0.5 = \mathbf{0.030}$ |

$0.030 > 0.015$ → PCFG เลือก **Parse B (ฉันใส่ชุดนอน)**

ทั้งสอง parse ใช้กฎเหมือนกันทุกตัว ต่างกันเพียง `NP → NP PP` [0.2] กับ `VP → VP PP` [0.4] จึงเทียบกันได้เร็วจากสองค่านี้

> หมายเหตุ: ป้ายผลลัพธ์ในสไลด์สลับกัน (ใต้ Parse A เขียน $P(T_B) = 0.015$ และใต้ Parse B เขียน $P(T_A) = 0.030$) ตัวเลขถูกต้อง แต่ที่นี่จัดตามชื่อ parse ให้ตรงกัน กฎ lexical (เช่น N → I) สไลด์ไม่ได้ให้ความน่าจะเป็นไว้ จึงไม่นำมาคูณ

### PCFG Limitation: Lexicalized Parsing

| ข้อจำกัดของ PCFG ธรรมดา | ทางแก้: Lexicalized PCFG |
|---|---|
| ไม่สนใจคำจริง (lexical independence): "ดื่ม" กับ "ซื้อ" ใช้ค่าความน่าจะเป็นของกฎ VP ชุดเดียวกัน ทั้งที่พฤติกรรมต่างกัน | ผูก "หัวคำ" (lexical head) เข้ากับทุก non-terminal ในต้นไม้ (N คือ head ของ NP, V คือ head ของ VP) |
| ไม่สนใจตำแหน่งเชิงโครงสร้าง: NP ที่เป็นประธานกับ NP ที่เป็นกรรมใช้ค่าเดียวกัน | กฎกลายเป็น VP(กิน) → V(กิน) NP(ปลา) แทน VP → V NP เฉยๆ |
| ผลคือ PCFG มักเลือก parse ผิดเมื่อมี PP-attachment และ coordination ที่ขึ้นกับความหมายของคำ | ทำให้โมเดลแยกแยะได้ว่า "กิน" มักตามด้วยอาหาร ส่วน "ไป" มักตามด้วยสถานที่ |

แนวคิดของ Collins Parser และ Charniak Parser (ยุค 1997–1999) ปัจจุบันใช้ Neural constituency parser (span-based) ที่ให้คะแนนแต่ละ span แทน

---

# ส่วนที่ 5: Algorithm Dependency

## 1. Dependency Structure

เชื่อม "คำ" เข้ากับ "คำ" โดยตรงด้วยลูกศรจาก **head** (หัว) ไปยัง **dependent** (ส่วนขยาย) พร้อมป้ายบอกความสัมพันธ์ทางไวยากรณ์

### Universal Dependencies (UD)

ชุดความสัมพันธ์มาตรฐาน 37 แบบ ใช้ได้กว่า 100 ภาษา (ตัวอย่างใน Fig 19.2)

| กลุ่ม | ป้าย | ความหมาย |
|---|---|---|
| Clausal Argument | NSUBJ | Nominal subject (ประธาน) |
| | OBJ | Direct object (กรรมตรง) |
| | IOBJ | Indirect object (กรรมรอง) |
| | CCOMP | Clausal complement |
| Nominal Modifier | NMOD | Nominal modifier |
| | AMOD | Adjectival modifier |
| | APPOS | Appositional modifier |
| | DET | Determiner |
| | CASE | Prepositions, postpositions และ case markers อื่น |
| Other | CONJ | Conjunct |
| | CC | Coordinating conjunction |

**ตัวอย่างจากสไลด์ (19.2):** "United canceled the morning flights to Houston"

```text
canceled ──root
├── United   (nsubj)
└── flights  (obj)
    ├── the      (det)
    ├── morning  (compound)
    └── Houston  (nmod)
        └── to       (case)
```

### คุณสมบัติสำคัญ

- กริยาหลัก (เช่น "กิน") เป็น root ของประโยค
- ทุกคำมี head เพียงตัวเดียว ยกเว้น root
- จำนวนขอบ (arcs) = จำนวนคำพอดี

**ทำไมเหมาะกับภาษาไทย?** ภาษาไทยมีลำดับคำที่ยืดหยุ่นและไม่มีการผันคำ (no inflection) dependency บอก "ใครทำอะไรกับใคร" ได้ตรงกว่า โดยไม่ต้องพึ่งตำแหน่งของวลีเหมือน constituency

## 2. Dependency Formalisms

### Dependency Tree: เงื่อนไข 3 ข้อ

โครงสร้าง dependency คือกราฟระบุทิศทาง $G = (V, A)$

| สัญลักษณ์ | ความหมาย |
|---|---|
| $G$ | Graph |
| $V$ | Vertices/Nodes เซตของคำทั้งหมด |
| $A$ | Set of ordered pairs เซตของเส้นเชื่อม (ระบุทิศทางและความสัมพันธ์) |

**กฎ 3 ข้อ**

1. มี root เพียงตัวเดียวที่ไม่มีเส้นเชื่อมเข้า
2. ทุก node ยกเว้น root มีเส้นเข้าเพียงเส้นเดียว (คำมี head เดียว)
3. มีเส้นทางเดียวจาก root ไปยังทุก node (เชื่อมต่อกันและไม่มีวงจร)

### Projectivity

- ต้นไม้เป็น **projective** ถ้าวาดขอบทั้งหมดได้โดย "ไม่มีเส้นตัดกัน"
- Transition-based parser แบบ arc-standard สร้างได้เฉพาะต้นไม้ projective เท่านั้น
- ภาษาที่ลำดับคำยืดหยุ่นมักมีโครงสร้าง non-projective

## 3. Comparison: Constituency vs. Dependency

| ประเด็น | Constituency (Phrase Structure) | Dependency |
|---|---|---|
| หน่วยพื้นฐาน | วลี (phrase) ซ้อนกันเป็นลำดับชั้น | คำ เชื่อมกับคำโดยตรง |
| node ในต้นไม้ | มี node ภายในที่ไม่ใช่คำ (NP, VP, PP) | ทุก node คือคำในประโยค |
| สิ่งที่บอกได้ดี | ขอบเขตของวลี, โครงสร้างซ้อนชั้น | ความสัมพันธ์ทางไวยากรณ์ (ใครทำอะไร) |
| เหมาะกับภาษา | ภาษาที่ลำดับคำตายตัว เช่น อังกฤษ | ภาษาที่ลำดับคำยืดหยุ่น เช่น ไทย เช็ก ตุรกี |
| อัลกอริทึมหลัก | CYK / Chart Parsing, $O(n^3)$ | Transition-based, $O(n)$ เชิงเส้น |
| Treebank ตัวอย่าง | Penn Treebank | Universal Dependencies |

ทั้งสองแบบแปลงหากันได้: ใช้ **head-finding rules** หา lexical head ของแต่ละ constituent แล้วเปลี่ยน constituency tree เป็น dependency tree ได้

---

# ส่วนที่ 6: Parsing

## 1. Treebank

**Treebank** = คลังข้อความที่มนุษย์กำกับ syntax ไว้ทุกประโยค

- ใช้ฝึกโมเดล (training)
- ใช้เป็นเฉลยวัดผล (gold standard)
- ใช้ศึกษาภาษาศาสตร์เชิงคลัง
- สร้างโดยมนุษย์กำกับเอง หรือให้ parser ทำก่อนแล้วมนุษย์แก้ (hand-correction)

| Treebank | ชนิด | รายละเอียด |
|---|---|---|
| Penn Treebank | Constituency | ภาษาอังกฤษ (Wall Street Journal) มีอิทธิพลที่สุดในวงการ ใช้เป็นมาตรฐานวัดผลมาหลายทศวรรษ |
| Universal Dependencies | Dependency | open data มีเกือบ 200 treebank ในกว่า 100 ภาษา ใช้ชุดความสัมพันธ์เดียวกันข้ามภาษา |
| ORCHID / Thai UD | ทั้งสองแบบ | คลังภาษาไทย ORCHID (NECTEC) กำกับ POS และมี Thai treebank ในโครงการ UD ด้วย |

### Grammar จาก Treebank

แทนที่จะเขียนกฎเอง "อ่านกฎออกมาจาก treebank" ได้โดยตรง และนับความถี่เพื่อคำนวณความน่าจะเป็นของ PCFG:

$$P(A \to \beta) = \frac{\text{Count}(A \to \beta)}{\text{Count}(A)}$$

## 2. Parsing as Search

**มุมมองหลัก:** เป้าหมายคือค้นหาต้นไม้ที่ (1) มี S เป็นราก และ (2) มีใบเรียงกันตรงกับประโยคที่ป้อนเข้ามาพอดี

| | Top-Down (Goal-Directed) | Bottom-Up (Data-Directed) |
|---|---|---|
| วิธี | เริ่มจาก S แล้วแตกกฎลงมาเรื่อยๆ จนได้ลำดับคำที่ตรงกับ input | เริ่มจากคำใน input แล้วประกอบขึ้นเป็นวลีใหญ่ขึ้นจนถึง S |
| ข้อดี | ไม่เสียเวลาสร้างต้นไม้ที่ไปไม่ถึง S เลย | ยึดกับคำจริงเสมอ จึงไม่สร้างต้นไม้ที่ขัดกับ input |
| ข้อเสีย | อาจเสียเวลากับต้นไม้ที่ขัดกับคำจริงใน input ตั้งแต่ต้น และวนไม่รู้จบกับกฎเวียนซ้ำซ้าย (left recursion) เช่น NP → NP PP | อาจสร้างวลีย่อยที่สุดท้ายประกอบเป็น S ไม่ได้เลย (เสียแรงเปล่า) |
| หมายเหตุ | - | **CYK ใช้แนวทางนี้** และแก้ปัญหาการทำงานซ้ำด้วย Dynamic Programming |

## 3. CYK Algorithm

### CYK Overview

- **Cocke-Kasami-Younger:** อัลกอริทึม parsing แบบ dynamic programming ที่ใช้กันแพร่หลายที่สุด
- หลักการเดียวกับ Viterbi และ Minimum Edit Distance: เก็บคำตอบของปัญหาย่อยไว้ใช้ซ้ำ
- ข้อได้เปรียบจาก context-free: เมื่อพบว่าช่วงคำหนึ่งเป็น constituent ชนิดใดแล้ว บันทึกไว้ใช้ซ้ำได้ทุกครั้งโดยไม่ต้องวิเคราะห์ใหม่
- ต้องการไวยากรณ์ในรูป **CNF** เท่านั้น
- เก็บ parse ที่เป็นไปได้ทั้งหมดไว้ในตารางเดียวอย่างกะทัดรัด

**โครงสร้างตาราง**

- ใช้ตารางสามเหลี่ยมบน (upper-triangular matrix)
- ช่อง $[i, j]$ เก็บ "เซตของ non-terminal" ที่แตกออกเป็นคำในช่วง $i$ ถึง $j$ ได้
- แถวทแยงมุมล่างสุด = หมวดคำของแต่ละคำ (จาก POS tagging)
- ช่องบนขวาสุด $[1, n]$ คลุมทั้งประโยค
- ถ้ามี S อยู่ในช่อง $[1, n]$ แสดงว่าประโยคถูกไวยากรณ์

### The CYK Algorithm: 4 ขั้น

| ขั้น | ชื่อ | ทำอะไร |
|---|---|---|
| 1 | Normalize the Grammar | แปลง CFG เป็น CNF: $A \to B\,C$ และ $A \to \text{word}$ |
| 2 | Fill the Table | สร้างตารางสามเหลี่ยม $n \times n$ แต่ละช่อง $[i,j]$ เก็บ non-terminal ที่แตกเป็นช่วงคำนั้นได้ |
| 3 | Combine Spans | ในแต่ละช่อง ลองทุกจุดแบ่ง (split point) แล้วรวม non-terminal จากสองช่วงย่อยด้านล่าง |
| 4 | Check the Root | ประโยคถูกไวยากรณ์ ถ้า S ปรากฏในช่องบนสุดที่คลุมทั้งประโยค |

### เติมตารางอย่างไร

**กฎการเติมช่อง $[i, j]$:** ช่วง $i..j$ แบ่งครึ่งได้ที่จุด $k$ ทุกจุด ($i \le k < j$) สำหรับแต่ละจุดแบ่ง ให้ตรวจว่า

```text
ถ้า  B ∈ table[i, k]
และ  C ∈ table[k+1, j]
และมีกฎ  A → B C  ในไวยากรณ์
ให้ใส่ A ลงใน table[i, j]
```

**ลำดับการเติม**

- เติมจากช่วงสั้นไปหาช่วงยาว (bottom-up)
- เติมทีละคอลัมน์จากซ้ายไปขวา แต่ละคอลัมน์เติมจากล่างขึ้นบน
- รับประกันว่าเมื่อถึงช่อง $[i, j]$ ข้อมูลที่ต้องใช้ (ด้านซ้ายและด้านล่าง) ถูกเติมครบแล้ว

**Pseudocode (Fig 18.12)**

```text
function CKY-Parse(words, grammar) returns table
  for j ← from 1 to Length(words) do
    for all {A | A → words[j] ∈ grammar}
      table[j-1, j] ← table[j-1, j] ∪ A
    for i ← from j-2 down to 0 do
      for k ← i+1 to j-1 do
        for all {A | A → B C ∈ grammar and B ∈ table[i,k] and C ∈ table[k,j]}
          table[i,j] ← table[i,j] ∪ A
```

3 ลูปซ้อนกัน ($j$, $i$, $k$) → ความซับซ้อน $O(n^3)$ และคูณด้วยขนาดไวยากรณ์ $|G|$

> หมายเหตุ: pseudocode นี้ใช้ดัชนีเริ่มที่ 0 ส่วนตัวอย่างลงมือทำ (walkthrough) ด้านล่างใช้ช่อง $[1,1]$ ถึง $[4,4]$ เริ่มที่ 1 ที่นี่ยึดตัวอย่างลงมือทำเป็นหลัก

### CYK Walkthrough: "แมว ดำ กิน ปลา" (แมวสีดำกินปลา)

**ไวยากรณ์ CNF**

```text
S   → NP VP          NP  → แมว | ปลา
NP  → N ADJ          N   → แมว | ปลา
VP  → V NP           ADJ → ดำ ;  V → กิน
```

**ขั้นแรก: เติมแถวทแยงมุม (ช่วงยาว 1 คำ)** ใส่หมวดคำของแต่ละคำลงในช่อง $[i,i]$ ("แมว" และ "ปลา" เป็นได้ทั้ง N และ NP เพราะผลของ unit production ตอนทำ CNF)

| | 1. แมว | 2. ดำ | 3. กิน | 4. ปลา |
|---|---|---|---|---|
| **[1,*]** | [1,1] = N, NP | | | |
| **[2,*]** | | [2,2] = ADJ | | |
| **[3,*]** | | | [3,3] = V | |
| **[4,*]** | | | | [4,4] = NP, N |

**เติมช่วงที่ยาวขึ้น จนพบ S**

| ช่วง | จุดแบ่ง | ผล |
|---|---|---|
| 2 คำ [1,2] "แมว ดำ" | k=1: N ∈ [1,1] และ ADJ ∈ [2,2] → มีกฎ NP → N ADJ | ใส่ **NP** |
| 2 คำ [2,3] "ดำ กิน" | k=2: ADJ และ V → ไม่มีกฎใดรองรับ | ว่าง |
| 2 คำ [3,4] "กิน ปลา" | k=3: V ∈ [3,3] และ NP ∈ [4,4] → มีกฎ VP → V NP | ใส่ **VP** |
| 3 คำ [1,3] และ [2,4] | ทุกจุดแบ่งไม่มีคู่ใดเข้ากฎได้เลย | ว่างทั้งสองช่อง |
| 4 คำ [1,4] ทั้งประโยค | k=2: NP ∈ [1,2] และ VP ∈ [3,4] → มีกฎ S → NP VP | ใส่ **S** |

**ตารางสุดท้าย**

| | 1. แมว | 2. ดำ | 3. กิน | 4. ปลา |
|---|---|---|---|---|
| **1** | N, NP | NP | - | **S** |
| **2** | | ADJ | - | - |
| **3** | | | V | VP |
| **4** | | | | NP, N |

S อยู่ในช่อง $[1,4]$ → ประโยคถูกไวยากรณ์

### Recovering the Parse Tree (Recognizer → Parser)

- อัลกอริทึมพื้นฐานเป็นเพียง **recognizer** บอกได้แค่ว่าประโยคถูกไวยากรณ์หรือไม่
- แก้ 2 จุดให้กลายเป็น **parser:** เก็บ backpointer ชี้กลับไปยังช่องที่ใช้สร้าง และยอมให้ non-terminal เดียวกันปรากฏหลายครั้งในช่องเดียว

**Backpointer ของตัวอย่างนี้**

```text
S  @[1,4] <- NP[1,2] + VP[3,4]
NP @[1,2] <- N[1,1] + ADJ[2,2]
VP @[3,4] <- V[3,3] + NP[4,4]
```

อ่านผล: [NP แมว ดำ] คือประธาน, [VP กิน [NP ปลา]] คือภาคแสดง

```text
S
├── NP
│   ├── N ── แมว
│   └── ADJ ── ดำ
└── VP
    ├── V ── กิน
    └── NP ── ปลา
```

### ความซับซ้อนของ CYK

**ที่มาของ $O(n^3)$**

- จำนวนช่องในตาราง $= n(n+1)/2 \approx O(n^2)$
- แต่ละช่องต้องลองจุดแบ่ง $k$ ได้มากถึง $n$ จุด $\to O(n)$
- รวมกันเป็น $O(n^3)$ และคูณด้วยขนาดไวยากรณ์ $|G|$

$$\text{CYK} = O(n^3 \cdot |G|) \qquad n = \text{จำนวนคำในประโยค}, \; |G| = \text{จำนวนกฎในไวยากรณ์}$$

| ความยาวประโยค ($n$) | จำนวนช่องในตาราง | จำนวนการลองจุดแบ่ง $\sim n^3$ |
|---|---|---|
| 4 คำ (ตัวอย่างของเรา) | 10 | 64 |
| 10 คำ | 55 | 1,000 |
| 20 คำ | 210 | 8,000 |

เทียบกับ Viterbi ที่เป็น $O(N \cdot T^2)$ เชิงเส้นตามความยาวประโยค CYK แพงกว่ามากเพราะต้องพิจารณา "ทุกช่วง" ไม่ใช่แค่ทุกตำแหน่ง

## 4. PCFG + CYK (Probabilistic CYK)

**ปัญหาที่ต้องแก้**

- CYK ธรรมดาเก็บ parse ทุกแบบไว้ในตาราง แต่ "ไม่เลือก" ว่าอันไหนดีที่สุด
- ประโยคจริงอาจมี parse หลายสิบแบบ ต้องการอันเดียวที่น่าจะถูกที่สุด
- ทางแก้: ให้แต่ละช่องเก็บ "ความน่าจะเป็นสูงสุด" ของ non-terminal นั้นแทนที่จะเก็บแค่ว่ามีหรือไม่มี

**สูตร Probabilistic CYK**

$$\text{table}[i,j,A] = \max_{i \le k < j} \; P(A \to B\,C) \times \text{table}[i,k,B] \times \text{table}[k+1,j,C]$$

เก็บ backpointer ของ $(k, B, C)$ ที่ให้ค่าสูงสุด

**ความคล้ายกับ Viterbi**

| | สูตร | เลือกอะไร |
|---|---|---|
| Viterbi | $v_t(j) = \max_i\, v_{t-1}(i) \times a_{ij} \times b_j(o_t)$ | เส้นทางที่ดีที่สุดใน "ลำดับ" |
| Probabilistic CYK | สูตรด้านบน | วิธีประกอบที่ดีที่สุดใน "โครงสร้างต้นไม้" |

ใช้ max + backpointer เหมือนกันทุกประการ ต่างกันแค่มิติของปัญหาย่อย

## 5. Transition-Based Dependency Parsing

### Configuration และตัวดำเนินการ

**Configuration** = สถานะของ parser

| ส่วนประกอบ | ความหมาย |
|---|---|
| Stack | คำที่กำลังพิจารณา (เริ่มด้วย [ROOT]) |
| Buffer | คำที่ยังไม่ได้อ่าน (เริ่มด้วยทั้งประโยค) |
| Relations | เซตของขอบ dependency ที่สร้างแล้ว |

**เป้าหมาย:** เริ่มจาก configuration ตั้งต้น แล้วเลือก "transition" ไปเรื่อยๆ จนถึงสถานะสุดท้ายที่ stack เหลือแค่ ROOT และ buffer ว่าง เซต relations ที่ได้คือ dependency tree

```text
function DependencyParse(words) returns dependency tree
  state ← {[root], [words], []}      ; initial configuration
  while state not final
    t ← Oracle(state)                ; choose a transition operator to apply
    state ← Apply(t, state)          ; apply it, creating a new state
  return state
```

**ตัวดำเนินการ 3 แบบ (arc-standard)**

| ตัวดำเนินการ | ทำอะไร |
|---|---|
| SHIFT | ย้ายคำหน้าสุดของ buffer ขึ้นไปวางบน stack |
| LEFTARC | สร้างขอบจากคำบนสุดของ stack → คำที่อยู่ถัดลงไป แล้วลบคำที่อยู่ถัดลงไปออก (คำล่างเป็น dependent) |
| RIGHTARC | สร้างขอบจากคำที่อยู่ถัดลงไป → คำบนสุด แล้วลบคำบนสุดออก (คำบนเป็น dependent) |

**เงื่อนไข:** LEFTARC ใช้กับ ROOT ไม่ได้ และทั้งสอง arc ต้องมีคำใน stack $\ge 2$ ตัว

### Trace "เด็ก กิน ข้าว"

| Step | Stack | Buffer | Action | Relation ที่เพิ่ม |
|---|---|---|---|---|
| 0 | [ROOT] | [เด็ก, กิน, ข้าว] | SHIFT | - |
| 1 | [ROOT, เด็ก] | [กิน, ข้าว] | SHIFT | - |
| 2 | [ROOT, เด็ก, กิน] | [ข้าว] | LEFTARC(nsubj) | กิน → เด็ก |
| 3 | [ROOT, กิน] | [ข้าว] | SHIFT | - |
| 4 | [ROOT, กิน, ข้าว] | [ ] | RIGHTARC(obj) | กิน → ข้าว |
| 5 | [ROOT, กิน] | [ ] | RIGHTARC(root) | ROOT → กิน |
| 6 | [ROOT] | [ ] | Done | - |

**ผลลัพธ์ Dependency Tree**

```text
ROOT --root--> กิน
กิน  --nsubj--> เด็ก
กิน  --obj----> ข้าว
```

ใช้ทั้งหมด 6 transitions $= 2n$ เมื่อ $n = 3$ คำ มีความซับซ้อน $O(n)$ เชิงเส้น

### ตัวอย่างจากตำรา (Fig 19.6): "book me the morning flight"

| Step | Stack | Word List | Action | Relation Added |
|---|---|---|---|---|
| 0 | [root] | [book, me, the, morning, flight] | SHIFT | |
| 1 | [root, book] | [me, the, morning, flight] | SHIFT | |
| 2 | [root, book, me] | [the, morning, flight] | RIGHTARC | (book → me) |
| 3 | [root, book] | [the, morning, flight] | SHIFT | |
| 4 | [root, book, the] | [morning, flight] | SHIFT | |
| 5 | [root, book, the, morning] | [flight] | SHIFT | |
| 6 | [root, book, the, morning, flight] | [] | LEFTARC | (morning ← flight) |
| 7 | [root, book, the, flight] | [] | LEFTARC | (the ← flight) |
| 8 | [root, book, flight] | [] | RIGHTARC | (book → flight) |
| 9 | [root, book] | [] | RIGHTARC | (root → book) |
| 10 | [root] | [] | Done | |

### Oracle

**What is oracle**

- Oracle คือตัวตัดสินใจว่า **ควรใช้ transition ใดในแต่ละ configuration** ฝึกด้วย supervised learning
- แต่ treebank ให้ "ประโยคคู่กับต้นไม้" ไม่ได้ให้ "configuration คู่กับ transition"
- ทางแก้: จำลองการทำงานของ parser บน **ต้นไม้เฉลย** เพื่อผลิตคู่ (configuration, transition) ออกมาเอง

**Training Oracle: กฎการเลือก** (S1 = คำบนสุดของ stack, S2 = คำถัดลงไป)

| Transition | เลือกเมื่อ |
|---|---|
| LEFTARC(r) | ถ้า (S1 r S2) อยู่ในต้นไม้เฉลย |
| RIGHTARC(r) | ถ้า (S2 r S1) อยู่ในเฉลย **และ** dependent ของ S1 ครบแล้ว |
| SHIFT | กรณีอื่นๆ ทั้งหมด |

**ทำไม RIGHTARC ต้องมีเงื่อนไขพิเศษ?** เพราะ RIGHTARC จะ "ลบ" คำบนสุดออกจาก stack ถ้าลบเร็วเกินไปทั้งที่คำนั้นยังมี dependent รออยู่ใน buffer ก็จะไม่มีโอกาสเชื่อมอีกเลย เงื่อนไขนี้บังคับให้รอจนกว่า dependent ทุกตัวจะถูกเชื่อมครบก่อน

**Feature-based Classifier แบบดั้งเดิม**

- ดึง feature จาก configuration เช่น คำและ POS ของ s1, s2 (บน stack) และ b1 (หน้า buffer)
- ตัวอย่าง feature ผสม: s1.t ∘ s2.t = "NNS ∘ VBD"
- ใช้ classifier ใดก็ได้ เช่น logistic regression หรือ SVM

### Neural Transition-Based Parsing

**Architecture**

1. ส่งทั้งประโยคผ่าน encoder (เช่น BiLSTM หรือ Transformer) เพื่อได้เวกเตอร์แทนแต่ละคำ
2. ดึงเวกเตอร์ของคำ 2 ตัวบนสุดของ stack (s1, s2) และคำแรกของ buffer (b1)
3. นำมาต่อกัน (concatenate) แล้วส่งเข้า feedforward network
4. ใช้ softmax เลือก transition ที่จะทำ (SHIFT / LEFTARC / RIGHTARC พร้อม label)
5. ฝึกด้วย cross-entropy loss เทียบกับ transition ที่ถูกต้องจาก training oracle

ข้อดี: ไม่ต้องออกแบบ feature เอง และ encoder เห็นบริบททั้งประโยค (Kiperwasser & Goldberg, 2016 เป็นพื้นฐานของ parser สมัยใหม่จำนวนมาก)

## 6. Chart Parsing vs. Transition Parsing

| ประเด็น | Chart Parsing (CYK) | Transition-Based Parsing |
|---|---|---|
| ผลลัพธ์ | Constituency tree (วลีซ้อนชั้น) | Dependency tree (ขอบระหว่างคำ) |
| วิธีค้นหา | Dynamic Programming สำรวจครบทุกความเป็นไปได้ | Greedy เลือกทีละก้าวโดยไม่ย้อนกลับ |
| ความซับซ้อน | $O(n^3 \cdot \lvert G \rvert)$ | $O(n)$ เชิงเส้น |
| ความสมบูรณ์ | รับประกันว่าพบ parse ที่ดีที่สุด (exact) | ไม่รับประกัน: เลือกผิดก้าวเดียวแล้วผิดยาว |
| ข้อจำกัด | ต้องแปลงไวยากรณ์เป็น CNF ก่อน | arc-standard สร้างได้เฉพาะต้นไม้ projective |
| เหมาะกับ | งานที่ต้องการโครงสร้างวลีครบถ้วนและแม่นยำ | งานที่ต้องการความเร็วสูงกับข้อความจำนวนมาก |

**ทางสายกลาง:** Graph-Based Dependency Parsing ใช้การหา Maximum Spanning Tree บนกราฟของคะแนนทุกคู่คำ ได้ผลลัพธ์ที่ดีที่สุดแบบ exact และรองรับต้นไม้ non-projective ด้วย แต่ช้ากว่า transition-based

## 7. Real-World Parsers

| Parser | ชนิด | รายละเอียด |
|---|---|---|
| spaCy | Dependency | ไลบรารี Python ที่ใช้ในอุตสาหกรรมมากที่สุด เป็น transition-based neural parser ที่เร็วมาก รองรับหลายภาษา |
| Stanza (Stanford NLP) | Dependency | Neural pipeline ครบวงจร (tokenize → POS → parse) รองรับกว่า 70 ภาษาตามมาตรฐาน UD |
| Berkeley Neural Parser | Constituency | Span-based neural parser ให้คะแนนแต่ละ span แล้วใช้ CYK แบบดัดแปลงหาต้นไม้ที่ดีที่สุด |
| UDPipe | Dependency | เครื่องมือฝึกและใช้งาน parser ตามมาตรฐาน UD ได้เองกับภาษาใดก็ได้ที่มี treebank |
| PyThaiNLP | ภาษาไทย | ชุดเครื่องมือ NLP ภาษาไทย ครอบคลุมตั้งแต่ตัดคำ POS tagging ไปจนถึง dependency parsing |

แนวโน้มปัจจุบัน: parser เชิงพาณิชย์เกือบทั้งหมดเป็น neural และหลายงานเริ่มใช้ LLM ทำ parsing โดยตรง แต่ความเข้าใจ CYK และ transition-based ยังจำเป็น เพราะเป็นรากฐานของวิธีเหล่านั้น

## 8. Parsing Evaluation

### PARSEVAL: วัดผล Constituency Parser

**หลักการ**

- ไม่ใช้ exact match (ทั้งต้นไม้ต้องตรงเป๊ะ) เพราะเข้มงวดเกินไปจนแยกความแตกต่างไม่ได้
- แทนที่ด้วยการนับ "constituent" ที่ถูกต้อง: แต่ละ constituent ระบุด้วย (label, จุดเริ่ม, จุดจบ)
- เพิ่มตัวชี้วัด **cross-brackets:** จำนวนครั้งที่เฉลยจัดกลุ่มเป็น ((A B) C) แต่ระบบจัดเป็น (A (B C))

$$\text{Labeled Precision} = \frac{\text{ถูก}}{\text{ที่ระบบตอบ}} \qquad \text{Labeled Recall} = \frac{\text{ถูก}}{\text{ที่มีในเฉลย}} \qquad F_1 = \frac{2PR}{P + R}$$

**ตัวอย่างจากสไลด์ (ประโยค "แมว ดำ กิน ปลา")**

| Constituent | เฉลย | ระบบ | ผล |
|---|---|---|---|
| S (1-4) | ✓ | ✓ | ถูก |
| NP (1-2) | ✓ | ✓ | ถูก |
| VP (3-4) | ✓ | ✓ | ถูก |
| NP (4-4) | ✓ | ✗ | พลาด |
| NP (3-4) | ✗ | ✓ | เกินมา |

ระบบตอบ 4 อัน ถูก 3 อัน, เฉลยมี 4 อัน ระบบจับได้ 3 อัน

$$P = \frac{3}{4} = 0.75 \qquad R = \frac{3}{4} = 0.75 \qquad F_1 = 0.75$$

### UAS / LAS: วัดผล Dependency Parser

| ตัวชี้วัด | ความหมาย |
|---|---|
| UAS (Unlabeled Attachment Score) | ดูแค่ว่า head ถูกไหม |
| LAS (Labeled Attachment Score) | head ต้องถูก **และ** label ต้องถูกด้วย |

**ตัวอย่างจากสไลด์:** "เด็ก เห็น ผู้ชาย ด้วย กล้อง" (5 คำ)

| คำ | เฉลย: head / label | ระบบ: head / label | head ถูก? | label ถูก? |
|---|---|---|---|---|
| เด็ก | เห็น / nsubj | เห็น / nsubj | ✓ | ✓ |
| เห็น | ROOT / root | ROOT / root | ✓ | ✓ |
| ผู้ชาย | เห็น / obj | เห็น / iobj | ✓ | ✗ |
| ด้วย | กล้อง / case | กล้อง / case | ✓ | ✓ |
| กล้อง | เห็น / obl | ผู้ชาย / nmod | ✗ | ✗ |

$$\text{UAS} = \frac{4}{5} = 0.80 \qquad \text{LAS} = \frac{3}{5} = 0.60$$

head ถูก 4 จาก 5 คำ (ผิดเฉพาะ "กล้อง") และทั้ง head กับ label ถูก 3 จาก 5 คำ

---

# ตัวอย่างโจทย์

ตัวอย่างโจทย์จากสไลด์ 3.1 ข้อ 1 ถึง 4 ใช้ประโยค "แมว ดำ กิน ปลา" ต่อเนื่องกัน ข้อ 5 ถึง 6 เป็น PCFG (ข้อ 6 ใช้ treebank จาก Lab 3) และข้อ 7 ถึง 8 เป็น dependency parsing ตัวเลขทุกตัวตรวจซ้ำด้วยโปรแกรมแล้ว

### ข้อ 1  กำหนดไวยากรณ์ต่อไปนี้ จงเขียน derivation และวาด parse tree ของประโยค "แมว ดำ กิน ปลา"

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

### ข้อ 2  จากไวยากรณ์ในข้อ 1 จงแปลงเป็น Chomsky Normal Form (CNF)

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

### ข้อ 3  จากไวยากรณ์ CNF ในข้อ 2 จงใช้ CYK ตรวจว่าประโยค "แมว ดำ กิน ปลา" ถูกไวยากรณ์หรือไม่ และดึง parse tree

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

$\mathbf{Ans}\quad S\in[1,4]$ ดังนั้นประโยค**ถูกไวยากรณ์** และ parse tree คือ $\left[_S\ \left[_{NP}\ [_N\ \text{แมว}]\ [_{ADJ}\ \text{ดำ}]\right]\ \left[_{VP}\ [_V\ \text{กิน}]\ [_{NP}\ \text{ปลา}]\right]\right]$ (เหมือนข้อ 1)

---

### ข้อ 4  ระบบ parse ประโยค "แมว ดำ กิน ปลา" ตอบ constituent $S(1\text{-}4),\ NP(1\text{-}2),\ VP(3\text{-}4),\ NP(3\text{-}4)$ ส่วนเฉลยคือ $S(1\text{-}4),\ NP(1\text{-}2),\ VP(3\text{-}4),\ NP(4\text{-}4)$ จงหา Labeled Precision, Recall และ $F_1$ (PARSEVAL)

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

### ข้อ 5  กำหนดกฎ PCFG ดังนี้ ประโยค "I shot an elephant in my pajamas" มี 2 parse คือ A (PP ต่อกับ NP: ช้างใส่ชุดนอน) และ B (PP ต่อกับ VP: ฉันใส่ชุดนอน) จงหา $P(T)$ ของแต่ละ parse และบอกว่า PCFG เลือก parse ใด

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

### ข้อ 6  กำหนด treebank 6 ต้นต่อไปนี้ (จาก Lab 3) จงหา $P(VP\to V\ NP)$, $P(VP\to VP\ PP)$, $P(NP\to Det\ N)$ และ $P(NP\to NP\ PP)$

1. `(S (NP (Det the) (N boy)) (VP (V saw) (NP (Det a) (N dog))))`
2. `(S (NP (Det a) (N man)) (VP (V saw) (NP (Det the) (N park))))`
3. `(S (NP (Det the) (N dog)) (VP (V saw) (NP (Det the) (N boy))))`
4. `(S (NP (Det the) (N boy)) (VP (VP (V saw) (NP (Det a) (N man))) (PP (P in) (NP (Det the) (N park)))))`
5. `(S (NP (Det a) (N dog)) (VP (VP (V saw) (NP (Det a) (N man))) (PP (P with) (NP (Det a) (N telescope)))))`
6. `(S (NP (NP (Det the) (N man)) (PP (P with) (NP (Det a) (N telescope)))) (VP (V saw) (NP (Det the) (N dog))))`

$\mathbf{Sol}^{n}$

ใช้ $P(A\to\beta)=\dfrac{\text{Count}(A\to\beta)}{\text{Count}(A)}$ คือนับจำนวนครั้งที่ใช้กฎนั้น หารด้วยจำนวนครั้งที่ $A$ เป็น LHS ทั้งหมด

| ต้นที่ | นับ $VP$ (ทุกครั้งที่เป็น LHS) | $VP\to V\ NP$ | $VP\to VP\ PP$ |
|:---:|:---:|:---:|:---:|
| 1 | 1 | 1 | 0 |
| 2 | 1 | 1 | 0 |
| 3 | 1 | 1 | 0 |
| 4 | 2 ($VP$ ใน + $VP$ นอก) | 1 | 1 |
| 5 | 2 | 1 | 1 |
| 6 | 1 | 1 | 0 |
| รวม | 8 | 6 | 2 |

$NP$ เป็น LHS ทั้งหมด $16$ ครั้ง ต้น 1 ถึง 3 ต้นละ 2 (รวม 6) ต้น 4 และ 5 ต้นละ 3 (รวม 6) และต้น 6 มี 4 ($NP$ นอก "the man" "a telescope" และ "the dog") โดย $NP\to NP\ PP$ ใช้ 1 ครั้ง (ต้น 6) ที่เหลือ 15 ครั้งเป็น $NP\to Det\ N$

$$
\begin{aligned}
P(VP\to V\ NP) &= \tfrac{6}{8} = 0.75 \\
P(VP\to VP\ PP) &= \tfrac{2}{8} = 0.25 \\
P(NP\to Det\ N) &= \tfrac{15}{16} = 0.9375 \\
P(NP\to NP\ PP) &= \tfrac{1}{16} = 0.0625
\end{aligned}
$$

$\mathbf{Ans}\quad P(VP\to V\ NP)=\mathbf{0.75},\ P(VP\to VP\ PP)=\mathbf{0.25},\ P(NP\to Det\ N)=\mathbf{0.9375},\ P(NP\to NP\ PP)=\mathbf{0.0625}$

หมายเหตุ ข้อความอธิบายใน Lab 3 เขียนว่า $VP\to V\ NP$ ได้ $0.667$ และ $VP\to VP\ PP$ ได้ $0.333$ แต่การนับตาม treebank ข้างบนได้ $0.75$ และ $0.25$ (ตรวจนับซ้ำด้วยโปรแกรมแล้ว)

---

### ข้อ 7  จงแสดงขั้นตอน arc-standard transition-based dependency parsing ของประโยค "เด็ก กิน ข้าว" ทีละ step (stack, buffer, action, relation ที่เพิ่ม) เมื่อต้นไม้เฉลยคือ $\text{กิน}\to\text{เด็ก}$ (nsubj), $\text{กิน}\to\text{ข้าว}$ (obj) และ $\text{ROOT}\to\text{กิน}$ (root)

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

### ข้อ 8  ประโยค "เด็ก เห็น ผู้ชาย ด้วย กล้อง" มีเฉลยและผลของระบบดังตาราง จงหา UAS และ LAS

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
