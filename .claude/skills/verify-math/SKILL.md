---
name: verify-math
description: Verify NLP calculation content by program before writing it into content/midterm/exam_practice.md - token/type counts, normalization, BPE merges, FMM/BMM segmentation, HMM and Viterbi tables, CRF word shape, BIO tags, CNF conversion, PCFG probabilities, CYK tables, transition-based parsing, PARSEVAL/UAS/LAS, cosine, PMI/PPMI, TF-IDF, skip-gram, GloVe ratios, word similarity rank correlation, analogies, and KaTeX/SVG validity. Use before adding or changing any number, table value, tag sequence, parse or figure.
---

# verify-math

Nothing is written into `content/` unless a program has confirmed it. Use Python (standard library) for the calculations and Node + KaTeX for formula and SVG checks. Recompute from the **given data of the problem**, not from the previous answer.

Rounding rule: show the same number of decimals as the neighboring items in the file and say so in the solution when a value is rounded. Probabilities in HMM and PCFG are usually written exactly (fractions or short decimals).

## 1. Tokenization (ข้อ 2)

```python
from collections import Counter
text = "new renew new renew set reset"
tokens = text.split()
types = set(tokens)
print(len(tokens), len(types))          # token = every occurrence, type = distinct words

# BPE training: words weighted by frequency, merge the most frequent adjacent pair each round
def bpe_train(words, rounds):
    vocab = {tuple(w): c for w, c in Counter(words).items()}
    merges = []
    for _ in range(rounds):
        pairs = Counter()
        for sym, c in vocab.items():
            for a, b in zip(sym, sym[1:]):
                pairs[(a, b)] += c
        if not pairs:
            break
        best = max(pairs.items(), key=lambda kv: (kv[1], ))[0]   # tie rule: state it; check how ties are broken in the problem
        merges.append(best)
        new = {}
        for sym, c in vocab.items():
            out, i = [], 0
            while i < len(sym):
                if i < len(sym) - 1 and (sym[i], sym[i + 1]) == best:
                    out.append(sym[i] + sym[i + 1]); i += 2
                else:
                    out.append(sym[i]); i += 1
            new[tuple(out)] = new.get(tuple(out), 0) + c
        vocab = new
    return merges, vocab
```

When two pairs tie, write which one is taken and why (first found, alphabetical, longer) in the solution and make sure the tie rule is the same as the lecture example.

## 2. Word segmentation (ข้อ 3.1)

```python
def fmm(s, d):
    out, i = [], 0
    while i < len(s):
        for j in range(len(s), i, -1):
            if s[i:j] in d or j == i + 1:      # single character fallback: say so in the solution
                out.append(s[i:j]); i = j; break
    return out

def bmm(s, d):
    out, j = [], len(s)
    while j > 0:
        for i in range(0, j):
            if s[i:j] in d or i == j - 1:
                out.append(s[i:j]); j = i; break
    return out[::-1]
```

For statistical segmentation, enumerate every segmentation of the string, compute the product of word probabilities for each, and confirm the best one.

## 3. HMM, Viterbi, tagging (ข้อ 3.2)

```python
def viterbi(obs, states, pi, A, B):
    V = [{s: pi[s] * B[s].get(obs[0], 0) for s in states}]
    bp = [{}]
    for t in range(1, len(obs)):
        V.append({}); bp.append({})
        for s in states:
            p, prev = max((V[t - 1][r] * A[r][s] * B[s].get(obs[t], 0), r) for r in states)
            V[t][s], bp[t][s] = p, prev
    last = max(V[-1], key=V[-1].get)
    path = [last]
    for t in range(len(obs) - 1, 0, -1):
        path.append(bp[t][path[-1]])
    return V, bp, path[::-1]
```

Check every table cell, every backpointer, and the final path. Also brute-force all `|S|^T` tag sequences for small problems and confirm the same best path. Complexity statements: Viterbi is O(N^2 T) time for N states and T words; say which quantity the problem asks for.

Word shape (CRF): map uppercase to `X`, lowercase to `x`, digits to `d`, keep other characters; the short form collapses runs. Recompute from the rule given in the slide, not from memory.

## 4. Sequence labeling tags (ข้อ 3.3)

Convert spans to BIO, IO and BIOES programmatically from the entity spans and compare with the table in the content. In BIO, `B-X` starts an entity and `I-X` continues; in IO there is no `B`; in BIOES single-token entities are `S-X`.

## 5. Grammar and parsing (ข้อ 4)

```python
# CYK for a CNF grammar: rules_bin = {(B, C): {A,...}}, rules_term = {word: {A,...}}
def cyk(words, rules_bin, rules_term):
    n = len(words)
    T = [[set() for _ in range(n + 1)] for _ in range(n + 1)]   # T[i][j] = non-terminals spanning words[i:j]
    for i, w in enumerate(words):
        T[i][i + 1] = set(rules_term.get(w, ()))
    for span in range(2, n + 1):
        for i in range(0, n - span + 1):
            j = i + span
            for k in range(i + 1, j):
                for B in T[i][k]:
                    for C in T[k][j]:
                        T[i][j] |= rules_bin.get((B, C), set())
    return T
```

- CNF conversion: after converting, check that the new grammar accepts and rejects the same sentences as the original for a handful of strings (or compare parse counts with the CYK above).
- PCFG: probability of a tree = product of the probabilities of the rules used; check that the probabilities of all rules with the same left-hand side sum to 1; compute every candidate tree and confirm which is larger. Count the number of parses with a CYK variant that counts instead of storing sets.
- Transition-based dependency parsing (`SHIFT`, `LEFTARC`, `RIGHTARC`): replay the transition list on stack and buffer with a script, print every configuration, and confirm that the resulting arcs equal the gold arcs.
- PARSEVAL: list the constituents `(label, i, j)` of both trees as sets; precision = |gold ∩ pred| / |pred|, recall = |gold ∩ pred| / |gold|, F1 = 2PR/(P+R). UAS = share of words with the right head; LAS = share with the right head and label. State whether punctuation and the root are counted.

## 6. Word embeddings (ข้อ 5)

```python
import math
def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    return dot / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)))

def pmi(c_wc, c_w, c_c, total):               # counts of the pair, the word, the context, and all pairs
    return math.log2((c_wc / total) / ((c_w / total) * (c_c / total)))
def ppmi(*args):
    return max(pmi(*args), 0.0)

def tfidf(tf, df, N, variant):
    return variant(tf, df, N)                 # use the exact formula of the slide, e.g. tf * log10(N / df)
```

- Use the logarithm base given in the slide (log base 2 for PMI, log base 10 for the slide's IDF) and say which.
- Positive and negative pairs for skip-gram: enumerate the window pairs from the sentence and list them programmatically.
- FastText: generate character n-grams with the boundary markers `<` and `>` and the n range of the slide.
- GloVe ratios: compute `P(k|i) / P(k|j)` from the counts given.
- Word similarity: rank both lists and use the Spearman formula `1 - 6 Σd² / (n(n² - 1))` (no ties) and confirm with a script.
- Analogy: `vec(b) - vec(a) + vec(c)`, then the nearest vector by cosine excluding the three inputs.

## 7. KaTeX and SVG

```js
// node: every formula must compile in strict mode and print no warning
katex.renderToString(tex, { throwOnError: true, strict: "error", displayMode });
```

- Thai text inside math must be in `\text{...}` or `\textbf{...}`; `\mathbf{ไทย}` triggers the `unicodeTextInMathMode` warning.
- A pipe `|` inside a formula in a table cell breaks the table: use `\mid`.
- Check that no `<svg>` block contains a blank line:
  `python -c "import re,sys;t=open(sys.argv[1],encoding='utf8').read();print(sum('\n\n' in m for m in re.findall(r'<svg.*?</svg>',t,re.S)))" file.md` must print `0`.
- Count `array` column specs against cells per row; a mismatch prints a KaTeX warning.
- After drawing an SVG (parse tree), render it and look at it: labels not overlapping, edges meeting nodes, `currentColor` for strokes and text.

Tooling notes: when a Python script is created with a file-writing tool, use raw strings (`r"..."`) for anything with backslashes, because doubled backslashes can collapse and silently break LaTeX. On Windows run Thai-printing scripts as `python -X utf8` (with `-I` the `PYTHONIOENCODING` variable is ignored).

## 8. Report

When done, state what was verified and how (for example "FMM and BMM re-run on the given dictionary" or "Viterbi: every cell and the brute-force best path"). Report any mismatch, and any disagreement with the lecture slide, instead of adjusting the content to hide it.
